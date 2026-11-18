export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/product';

const TZ = 'America/Argentina/Buenos_Aires';
const ESTADOS_COBRADOS = ['pagado', 'enviado', 'entregado'];
const COLORES = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#6366f1'];
const MAX_CATEGORIAS = 8;

const claveDia = (fecha) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);

const etiquetaDia = (clave) => `${clave.slice(8, 10)}/${clave.slice(5, 7)}`;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const diasAtras = Math.min(365, Math.max(1, parseInt(searchParams.get('periodo') || '30', 10) || 30));

    await connectDB();

    const desde = new Date();
    desde.setDate(desde.getDate() - diasAtras);
    desde.setHours(0, 0, 0, 0);

    // Solo pedidos que generaron ingreso real
    const match = { createdAt: { $gte: desde }, estado: { $in: ESTADOS_COBRADOS } };

    const [totalesRes, porDiaAgg, topAgg, categoriaAgg] = await Promise.all([
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            ventas: { $sum: 1 },
            ingresos: { $sum: '$total' },
            unidades: { $sum: { $sum: '$items.cantidad' } },
          },
        },
      ]),
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: TZ } },
            ventas: { $sum: 1 },
            ingresos: { $sum: '$total' },
          },
        },
      ]),
      Order.aggregate([
        { $match: match },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.nombreProducto',
            cantidad: { $sum: '$items.cantidad' },
            ingresos: { $sum: { $multiply: ['$items.cantidad', '$items.precioUnitario'] } },
          },
        },
        { $sort: { cantidad: -1, ingresos: -1 } },
        { $limit: 8 },
      ]),
      Order.aggregate([
        { $match: match },
        { $unwind: '$items' },
        {
          $lookup: {
            from: Product.collection.name,
            localField: 'items.producto',
            foreignField: '_id',
            as: 'prod',
          },
        },
        {
          $group: {
            _id: { $ifNull: [{ $arrayElemAt: ['$prod.categoria', 0] }, 'Sin categoría'] },
            value: { $sum: '$items.cantidad' },
          },
        },
        { $sort: { value: -1 } },
        { $limit: MAX_CATEGORIAS },
      ]),
    ]);

    const ventas = totalesRes[0]?.ventas ?? 0;
    const ingresos = totalesRes[0]?.ingresos ?? 0;
    const productosVendidos = totalesRes[0]?.unidades ?? 0;

    // Incluir los días sin ventas para que el gráfico sea continuo
    const porDiaMap = new Map(porDiaAgg.map((d) => [d._id, d]));
    const porDia = [];
    for (let i = diasAtras; i >= 0; i--) {
      const dia = new Date();
      dia.setDate(dia.getDate() - i);
      const clave = claveDia(dia);
      const d = porDiaMap.get(clave);
      porDia.push({ fecha: etiquetaDia(clave), ventas: d?.ventas ?? 0, ingresos: d?.ingresos ?? 0 });
    }

    return NextResponse.json({
      totales: {
        ventas,
        ingresos,
        productosVendidos,
        promedioVenta: ventas > 0 ? Math.round(ingresos / ventas) : 0,
      },
      porDia,
      topProductos: topAgg.map((p) => ({
        nombre: p._id ?? '(sin nombre)',
        cantidad: p.cantidad,
        ingresos: p.ingresos,
      })),
      porCategoria: categoriaAgg.map((c, i) => ({
        name: c._id,
        value: c.value,
        color: COLORES[i % COLORES.length],
      })),
    });
  } catch (error) {
    console.error('[Estadísticas Ventas] Error:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de ventas', message: error.message },
      { status: 500 }
    );
  }
}
