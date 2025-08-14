export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Producto from '../../../../models/product';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || '';
    const formattedSlug = slug.replace(/_/g, ' ');
    const product = await Producto.findOne({ nombre: { $regex: new RegExp(`^${formattedSlug}$`, 'i') } }).lean();
    if (!product || Object.keys(product).length === 0) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching producto by slug:', error);
    return NextResponse.json({ error: 'Error fetching producto' }, { status: 500 });
  }
}
