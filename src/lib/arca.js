// src/lib/arca.js
// Cliente LOCAL de ARCA (ex AFIP): WSAA (login con certificado) + WSFEv1 (facturación electrónica).
// No usa servicios de terceros: el certificado y la clave nunca salen del servidor.
//
// Variables de entorno:
//   AFIP_ENV          "homo" | "prod"   (por defecto "homo": homologación/testing)
//   AFIP_CUIT         CUIT del emisor, solo números
//   AFIP_PTO_VTA      Punto de venta habilitado para "Factura en línea / Web Service" (ej: 6)
//   AFIP_CERT / AFIP_KEY            Contenido PEM (con \n escapados). Útil en Vercel.
//   AFIP_RES_FOLDER + AFIP_CERT_FILE + AFIP_KEY_FILE   Alternativa: archivos en disco.
//   AFIP_TA_FOLDER    (opcional) carpeta donde cachear el ticket de acceso (por defecto tmp del SO)
//
// IMPORTANTE: el certificado de homologación y el de producción son distintos
// (se generan por separado en ARCA) y el punto de venta debe ser del tipo "RECE para aplicativo y web services".

import fs from 'fs';
import os from 'os';
import path from 'path';
import soap from 'soap';
import forge from 'node-forge';
import { parseStringPromise } from 'xml2js';

export const CBTE_TIPO_FACTURA_C = 11;

const URLS = {
  homo: {
    wsaa: 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl',
    wsfe: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL',
  },
  prod: {
    wsaa: 'https://wsaa.afip.gov.ar/ws/services/LoginCms?wsdl',
    wsfe: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx?WSDL',
  },
};

export class ArcaError extends Error {
  constructor(message, { code, detalle, incierto = false } = {}) {
    super(message);
    this.name = 'ArcaError';
    this.code = code;
    this.detalle = detalle;
    // incierto = true: el pedido pudo haber llegado a ARCA aunque no recibimos respuesta.
    this.incierto = incierto;
  }
}

export function getConfig() {
  const env = process.env.AFIP_ENV === 'prod' ? 'prod' : 'homo';
  const cuit = String(process.env.AFIP_CUIT || '').replace(/\D/g, '');
  const ptoVta = Number(process.env.AFIP_PTO_VTA || 0);
  if (!cuit) throw new ArcaError('Falta AFIP_CUIT en las variables de entorno');
  if (!ptoVta) throw new ArcaError('Falta AFIP_PTO_VTA en las variables de entorno');
  return { env, cuit, ptoVta, urls: URLS[env] };
}

function leerCertificado() {
  const fromEnv = (v) => (v ? v.replace(/\\n/g, '\n') : null);
  let cert = fromEnv(process.env.AFIP_CERT);
  let key = fromEnv(process.env.AFIP_KEY);
  if (!cert || !key) {
    const dir = process.env.AFIP_RES_FOLDER;
    const certFile = process.env.AFIP_CERT_FILE;
    const keyFile = process.env.AFIP_KEY_FILE;
    if (!dir || !certFile || !keyFile) {
      throw new ArcaError('Falta configurar el certificado (AFIP_CERT/AFIP_KEY o AFIP_RES_FOLDER/AFIP_CERT_FILE/AFIP_KEY_FILE)');
    }
    cert = fs.readFileSync(path.join(dir, certFile), 'utf8');
    key = fs.readFileSync(path.join(dir, keyFile), 'utf8');
  }
  return { cert, key };
}

// Fecha/hora de Argentina (UTC-3) con formato aceptado por WSAA
function fechaHoraAR(offsetMs = 0) {
  const d = new Date(Date.now() + offsetMs - 3 * 3600 * 1000);
  return d.toISOString().replace(/\.\d{3}Z$/, '-03:00');
}

export function fechaARyyyymmdd(date = new Date()) {
  const d = new Date(date.getTime() - 3 * 3600 * 1000);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function firmarCms(xml, certPem, keyPem) {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(xml, 'utf8');
  const cert = forge.pki.certificateFromPem(certPem);
  const key = forge.pki.privateKeyFromPem(keyPem);
  p7.addCertificate(cert);
  p7.addSigner({
    key,
    certificate: cert,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: new Date() },
    ],
  });
  p7.sign();
  return forge.util.encode64(forge.asn1.toDer(p7.toAsn1()).getBytes());
}

// ---- WSAA ----
const memoriaTA = new Map();

function rutaTA(cfg) {
  const dir = process.env.AFIP_TA_FOLDER || os.tmpdir();
  return path.join(dir, `arca-ta-${cfg.env}-${cfg.cuit}-wsfe.json`);
}

function taVigente(ta) {
  // margen de 5 minutos
  return ta && new Date(ta.expiracion).getTime() - Date.now() > 5 * 60 * 1000;
}

async function obtenerTA(cfg) {
  const k = `${cfg.env}-${cfg.cuit}`;
  if (taVigente(memoriaTA.get(k))) return memoriaTA.get(k);

  try {
    const delDisco = JSON.parse(fs.readFileSync(rutaTA(cfg), 'utf8'));
    if (taVigente(delDisco)) {
      memoriaTA.set(k, delDisco);
      return delDisco;
    }
  } catch {
    /* sin cache en disco */
  }

  const { cert, key } = leerCertificado();
  const tra =
    `<?xml version="1.0" encoding="UTF-8"?><loginTicketRequest version="1.0"><header>` +
    `<uniqueId>${Math.floor(Date.now() / 1000)}</uniqueId>` +
    `<generationTime>${fechaHoraAR(-10 * 60 * 1000)}</generationTime>` +
    `<expirationTime>${fechaHoraAR(10 * 60 * 1000)}</expirationTime>` +
    `</header><service>wsfe</service></loginTicketRequest>`;
  const cms = firmarCms(tra, cert, key);

  let respuesta;
  try {
    const client = await soap.createClientAsync(cfg.urls.wsaa);
    const [res] = await client.loginCmsAsync({ in0: cms });
    respuesta = res.loginCmsReturn;
  } catch (e) {
    const msg = String(e?.root?.Envelope?.Body?.Fault?.faultstring || e.message || e);
    if (/alreadyAuthenticated|ya posee un TA valido/i.test(msg)) {
      throw new ArcaError(
        'ARCA ya emitió un ticket de acceso válido para este CUIT y no está guardado en este servidor. Esperá a que venza (≈12 h) o configurá AFIP_TA_FOLDER con una carpeta persistente.',
        { detalle: msg }
      );
    }
    throw new ArcaError(`No se pudo autenticar en ARCA (WSAA): ${msg}`, { detalle: msg });
  }

  const parsed = await parseStringPromise(respuesta, { explicitArray: false });
  const cred = parsed.loginTicketResponse.credentials;
  const ta = {
    token: cred.token,
    sign: cred.sign,
    expiracion: parsed.loginTicketResponse.header.expirationTime,
  };
  memoriaTA.set(k, ta);
  try {
    fs.writeFileSync(rutaTA(cfg), JSON.stringify(ta), { mode: 0o600 });
  } catch {
    /* no crítico */
  }
  return ta;
}

// ---- WSFE ----
async function clienteWsfe(cfg) {
  const ta = await obtenerTA(cfg);
  const client = await soap.createClientAsync(cfg.urls.wsfe);
  const Auth = { Token: ta.token, Sign: ta.sign, Cuit: cfg.cuit };
  return { client, Auth };
}

const arr = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);

function mensajes(lista, campo) {
  return arr(lista?.[campo]).map((m) => `(${m.Code}) ${m.Msg}`);
}

export async function ultimoComprobante(cfg, cbteTipo = CBTE_TIPO_FACTURA_C) {
  const { client, Auth } = await clienteWsfe(cfg);
  const [res] = await client.FECompUltimoAutorizadoAsync({ Auth, PtoVta: cfg.ptoVta, CbteTipo: cbteTipo });
  const r = res.FECompUltimoAutorizadoResult;
  const errs = mensajes(r.Errors, 'Err');
  if (errs.length) throw new ArcaError(`ARCA rechazó la consulta: ${errs.join(' | ')}`, { detalle: errs });
  return Number(r.CbteNro);
}

/**
 * Emite una Factura C.
 * @param {object} p
 * @param {number} p.total              Importe total en pesos (Factura C no discrimina IVA)
 * @param {number} p.docTipo            80 CUIT | 96 DNI | 99 Consumidor final sin identificar
 * @param {string|number} p.docNro
 * @param {number} p.condicionIvaReceptor  Id de condición IVA del receptor (1 RI, 4 Exento, 5 CF, 6 Monotributo, ...)
 * @param {1|2|3} [p.concepto=3]        1 Productos, 2 Servicios, 3 Productos y Servicios
 * @param {Date} [p.fecha]
 * @returns {{cae, caeVto, nroCbte, ptoVta, cbteTipo, fecha, ambiente}}
 */
export async function emitirFacturaC(p) {
  const cfg = getConfig();
  const { client, Auth } = await clienteWsfe(cfg);
  const total = Math.round(Number(p.total) * 100) / 100;
  if (!(total > 0)) throw new ArcaError('El total debe ser mayor a 0');

  const ultimo = await ultimoComprobante(cfg);
  const nro = ultimo + 1;
  const hoy = fechaARyyyymmdd(p.fecha);
  const concepto = p.concepto || 3;

  const det = {
    Concepto: concepto,
    DocTipo: p.docTipo,
    DocNro: Number(p.docNro) || 0,
    CbteDesde: nro,
    CbteHasta: nro,
    CbteFch: hoy,
    ImpTotal: total,
    ImpTotConc: 0,
    ImpNeto: total,
    ImpOpEx: 0,
    ImpIVA: 0,
    ImpTrib: 0,
    MonId: 'PES',
    MonCotiz: 1,
    CondicionIVAReceptorId: p.condicionIvaReceptor,
  };
  if (concepto !== 1) {
    det.FchServDesde = hoy;
    det.FchServHasta = hoy;
    det.FchVtoPago = hoy;
  }

  const req = {
    Auth,
    FeCAEReq: {
      FeCabReq: { CantReg: 1, PtoVta: cfg.ptoVta, CbteTipo: CBTE_TIPO_FACTURA_C },
      FeDetReq: { FECAEDetRequest: det },
    },
  };

  let res;
  try {
    [res] = await client.FECAESolicitarAsync(req);
  } catch (e) {
    // Sin respuesta confiable: el comprobante pudo haberse autorizado igual.
    throw new ArcaError(
      `Sin respuesta de ARCA al emitir (${e.message}). Verificá en ARCA si el comprobante N° ${nro} se emitió antes de reintentar.`,
      { incierto: true, detalle: e.message }
    );
  }

  const r = res.FECAESolicitarResult;
  const errs = mensajes(r.Errors, 'Err');
  const d = arr(r.FeDetResp?.FECAEDetResponse)[0];
  const obs = mensajes(d?.Observaciones, 'Obs');

  if (!d || d.Resultado !== 'A' || !d.CAE) {
    throw new ArcaError(
      `ARCA rechazó el comprobante: ${[...errs, ...obs].join(' | ') || 'sin detalle'}`,
      { detalle: [...errs, ...obs] }
    );
  }

  return {
    cae: String(d.CAE),
    caeVto: String(d.CAEFchVto),
    nroCbte: nro,
    ptoVta: cfg.ptoVta,
    cbteTipo: CBTE_TIPO_FACTURA_C,
    fecha: hoy,
    ambiente: cfg.env,
    observaciones: obs,
  };
}
