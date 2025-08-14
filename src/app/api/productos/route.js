export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/mongodb';
import Producto from '../../../../src/models/product';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const query = q ? { $text: { $search: q } } : {};
    const productos = await Producto.find(query).limit(50).lean();
    return NextResponse.json({ productos });
  } catch (error) {
    console.error('Error fetching productos:', error);
    return NextResponse.json({ error: 'Error fetching productos' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const nuevo = new Producto(data);
    const saved = await nuevo.save();
    return NextResponse.json({ producto: saved }, { status: 201 });
  } catch (error) {
    console.error('Error creating producto:', error);
    return NextResponse.json({ error: 'Error creating producto' }, { status: 500 });
  }
}
