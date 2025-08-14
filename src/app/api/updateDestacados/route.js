export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/mongodb';
import Producto from '../../../../src/models/product';

export async function POST(req) {
  try {
    await connectDB();
    const { productoId, destacados } = await req.json();
    const producto = await Producto.findById(productoId);
    if (!producto) return NextResponse.json({ error: 'Producto not found' }, { status: 404 });
    producto.destacados = destacados;
    await producto.save();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error updating destacados:', error);
    return NextResponse.json({ error: 'Error updating destacados' }, { status: 500 });
  }
}
