export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB } from '../../../../src/lib/mongodb';
import Producto from '../../../../src/models/product';
import { guardAdmin, getSesion } from '../../../lib/sesion';

// Datos internos que NO deben salir en la API pública (costo del proveedor, cotización, medidas de envío)
const INTERNOS_PUBLICOS = '-__v -costoUSD -nbCotizacion -pesoGr -altoCm -anchoCm -largoCm -nbSyncAt -nbSku -ocultoPorMigracion';

// GET /api/productos          → productos visibles (público, cacheable en el CDN)
// GET /api/productos?todos=1  → todos, incluidos los ocultos y los datos internos (solo admin)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const quiereTodos = searchParams.get('todos') === '1';

    if (quiereTodos) {
      const sesion = await getSesion();
      if (sesion?.rol !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: sesion ? 403 : 401 });
      }
    }

    await connectDB();
    const query = { ...(q ? { $text: { $search: q } } : {}), ...(quiereTodos ? {} : { hide: { $ne: true } }) };
    // Sin límite: la tienda filtra y pagina en el navegador (hoy son ~1.400 productos)
    const productos = await Producto.find(query, quiereTodos ? undefined : INTERNOS_PUBLICOS).lean();
    const res = NextResponse.json({ productos });
    res.headers.set(
      'Cache-Control',
      quiereTodos ? 'private, no-store' : 'public, s-maxage=60, stale-while-revalidate=300'
    );
    return res;
  } catch (error) {
    console.error('Error fetching productos:', error);
    return NextResponse.json({ error: 'Error fetching productos' }, { status: 500 });
  }
}

export async function POST(req) {
  { const denied = await guardAdmin(); if (denied) return denied; }
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
