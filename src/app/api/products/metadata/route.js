import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Producto from '@/models/product';

export async function GET() {
  await connectDB();

  // Obtener categorías y marcas únicas con count en una sola consulta
  const [categories, brands] = await Promise.all([
    Producto.aggregate([
      { $group: { _id: '$categoria', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { category: 1 } }
    ]),
    Producto.aggregate([
      { $group: { _id: '$marca', count: { $sum: 1 } } },
      { $project: { brand: '$_id', count: 1, _id: 0 } },
      { $sort: { brand: 1 } }
    ])
  ]);

  return NextResponse.json({ totalCategories: categories, totalBrands: brands });
}
