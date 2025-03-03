import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Producto from '@/models/product';

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug es requerido' }, { status: 400 });
    }

    const formattedSlug = slug.replace(/_/g, ' ');

    const product = await Producto.findOne({ 
      nombre: { $regex: new RegExp(`^${formattedSlug}$`, 'i') } 
    }).lean();

    if (!product) {
      return NextResponse.json({ success: false, error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });

  } catch (error) {
    console.error('Error en la API:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
}
