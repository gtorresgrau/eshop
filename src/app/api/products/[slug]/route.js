import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Producto from '@/models/product';

export async function GET(req, { params }) {
    await connectDB();    
    const { slug } = params;
    const formattedSlug = slug.replace(/_/g, ' ');
    const product = await Producto.findOne({ 
    nombre: { $regex: new RegExp(`^${formattedSlug}$`, 'i') }}).lean();
  
    if (!product || Object.keys(product).length === 0) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
      } 
      
    return NextResponse.json(product);
  }
