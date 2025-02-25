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

  // Si se envía un pageSize, lo usamos, de lo contrario, lo determinamos según el User-Agent
  const pageSizeParam = searchParams.get('pageSize');
  let pageSize;
  if (pageSizeParam) {
    pageSize = parseInt(pageSizeParam);
  } else {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /Mobi|Android|iPhone/i.test(userAgent);
    pageSize = isMobile ? 8 : 9;
  }

  const page = parseInt(searchParams.get('page') || '1');
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

  const productsData = await Producto.find(query).lean();
  const totalProducts = productsData.length;
  const allproductosDestacados = productsData.filter(prod => prod.destacados === true);

  // Aplicar paginación
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = productsData.slice(startIndex, startIndex + pageSize);
  const totalPage = Math.ceil(totalProducts / pageSize);
  
  // Conteo de categorías y marcas (Optimizado)
  const totalCategories = Array.from(new Set(productsData.map(p => p.categoria))).sort().map(cat => ({
    category: cat,
    count: productsData.filter(p => p.categoria === cat).length,
  }));
  const totalBrands = Array.from(new Set(productsData.map(p => p.marca))).sort().map(brand => ({
    brand: brand,
    count: productsData.filter(p => p.marca === brand).length,
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


// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import Producto from '@/models/product';

// // Normaliza cadenas eliminando tildes y convirtiéndolas a minúsculas
// const normalizeString = (str) => str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// export async function GET(request) {
//   await connectDB();
//   const { searchParams } = new URL(request.url);

//   const pageSize = parseInt(searchParams.get('pageSize')) || 9;
//   const page = parseInt(searchParams.get('page') || '1');
//   const search = normalizeString(searchParams.get('search') || '');
//   const categories = searchParams.getAll('category');
//   const brands = searchParams.getAll('brand');

//   let query = {};
//   if (search) {
//     query.$or = [
//       { nombre: { $regex: search, $options: 'i' } },
//       { marca: { $regex: search, $options: 'i' } },
//       { cod_producto: { $regex: search, $options: 'i' } },
//       { categoria: { $regex: search, $options: 'i' } },
//     ];
//   }
//   if (categories.length) query.categoria = { $in: categories };
//   if (brands.length) query.marca = { $in: brands };

//   const totalProducts = await Producto.countDocuments(query);
//   const products = await Producto.find(query)
//     .skip((page - 1) * pageSize)
//     .limit(pageSize)
//     .lean();

//   return NextResponse.json({
//     products,
//     totalPage: Math.ceil(totalProducts / pageSize),
//   });
// }
