import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Producto from '@/models/product';

export async function GET() {
  await connectDB();
  const products = await Producto.find().select('categoria marca').lean();

  const totalCategories = Array.from(new Set(products.map(p => p.categoria)))
    .sort()
    .map(cat => ({
      category: cat,
      count: products.filter(p => p.categoria === cat).length,
    }));

  const totalBrands = Array.from(new Set(products.map(p => p.marca)))
    .sort()
    .map(brand => ({
      brand,
      count: products.filter(p => p.marca === brand).length,
    }));

  // Conteo de categorías y marcas filtradas
  const filteredCategories = Array.from(new Set(paginatedProducts.map(p => p.categoria))).sort().map(cat => ({
    category: cat,
    count: paginatedProducts.filter(p => p.categoria === cat).length,
  }));
  const filteredBrands = Array.from(new Set(paginatedProducts.map(p => p.marca))).sort().map(brand => ({
    brand: brand,
    count: paginatedProducts.filter(p => p.marca === brand).length,
  }));

  return NextResponse.json({ totalCategories, totalBrands, filteredCategories, filteredBrands });
}
