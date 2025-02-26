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

  // Obtener productos paginados y contar documentos en una sola consulta agregada
  const [products, totalProducts] = await Promise.all([
    Producto.find(query)
      .select('cod_producto nombre marca categoria modelo titulo_de_producto descripcion precio destacados usd usado vendido medidas foto_1_1 foto_1_2 foto_1_3 foto_1_4')
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Producto.countDocuments(query)
  ]);

  // Filtrar productos destacados desde los productos ya obtenidos
  const allproductosDestacados = products.filter((prod) => prod.destacados);

  return NextResponse.json({
    products,
    totalPage: Math.ceil(totalProducts / pageSize),
    allproductosDestacados,
  });
}
