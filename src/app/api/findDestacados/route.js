import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Producto from '@/models/product';

export async function GET() {
  await connectDB();
  const destacados = await Producto.find({ destacados: true }).lean();
  return NextResponse.json(destacados);
}
