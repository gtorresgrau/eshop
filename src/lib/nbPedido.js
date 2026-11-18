import { connectDB } from './mongodb';
import Order from '../models/Order';
import Producto from '../models/product';
import {
  emptyCart, createCart, addCartItems, getShippingAddresses, createShippingAddress, processCart, NBError,
} from './newbytes';

const MEDIO_PAGO_ID = () => Number(process.env.NB_MEDIO_PAGO_ID) || 3; // 3 = Depósito en Banco

const dirTexto = (d) =>
  [`${d.calle} ${d.numero}`.trim(), d.piso && `piso ${d.piso}`, d.depto && `depto ${d.depto}`].filter(Boolean).join(', ');

/**
 * Carga en New Bytes el pedido (dropshipping). SOLO se llama desde el Admin, con aprobación manual.
 * - Idempotente: reserva el pedido de forma atómica (pendiente_aprobacion|error → procesando).
 * - Solo pedidos pagados.
 * Crea una compra REAL en NB que se les paga por transferencia.
 */
export async function aprobarPedidoNB(orderId) {
  await connectDB();

  const order = await Order.findOneAndUpdate(
    { _id: orderId, estado: 'pagado', 'nb.estado': { $in: ['pendiente_aprobacion', 'error'] } },
    { $set: { 'nb.estado': 'procesando', 'nb.error': '' } },
    { new: true }
  );
  if (!order) {
    const o = await Order.findById(orderId).lean();
    if (!o) return { ok: false, status: 404, error: 'Pedido no encontrado' };
    if (o.nb?.estado === 'enviado') return { ok: false, status: 409, error: `Ya fue enviado a NB (pedido ${o.nb.orderId})` };
    if (o.nb?.estado === 'procesando') return { ok: false, status: 409, error: 'Se está procesando en este momento' };
    if (o.estado !== 'pagado') return { ok: false, status: 409, error: 'El pedido todavía no figura como pagado' };
    return { ok: false, status: 409, error: 'Este pedido no tiene productos de New Bytes pendientes' };
  }

  const fallar = async (msg, status = 502) => {
    await Order.updateOne({ _id: order._id }, { $set: { 'nb.estado': 'error', 'nb.error': String(msg).slice(0, 500) } });
    return { ok: false, status, error: msg };
  };

  try {
    // 1) Ítems de NB del pedido
    const ids = order.items.map((i) => i.producto);
    const prods = await Producto.find({ _id: { $in: ids }, origen: 'nb' }).lean();
    const nbItems = [];
    for (const it of order.items) {
      const p = prods.find((x) => String(x._id) === String(it.producto));
      if (p?.nbId) nbItems.push({ productId: p.nbId, amount: it.cantidad, type: 0 });
    }
    if (nbItems.length === 0) return await fallar('El pedido no tiene productos de New Bytes', 409);

    const d = order.direccionEnvio || {};
    const carrierId = order.envio?.carrierId;
    const cp = String(order.envio?.codigoPostal || d.codigoPostal || '');
    if (!carrierId || !cp || !d.calle || !d.numero || !d.ciudad || !d.provinciaId) {
      return await fallar('Faltan datos de envío (dirección, provincia, código postal o transportista)', 409);
    }

    // 2) Carrito de NB limpio con solo los ítems de este pedido
    try { await emptyCart(); } catch { /* si no había carrito, se crea abajo */ }
    try {
      await addCartItems(nbItems);
    } catch (e) {
      if (!(e instanceof NBError) || e.status !== 400) throw e;
      await createCart();
      await addCartItems(nbItems);
    }

    // 3) Dirección en NB (se reutiliza si ya existe una igual)
    const direccion = dirTexto(d);
    const existentes = await getShippingAddresses().catch(() => []);
    let idDirCli = (Array.isArray(existentes) ? existentes : []).find(
      (a) => String(a.codigoPostal) === cp && String(a.direccion).trim().toLowerCase() === direccion.toLowerCase()
    )?.idDirCli;
    if (!idDirCli) {
      const r = await createShippingAddress({
        direccion,
        telefono: String(d.telefono || order.usuarioInfo?.telefono || '').replace(/\D/g, '') || '0000000000',
        codigoPostal: cp,
        provinceId: Number(d.provinciaId),
        placeString: d.ciudad,
      });
      if (r?.success !== 'ok' || !r?.addressId) return await fallar(`NB rechazó la dirección: ${r?.msg || 'sin detalle'}`);
      idDirCli = r.addressId;
    }

    // 4) Procesar compra: ACÁ se genera el pedido real en NB
    let r;
    try {
      r = await processCart({
        medioDePagoId: MEDIO_PAGO_ID(),
        mediodeEnvioId: Number(carrierId),
        idDirCli: Number(idDirCli),
        codigoPostalFavorito: cp,
        note: `Pedido web ${order._id}`,
        dropShipping: true,
      });
    } catch (e) {
      const detalle = typeof e.body === 'string' ? e.body : JSON.stringify(e.body ?? e.message);
      // Si fue un error de red/timeout el resultado es incierto: hay que revisar NB antes de reintentar.
      const incierto = !(e instanceof NBError);
      return await fallar(`${incierto ? 'RESULTADO INCIERTO, verificá en Mi cuenta de NB antes de reintentar. ' : ''}${detalle}`);
    }

    if (r?.success !== 'ok') return await fallar(`NB no confirmó la compra: ${JSON.stringify(r).slice(0, 300)}`);

    await Order.updateOne(
      { _id: order._id },
      {
        $set: {
          'nb.estado': 'enviado',
          'nb.orderId': String(r.orderId),
          'nb.branch': String(r.branch),
          'nb.status': String(r.status),
          'nb.statusDetail': String(r.status_detail_convert ?? ''),
          'nb.error': '',
          'nb.enviadoAt': new Date(),
        },
      }
    );
    return { ok: true, orderId: r.orderId, branch: r.branch, status: r.status, detalle: r.status_detail_convert };
  } catch (e) {
    return await fallar(e instanceof NBError ? `${e.message}: ${JSON.stringify(e.body).slice(0, 300)}` : `Resultado incierto, verificá en NB antes de reintentar. ${e.message}`);
  }
}
