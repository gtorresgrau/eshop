export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/mongodb';
import Producto from '../../../../src/models/product';

export async function GET() {
  await connectDB();
  try {
    // Solo de productos visibles: los ocultos no deben aparecer como filtros vacíos
    const visibles = { hide: { $ne: true } };
    const marcas = await Producto.distinct('marca', visibles);
    const categorias = await Producto.distinct('categoria', visibles);
    return NextResponse.json({ marcas, categorias });
  } catch (error) {
    console.error('Error en brandsCategories GET:', error);
    return NextResponse.json({ error: 'Error al obtener filtros' }, { status: 500 });
  }
}
