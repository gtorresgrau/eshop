import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Producto from '@/models/product';

// Función para normalizar cadenas
const normalizeString = (str) => str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  // Paginación
  const pageSize = parseInt(searchParams.get('pageSize')) || 9;
  const page = parseInt(searchParams.get('page')) || 1;
  const skip = (page - 1) * pageSize;

  // Filtros
  const search = normalizeString(searchParams.get('search') || '');
  const categories = searchParams.getAll('category');
  const brands = searchParams.getAll('brand');

  let query = {};
  if (search) {
    query.$or = [
      { nombre: { $regex: search, $options: 'i' } },
      { marca: { $regex: search, $options: 'i' } },
      { cod_producto: { $regex: search, $options: 'i' } },
      { categoria: { $regex: search, $options: 'i' } },
    ];
  }
  if (categories.length) query.categoria = { $in: categories };
  if (brands.length) query.marca = { $in: brands };

  // Obtener productos paginados y total de productos
  const [products, totalProducts] = await Promise.all([
    Producto.find(query).select('nombre marca categoria destacados').skip(skip).limit(pageSize).lean(),
    Producto.countDocuments(query)
  ]);

  // Productos destacados
  const allproductosDestacados = await Producto.find({ destacados: true }).select('nombre marca categoria').lean();

  return NextResponse.json({
    products,
    totalPage: Math.ceil(totalProducts / pageSize),
    allproductosDestacados,
  });
}
