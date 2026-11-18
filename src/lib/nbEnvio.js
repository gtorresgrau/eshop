import { connectDB } from './mongodb';
import Producto from '../models/product';
import { parsePrecio } from '../Utils/parsePrecio';
import { dropshippingQuote } from './newbytes';

// Envío gratis cuando el subtotal del carrito es MAYOR a este monto (ARS).
export const ENVIO_GRATIS_DESDE = Number(process.env.NB_ENVIO_GRATIS_DESDE) || 100000;

/** Regla de cobro al cliente. NB nos cobra igual: el envío gratis lo absorbe el margen. */
export function costoEnvioCliente(subtotal, costoNB) {
  if (subtotal > ENVIO_GRATIS_DESDE) return 0;
  return Math.ceil(Number(costoNB) || 0);
}

/**
 * Cotiza el envío de un carrito. Los precios y el stock salen de la base, NUNCA del cliente.
 * @param {{ items: {cod_producto: string, quantity: number}[], codigoPostal: string }} p
 * @returns {Promise<
 *   | { requiereEnvioNB: false, subtotal: number }
 *   | { requiereEnvioNB: true, subtotal: number, envioGratis: boolean, opciones: object[] }
 *   | { error: string, status: number, detalle?: any }>}
 */
export async function cotizarEnvioCarrito({ items, codigoPostal }) {
  const cp = String(codigoPostal ?? '').trim();
  if (!/^\d{4}$/.test(cp)) return { error: 'Código postal inválido (4 dígitos).', status: 400 };
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return { error: 'Carrito inválido.', status: 400 };
  }

  const qtyPorCod = new Map();
  for (const it of items) {
    const q = Math.floor(Number(it?.quantity));
    if (!it?.cod_producto || !(q > 0) || q > 100) return { error: 'Ítem inválido.', status: 400 };
    qtyPorCod.set(String(it.cod_producto), (qtyPorCod.get(String(it.cod_producto)) || 0) + q);
  }

  await connectDB();
  const docs = await Producto.find({ cod_producto: { $in: [...qtyPorCod.keys()] }, hide: { $ne: true } }).lean();
  if (docs.length !== qtyPorCod.size) return { error: 'Hay productos que ya no están disponibles.', status: 409 };

  let subtotal = 0;
  const nbItems = [];
  for (const d of docs) {
    const qty = qtyPorCod.get(d.cod_producto);
    if (d.origen === 'nb' && (typeof d.cantidad !== 'number' || d.cantidad < qty)) {
      return { error: `Sin stock suficiente de "${d.nombre}".`, status: 409 };
    }
    subtotal += parsePrecio(d.precio) * qty;
    if (d.origen === 'nb' && d.nbId) nbItems.push({ itemId: d.nbId, quantity: qty });
  }

  if (nbItems.length === 0) return { requiereEnvioNB: false, subtotal };

  let cot;
  try {
    cot = await dropshippingQuote(cp, nbItems);
  } catch (e) {
    return { error: 'No pudimos cotizar el envío para ese código postal.', status: 502, detalle: e.body ?? e.message };
  }

  const opciones = (cot?.quotes ?? [])
    .filter((q) => q.dropshippingEnabled && Number(q.total) > 0)
    .map((q) => ({
      carrierId: q.carrierId,
      nombre: q.carrierName,
      dias: q.deliveryDays,
      estimado: q.deliveryEstimate,
      costoNB: Number(q.total),
      costoCliente: costoEnvioCliente(subtotal, q.total),
    }))
    .sort((a, b) => a.costoCliente - b.costoCliente || a.costoNB - b.costoNB);

  if (opciones.length === 0) return { error: 'No hay envíos disponibles para ese código postal.', status: 422 };
  return { requiereEnvioNB: true, subtotal, envioGratis: subtotal > ENVIO_GRATIS_DESDE, opciones };
}
