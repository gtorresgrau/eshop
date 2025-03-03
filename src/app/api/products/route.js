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

  // Usamos aggregate() para paginar y contar en una sola consulta
  const [result] = await Producto.aggregate([
    { $match: query }, // Filtramos los documentos que coinciden con la búsqueda
    {
      $facet: {
        products: [
          { $skip: skip },
          { $limit: pageSize },
          {
            $project: {
              cod_producto: 1,
              nombre: 1,
              marca: 1,
              categoria: 1,
              modelo: 1,
              titulo_de_producto: 1,
              descripcion: 1,
              precio: 1,
              destacados: 1,
              usd: 1,
              usado: 1,
              vendido: 1,
              medidas: 1,
              foto_1_1: 1,
              foto_1_2: 1,
              foto_1_3: 1,
              foto_1_4: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }], // Contamos el total de documentos
      },
    },
  ]);

  const products = result.products || [];
  const totalProducts = result.totalCount.length > 0 ? result.totalCount[0].count : 0;

  // Filtramos los productos destacados ya obtenidos
  const allproductosDestacados = products.filter((prod) => prod.destacados);

  return NextResponse.json({
    products,
    totalPage: Math.ceil(totalProducts / pageSize),
    allproductosDestacados,
  });
}
