import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Producto from '@/models/product';

export async function GET(_, { params }) {
  await connectDB();
  const { slug } = params;

  const product = await Producto.findOne({ slug }).lean();
  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }
  
  return NextResponse.json(product);
}
