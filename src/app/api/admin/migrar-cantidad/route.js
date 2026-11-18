import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Producto from '../../../../models/product';
import { guardAdmin } from '../../../../lib/sesion';

export async function POST() {
  { const denied = await guardAdmin(); if (denied) return denied; }
  await connectDB();

  const vendidos = await Producto.updateMany(
    { vendido: true, cantidad: { $exists: false } },
    { $set: { cantidad: 0 } }
  );

  const resto = await Producto.updateMany(
    { cantidad: { $exists: false } },
    { $set: { cantidad: 1 } }
  );

  return NextResponse.json({
    ok: true,
    vendidos: vendidos.modifiedCount,
    actualizados: resto.modifiedCount,
  });
}
