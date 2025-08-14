// WARNING: AFIP integration disabled for safe deploy
// The active implementation is commented below. To enable, remove this handler and uncomment the implementation.

export default async function handler(req, res) {
  return res.status(501).json({ ok: false, message: 'AFIP integration is disabled. Set AFIP_INTEGRATION_ENABLED=true and configure certificates to enable.' });
}

/*
Full implementation (commented out to avoid execution in production). Re-enable only when ready and after setting environment variables.

// Emisión de comprobantes usando WSAA + WSFEv1 (AFIP / ARCA)
// Basado en el ejemplo proporcionado por el usuario (loginCms / FECAESolicitar).
// Requisitos en el entorno:
// - openssl disponible en PATH
// - variables: AFIP_CUIT, AFIP_CERT_PATH, AFIP_KEY_PATH, AFIP_KEY_PASS (opcional), AFIP_ENV ('prod' o 'homo')
// - instalar dependencias: soap, xml2js

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import soap from 'soap';
import { parseStringPromise } from 'xml2js';
import { connectDB } from '../../../src/lib/mongodb';
import Order from '../../../src/models/Order';

const WSAA_HOMO = 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms';
const WSAA_PROD = 'https://wsaa.afip.gov.ar/ws/services/LoginCms';
const WSDL_HOMO = 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx?WSDL';
const WSDL_PROD = 'https://servicios1.afip.gov.ar/wsfev1/service.asmx?WSDL';

function isoNoMillis(date) { return date.toISOString().slice(0, 19) + 'Z'; }

function buildTRA(service = 'wsfe') {
  const now = new Date();
  const gen = new Date(now.getTime() - 2 * 60 * 1000);
  const exp = new Date(now.getTime() + 10 * 60 * 1000);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<LoginTicketRequest version="1.0">\n  <header>\n    <uniqueId>${Math.floor(now.getTime()/1000)}</uniqueId>\n    <generationTime>${isoNoMillis(gen)}</generationTime>\n    <expirationTime>${isoNoMillis(exp)}</expirationTime>\n  </header>\n  <service>${service}</service>\n</LoginTicketRequest>`;
}

async function loginCms({ certPath, keyPath, keyPass = '', service = 'wsfe', production = false }) {
  const tmpDir = os.tmpdir();
  const traPath = path.join(tmpDir, `tra-${Date.now()}.xml`);
  const cmsPath = path.join(tmpDir, `tra-${Date.now()}.cms`);
  fs.writeFileSync(traPath, buildTRA(service));

  // Firmar TRA con openssl (PKCS7 DER, nodetach)
  const cmd = [
    'openssl smime -sign',
    `-in ${traPath}`,
    `-signer ${certPath}`,
    `-inkey ${keyPath}`,
    keyPass ? `-passin pass:${keyPass}` : '',
    `-out ${cmsPath}`,
    '-outform DER',
    '-nodetach',
  ].filter(Boolean).join(' ');

  execSync(cmd);

  const cmsB64 = fs.readFileSync(cmsPath).toString('base64');
  const url = production ? WSAA_PROD : WSAA_HOMO;
  const client = await soap.createClientAsync(url + '?wsdl');
  const [resp] = await client.loginCmsAsync({ in0: cmsB64 });

  const ltrXml = resp.loginCmsReturn;
  const ltr = await parseStringPromise(ltrXml, { explicitArray: false });
  const cred = ltr.loginTicketResponse.credentials;
  return {
    token: cred.token,
    sign: cred.sign,
    expirationTime: ltr.loginTicketResponse.header.expirationTime,
  };
}

function yyyymmdd(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return Number(`${y}${m}${d}`);
}

async function emitirFactura({ cuitEmisor, cuitCliente = 0, ptoVta = 1, cbteTipo = 6, items = [], production = false, certPath, keyPath, keyPass = '' }) {
  // 1) Obtener TA
  const ta = await loginCms({ certPath, keyPath, keyPass, service: 'wsfe', production });

  // 2) Crear cliente WSFE
  const wsdl = production ? WSDL_PROD : WSDL_HOMO;
  const client = await soap.createClientAsync(wsdl);

  // 3) Último comprobante
  const [ult] = await client.FECompUltimoAutorizadoAsync({ Auth: { Token: ta.token, Sign: ta.sign, Cuit: cuitEmisor }, PtoVta: ptoVta, CbteTipo: cbteTipo });
  const last = Number(((ult && ult.FECompUltimoAutorizadoResult && ult.FECompUltimoAutorizadoResult.CbteNro) || 0));
  const nro = last + 1;

  // 4) Calcular importes desde items y agrupar por alícuota (10.5% y 21%)
  const groups = items.reduce((acc, it) => {
    const cantidad = Number(it.cantidad || it.qty || it.quantity || it.cantidad_producto || 1);
    const precio = Number(it.precio_unitario ?? it.precioUnitario ?? it.precio ?? it.precio_producto ?? 0);
    const iva = Number(it.iva ?? it.alicIva ?? 21);
    const net = cantidad * precio;
    const key = iva === 10.5 ? '10.5' : '21';
    if (!acc[key]) acc[key] = { iva, base: 0 };
    acc[key].base += net;
    acc.total += net;
    return acc;
  }, { total: 0 });

  const neto = Number(groups.total.toFixed(2));
  const ivaEntries = [];
  let ivaImporte = 0;
  if (groups['21']) {
    const base21 = Number(groups['21'].base.toFixed(2));
    const imp21 = Number((base21 * 0.21).toFixed(2));
    ivaEntries.push({ AlicIva: { Id: 5, BaseImp: base21, Importe: imp21 } });
    ivaImporte += imp21;
  }
  if (groups['10.5']) {
    const base105 = Number(groups['10.5'].base.toFixed(2));
    const imp105 = Number((base105 * 0.105).toFixed(2));
    // 10.5% usualmente corresponde a Id = 4 en AFIP
    ivaEntries.push({ AlicIva: { Id: 4, BaseImp: base105, Importe: imp105 } });
    ivaImporte += imp105;
  }

  const total = Number((neto + ivaImporte).toFixed(2));

  // 5) Construir request FECAESolicitar
  const feDet = {
    Concepto: 1,
    DocTipo: cuitCliente ? 80 : 99,
    DocNro: cuitCliente || 0,
    CbteDesde: nro,
    CbteHasta: nro,
    CbteFch: yyyymmdd(),
    ImpTotal: total,
    ImpTotConc: 0,
    ImpNeto: neto,
    ImpOpEx: 0,
    ImpIVA: ivaImporte,
    ImpTrib: 0,
    MonId: 'PES',
    MonCotiz: 1,
    Iva: ivaEntries,
  };

  const req = {
    Auth: { Token: ta.token, Sign: ta.sign, Cuit: cuitEmisor },
    FeCAEReq: {
      FeCabReq: { CantReg: 1, PtoVta: ptoVta, CbteTipo: cbteTipo },
      FeDetReq: { FECAEDetRequest: feDet },
    },
  };

  const [resp] = await client.FECAESolicitarAsync(req);
  return { ta, nro, resp: resp.FECAESolicitarResult };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const {
      cuit, // CUIT cliente (DocNro)
      items = [],
      ptoVta = Number(process.env.AFIP_PTO_VTA || 1),
      cbteTipo = Number(process.env.AFIP_TIPO_CBTE || 6),
      production = String(process.env.AFIP_ENV || 'homo').toLowerCase() === 'prod',
    } = body;

    const cuitEmisor = Number(process.env.AFIP_CUIT);
    const certPath = process.env.AFIP_CERT_PATH || process.env.AFIP_CERT_FILE;
    const keyPath = process.env.AFIP_KEY_PATH || process.env.AFIP_KEY_FILE;
    const keyPass = process.env.AFIP_KEY_PASS || '';

    if (!cuitEmisor || !certPath || !keyPath) {
      return res.status(500).json({ error: 'AFIP_CUIT, AFIP_CERT_PATH and AFIP_KEY_PATH must be configured on server' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Missing items array in body' });

    // Conectar DB si se va a persistir
    await connectDB();

    const { orderId } = body;

    const { nro, resp } = await emitirFactura({ cuitEmisor, cuitCliente: Number(cuit || 0), ptoVta, cbteTipo, items, production, certPath, keyPath, keyPass });

    // Persistir CAE y datos AFIP en la orden si viene orderId
    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (order) {
          order.tipoFactura = order.tipoFactura || {};
          order.tipoFactura.fecha = new Date();
          order.tipoFactura.cuit = String(cuit || '');
          // Guardar metadata de AFIP en metadata.afip
          order.metadata = order.metadata || {};
          order.metadata.afip = { comprobante: nro, respuesta: resp };
          await order.save();
        }
      } catch (e) {
        console.error('Error saving order with AFIP data', e);
      }
    }

    return res.status(200).json({ ok: true, comprobante: nro, result: resp });
  } catch (err) {
    console.error('Error emitting AFIP invoice:', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

*/
