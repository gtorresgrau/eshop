export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/mongodb';
import Producto from '../../../../src/models/product';

export async function GET() {
  try {
    await connectDB();
    const productos = await Producto.find({ destacados: true }).lean();
    return NextResponse.json({ productos });
  } catch (error) {
    console.error('Error fetching destacados:', error);
    return NextResponse.json({ error: 'Error fetching destacados' }, { status: 500 });
  }
}
