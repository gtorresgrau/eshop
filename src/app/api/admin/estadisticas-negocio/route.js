import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import { guardAdmin } from '../../../../lib/sesion';

const DIAS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const METHOD_LABEL = {
  mercadopago:  'Mercado Pago',
  transferencia: 'Transferencia',
  efectivo:     'Efectivo',
};

export async function GET(request) {
  { const denied = await guardAdmin(); if (denied) return denied; }
  try {
    const { searchParams } = new URL(request.url);
    const dias = Math.min(365, Math.max(7, parseInt(searchParams.get('dias') || '30', 10)));

    await connectDB();

    const desde = new Date();
    desde.setDate(desde.getDate() - dias);
    desde.setHours(0, 0, 0, 0);

    const baseMatch = { createdAt: { $gte: desde } };
    // Pedidos que generaron ingreso real
    const paidMatch = { createdAt: { $gte: desde }, estado: { $in: ['pagado', 'enviado', 'entregado'] } };

    // ── 1. Totales generales ──────────────────────────────────────────────────
    const [totalesRes] = await Order.aggregate([
      { $match: paidMatch },
      {
        $group: {
          _id: null,
          ingresos:      { $sum: '$total' },
          pedidos:       { $sum: 1 },
          unidades:      { $sum: { $sum: '$items.cantidad' } },
        },
      },
    ]);

    const totalPedidosBase = await Order.countDocuments(baseMatch);
    const totalCancelados  = await Order.countDocuments({ ...baseMatch, estado: 'cancelado' });

    const ingresos  = totalesRes?.ingresos  ?? 0;
    const pedidos   = totalesRes?.pedidos   ?? 0;
    const unidades  = totalesRes?.unidades  ?? 0;
    const ticketProm = pedidos > 0 ? Math.round(ingresos / pedidos) : 0;

    // Tasa de conversión (pedidos cobrados / total sin cancelar)
    const noCancel = totalPedidosBase - totalCancelados;
    const tasaConversion = noCancel > 0 ? Math.round((pedidos / noCancel) * 100) : 0;

    // ── 2. Distribución de estados ────────────────────────────────────────────
    const estadosAgg = await Order.aggregate([
      { $match: baseMatch },
      { $group: { _id: '$estado', total: { $sum: 1 } } },
    ]);
    const distribucionEstados = estadosAgg.map(e => ({
      estado: e._id,
      total:  e.total,
    }));

    // ── 3. Métodos de pago ────────────────────────────────────────────────────
    const metodosAgg = await Order.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id:      '$paymentMethod',
          cantidad: { $sum: 1 },
          ingresos: { $sum: '$total' },
        },
      },
      { $sort: { cantidad: -1 } },
    ]);
    const metodosPago = metodosAgg.map(m => ({
      metodo:   METHOD_LABEL[m._id] ?? m._id,
      cantidad: m.cantidad,
      ingresos: m.ingresos,
    }));

    // ── 4. Productos más vendidos ─────────────────────────────────────────────
    const topProductosAgg = await Order.aggregate([
      { $match: paidMatch },
      { $unwind: '$items' },
      {
        $group: {
          _id:      '$items.nombreProducto',
          cantidad: { $sum: '$items.cantidad' },
          ingresos: { $sum: { $multiply: ['$items.cantidad', '$items.precioUnitario'] } },
        },
      },
      { $sort: { cantidad: -1 } },
      { $limit: 15 },
    ]);
    const topProductos = topProductosAgg.map(p => ({
      nombre:   p._id ?? '(sin nombre)',
      cantidad: p.cantidad,
      ingresos: p.ingresos,
    }));

    // ── 5. Ingresos / pedidos por día ─────────────────────────────────────────
    const porDiaAgg = await Order.aggregate([
      { $match: paidMatch },
      {
        $group: {
          _id: {
            y: { $year:  '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' },
          },
          pedidos:  { $sum: 1 },
          ingresos: { $sum: '$total' },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ]);
    const porDia = porDiaAgg.map(d => ({
      fecha:    `${String(d._id.d).padStart(2, '0')}/${MESES_ES[d._id.m - 1]}`,
      pedidos:  d.pedidos,
      ingresos: d.ingresos,
    }));

    // ── 6. Pedidos por día de la semana ───────────────────────────────────────
    const porDiaSemanaAgg = await Order.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id:     { $dayOfWeek: '$createdAt' }, // 1=Dom … 7=Sáb
          pedidos: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // Rellenar los 7 días aunque no haya datos
    const porDiaSemana = Array.from({ length: 7 }, (_, i) => {
      const found = porDiaSemanaAgg.find(x => x._id === i + 1);
      return { dia: DIAS_ES[i], pedidos: found?.pedidos ?? 0 };
    });

    // ── 7. Rangos de ticket ────────────────────────────────────────────────────
    const rangos = [
      { label: '< $5k',        min: 0,       max: 5000 },
      { label: '$5k - $15k',   min: 5000,    max: 15000 },
      { label: '$15k - $30k',  min: 15000,   max: 30000 },
      { label: '$30k - $60k',  min: 30000,   max: 60000 },
      { label: '$60k - $100k', min: 60000,   max: 100000 },
      { label: '> $100k',      min: 100000,  max: Infinity },
    ];
    const rangoTicketsAgg = await Promise.all(
      rangos.map(async r => ({
        label:    r.label,
        cantidad: await Order.countDocuments({
          ...baseMatch,
          total: { $gte: r.min, ...(r.max !== Infinity ? { $lt: r.max } : {}) },
        }),
      }))
    );

    // ── 8. Nuevos usuarios por semana (registro en Orders) ────────────────────
    //   Usamos fechaPedido vs usuarioUid para detectar primera compra por semana
    const primerasComprasAgg = await Order.aggregate([
      { $match: baseMatch },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id:        '$usuarioUid',
          primeraFecha: { $first: '$createdAt' },
        },
      },
      {
        $group: {
          _id: {
            y: { $isoWeekYear: '$primeraFecha' },
            w: { $isoWeek:     '$primeraFecha' },
          },
          nuevos: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.w': 1 } },
      { $limit: 20 },
    ]);
    const nuevosCompradores = primerasComprasAgg.map(x => ({
      semana:  `S${x._id.w}`,
      nuevos:  x.nuevos,
    }));

    return NextResponse.json({
      dias,
      totales: {
        ingresos,
        pedidos,
        unidades,
        ticketProm,
        tasaConversion,
        totalPedidos: totalPedidosBase,
        cancelados:   totalCancelados,
      },
      distribucionEstados,
      metodosPago,
      topProductos,
      porDia,
      porDiaSemana,
      rangoTickets: rangoTicketsAgg,
      nuevosCompradores,
    });
  } catch (error) {
    console.error('[api/admin/estadisticas-negocio]', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
