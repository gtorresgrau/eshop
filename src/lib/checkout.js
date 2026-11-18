import { connectDB } from './mongodb';
import Producto from '../models/product';
import { parsePrecio } from '../Utils/parsePrecio';
import { cotizarEnvioCarrito } from './nbEnvio';

/**
 * Fuente de verdad del checkout. Recalcula TODO desde la base (precios, descuento, envío):
 * lo que mande el navegador solo sirve para saber qué producto y cuántas unidades.
 *
 * @param {{ cart: {cod_producto: string, quantity: number}[],
 *           metodo: 'mercadopago'|'transferencia',
 *           envio?: { carrierId: number, codigoPostal: string } | null,
 *           tipoEntrega?: 'retiro'|'envio' }} p
 */
export async function calcularCheckout({ cart, metodo, envio, tipoEntrega = 'envio' }) {
  if (!Array.isArray(cart) || cart.length === 0) return { error: 'El carrito está vacío', status: 400 };

  const qtyPorCod = new Map();
  for (const it of cart) {
    const q = Math.floor(Number(it?.quantity));
    if (!it?.cod_producto || !(q > 0) || q > 100) return { error: 'El carrito contiene ítems inválidos', status: 400 };
    const k = String(it.cod_producto);
    qtyPorCod.set(k, (qtyPorCod.get(k) || 0) + q);
  }

  await connectDB();
  const docs = await Producto.find({ cod_producto: { $in: [...qtyPorCod.keys()] } }).lean();
  if (docs.length !== qtyPorCod.size) return { error: 'Hay productos que ya no existen', status: 409 };

  const hayNB = docs.some((d) => d.origen === 'nb');
  for (const d of docs) {
    if (d.hide) return { error: `"${d.nombre}" ya no está disponible`, status: 409 };
    if (d.origen === 'nb' && d.cantidad < qtyPorCod.get(d.cod_producto)) {
      return { error: `Sin stock suficiente de "${d.nombre}"`, status: 409 };
    }
  }

  // Mismo criterio que el carrito actual: el descuento por transferencia es el del primer ítem.
  const primero = docs.find((d) => d.cod_producto === String(cart[0].cod_producto));
  const descuentoPct = metodo === 'transferencia' ? Math.min(Math.max(Number(primero?.descuento) || 0, 0), 50) : 0;

  const items = docs.map((d) => {
    const base = parsePrecio(d.precio);
    return {
      doc: d,
      cod_producto: d.cod_producto,
      nombre: d.nombre,
      titulo_de_producto: d.titulo_de_producto || '',
      foto: d.foto_1_1 || '',
      quantity: qtyPorCod.get(d.cod_producto),
      precioBase: base,
      precioUnitario: base * (1 - descuentoPct / 100),
    };
  });
  if (items.some((i) => !(i.precioBase > 0))) return { error: 'Hay productos sin precio publicado', status: 409 };

  const subtotal = items.reduce((a, i) => a + i.precioUnitario * i.quantity, 0);

  // --- Envío ---
  let envioCalc = null;
  if (hayNB) {
    if (tipoEntrega === 'retiro') return { error: 'Los productos de New Bytes se entregan solo por envío', status: 400 };
    if (!envio?.carrierId || !envio?.codigoPostal) return { error: 'Elegí un envío para continuar', status: 400 };
    const cot = await cotizarEnvioCarrito({
      items: [...qtyPorCod].map(([cod_producto, quantity]) => ({ cod_producto, quantity })),
      codigoPostal: envio.codigoPostal,
    });
    if (cot.error) return { error: cot.error, status: cot.status || 502 };
    const op = cot.opciones?.find((o) => o.carrierId === Number(envio.carrierId));
    if (!op) return { error: 'El envío elegido ya no está disponible, volvé a cotizar', status: 409 };
    envioCalc = {
      carrierId: op.carrierId,
      nombre: op.nombre,
      dias: op.dias,
      codigoPostal: String(envio.codigoPostal),
      costoCliente: op.costoCliente,
      costoNB: op.costoNB,
      gratis: op.costoCliente === 0,
    };
  }

  return {
    items,
    hayNB,
    descuentoPct,
    subtotal,
    envio: envioCalc,
    total: subtotal + (envioCalc?.costoCliente || 0),
  };
}
