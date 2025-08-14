export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/mongodb';
import Producto from '../../../../src/models/product';

export async function GET() {
  await connectDB();
  try {
    const marcas = await Producto.distinct('marca');
    const categorias = await Producto.distinct('categoria');
    return NextResponse.json({ marcas, categorias });
  } catch (error) {
    console.error('Error en brandsCategories GET:', error);
    return NextResponse.json({ error: 'Error al obtener filtros' }, { status: 500 });
  }
}
