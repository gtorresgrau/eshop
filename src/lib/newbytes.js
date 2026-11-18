// Cliente de la API de New Bytes (mayorista) para dropshipping. SOLO servidor.
// Docs: https://conecta.nb.com.ar/integraciones/api-new-bytes/
//
// Env:
//   NB_API_URL   Sandbox: https://api-nb-dev.blu.net.ar/v1   |  Prod: https://api.nb.com.ar/v1
//   NB_USER, NB_PASSWORD  credenciales de la cuenta (login con mode "api")
//
// Notas: el token dura 3 hs y no hay refresh token; se vuelve a loguear al vencer.
// La documentación no describe la forma de varias respuestas (catálogo, cotización),
// por eso esos métodos devuelven el JSON crudo sin mapearlo.

const BASE = () => (process.env.NB_API_URL || 'https://api.nb.com.ar/v1').replace(/\/+$/, '');
const TOKEN_TTL_MS = 2.5 * 60 * 60 * 1000; // margen sobre las 3 hs reales

let cached = { token: null, expiresAt: 0, pending: null };

export class NBError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'NBError';
    this.status = status;
    this.body = body;
  }
}

async function parse(res) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

async function login() {
  const { NB_USER, NB_PASSWORD } = process.env;
  if (!NB_USER || !NB_PASSWORD) throw new NBError('Faltan NB_USER / NB_PASSWORD', 500);
  const res = await fetch(`${BASE()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: NB_USER, password: NB_PASSWORD, mode: 'api' }),
    cache: 'no-store',
  });
  const body = await parse(res);
  if (!res.ok) throw new NBError(`Login NB falló (${res.status})`, res.status, body);
  // La doc no describe la respuesta: aceptamos string o un campo habitual.
  const token = typeof body === 'string' ? body : body?.token ?? body?.access_token ?? body?.accessToken;
  if (!token) throw new NBError('Login NB: no se encontró el token en la respuesta', 502, body);
  return token;
}

async function getToken(force = false) {
  if (!force && cached.token && Date.now() < cached.expiresAt) return cached.token;
  if (!cached.pending) {
    cached.pending = login()
      .then((t) => { cached.token = t; cached.expiresAt = Date.now() + TOKEN_TTL_MS; return t; })
      .finally(() => { cached.pending = null; });
  }
  return cached.pending;
}

async function nb(path, { method = 'GET', body, query } = {}) {
  const url = new URL(`${BASE()}${path}`);
  if (query) Object.entries(query).forEach(([k, v]) => v != null && url.searchParams.set(k, String(v)));

  const call = async (token) =>
    fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    });

  let res = await call(await getToken());
  if (res.status === 401) res = await call(await getToken(true)); // token vencido
  const data = await parse(res);
  if (!res.ok) throw new NBError(`NB ${method} ${path} → ${res.status}`, res.status, data);
  return data;
}

// --- Catálogo: array de { id, sku, title, brand, category, mainImage, amountStock, price{finalPrice,...}, cotizacion, ... } ---
export const getCatalog = (query) => nb('/', { query });
export const getCurrencyQuote = () => nb('/currencyQuote'); // { currencyQuote: 1575 }

// --- Datos de cuenta / referencias ---
export const getShippingMethods = () => nb('/mediosEnvio'); // [{ id, nombre, tipo, descripcion }]
export const getPaymentMethods = () => nb('/carrito/mediosDePago'); // [{ payMethodId, description, interest }]
export const getShippingAddresses = () => nb('/miCuenta/shippingAddress'); // [{ idDirCli, direccion, codigoPostal, ... }]
export const getProvinces = () => nb('/provinces');
/** → { success, msg, addressId }. placeId obligatorio si no se informa provinceId (+ placeString). */
export const createShippingAddress = (addr) => nb('/miCuenta/shippingAddress', { method: 'POST', body: addr });
export const getOrderTracking = (branch, orderNumber) =>
  nb(`/miCuenta/ordenesDeCompra/${encodeURIComponent(branch)}/${encodeURIComponent(orderNumber)}/tracking`);

// --- Carrito / compra ---
export const emptyCart = () => nb('/carrito/empty', { method: 'PATCH' });
export const getCart = () => nb('/carrito');
export const createCart = () => nb('/carrito', { method: 'POST' }); // → id (integer)

/** items: [{ productId, amount, type }] — `type` no está documentado; 0 en el ejemplo oficial. */
export const addCartItems = (items) =>
  nb('/carrito/item', {
    method: 'POST',
    body: items.map((i) => ({ productId: Number(i.productId), amount: Number(i.amount), type: Number(i.type ?? 0) })),
  });

/**
 * Cotiza envío sin crear carrito. items: [{ itemId (=nbId), quantity }]
 * → { estimated, quotes:[{ carrierId, carrierName, total (ARS), deliveryDays, dropshippingEnabled }], package }
 * carrierId coincide con el id de /mediosEnvio y es el `mediodeEnvioId` de processCart.
 */
export const dropshippingQuote = (postalCode, items) =>
  nb('/dropshipping/shippingQuote', {
    method: 'POST',
    query: { postalCode },
    body: { items: items.map((i) => ({ itemId: Number(i.itemId), quantity: Number(i.quantity) })) },
  });

export const quoteShipping = (codigoPostal, direccionCompleta) =>
  nb(`/carrito/calcularEnvioPara/${encodeURIComponent(codigoPostal)}/${encodeURIComponent(direccionCompleta)}`);

/**
 * Procesa el carrito. Para dropshipping: dropShipping:true + mediodeEnvioId +
 * codigoPostalFavorito + idDirCli son obligatorios.
 * → { success, branch, orderId, status, status_detail_convert }
 */
export const processCart = ({ medioDePagoId, mediodeEnvioId, idDirCli, codigoPostalFavorito, note, dropShipping = true, ...rest }) =>
  nb('/carrito/process', {
    method: 'POST',
    body: { medioDePagoId, mediodeEnvioId, idDirCli, codigoPostalFavorito, note, dropShipping, ...rest },
  });
