import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Producto from '../../../models/product';

// Función para normalizar cadenas (sin cambios)
function normalizeString(str) {
  return str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Función para filtrar productos (sin cambios)
function filterByField(products, field, values) {
  if (!values.length) return products;
  const normalizedValues = values.map(normalizeString);
  return products.filter(product =>
    normalizedValues.includes(normalizeString(product[field] || ''))
  );
}


export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const product = await Producto.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '9');
  const search = normalizeString(searchParams.get('search') || '');
  const categories = searchParams.getAll('category');
  const brands = searchParams.getAll('brand');

  // Consulta a la base de datos con filtros (Optimización principal)
  let query = {};

  if (search) {
    query.$or = [
      { nombre: { $regex: search, $options: 'i' } }, // 'i' para insensibilidad a mayúsculas
      { marca: { $regex: search, $options: 'i' } },
      { cod_producto: { $regex: search, $options: 'i' } },
      { categoria: { $regex: search, $options: 'i' } },
    ];
  }

  if (categories.length) {
    query.categoria = { $in: categories };
  }

  if (brands.length) {
    query.marca = { $in: brands };
  }

  const productsData = await Producto.find(query).lean(); // Consulta con filtros aplicados

  const totalProducts = productsData.length; // Obtener el total de productos *después* de aplicar los filtros

  const allproductosDestacados = productsData.filter(prod => prod.destacados === true);

  // Paginación (después de la consulta y los filtros)
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = productsData.slice(startIndex, startIndex + pageSize);
  const totalPage = Math.ceil(totalProducts / pageSize); // Usar totalProducts


  // Conteo de categorías y marcas (Optimizado)
  const totalCategories = Array.from(new Set(productsData.map(p => p.categoria))).sort().map(cat => ({ category: cat, count: productsData.filter(p => p.categoria === cat).length }));
  const totalBrands = Array.from(new Set(productsData.map(p => p.marca))).sort().map(brand => ({ brand: brand, count: productsData.filter(p => p.marca === brand).length }));

  // Conteo de categorias y marcas filtradas
  const filteredCategories = Array.from(new Set(paginatedProducts.map(p => p.categoria))).sort().map(cat => ({ category: cat, count: paginatedProducts.filter(p => p.categoria === cat).length }));
  const filteredBrands = Array.from(new Set(paginatedProducts.map(p => p.marca))).sort().map(brand => ({ brand: brand, count: paginatedProducts.filter(p => p.marca === brand).length }));


  return NextResponse.json({
    products: paginatedProducts,
    totalPage,
    allproductosDestacados,
    totalBrands,
    totalCategories,
    filteredBrands,
    filteredCategories,
  });
}