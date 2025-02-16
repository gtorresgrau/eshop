import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Producto from '../../../models/product';

// Función para normalizar cadenas y eliminar acentos
function normalizeString(str) {
  return str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Función para filtrar productos basado en múltiples valores
function filterByField(products, field, values) {
  if (!values.length) return products;
  const normalizedValues = values.map(normalizeString);
  return products.filter(product => 
    normalizedValues.includes(normalizeString(product[field] || ''))
  );
}

// Función para contar ocurrencias por campo
function countByField(products, field) {
  return products.reduce((counts, product) => {
    const value = product[field];
    if (value) {
      counts[value] = (counts[value] || 0) + 1;
    }
    return counts;
  }, {});
}

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    // Si hay un slug, buscar un solo producto
    const product = await Producto.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }
    return NextResponse.json(product);
  }

  // Obtener todos los productos
  const productsData = await Producto.find().lean();
  let filteredProducts = productsData;

  // Filtros y paginación
  const search = normalizeString(searchParams.get('search') || '');
  const categories = searchParams.getAll('category');
  const brands = searchParams.getAll('brand');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '9');

  // Filtrar productos destacados
  const allproductosDestacados = productsData.filter(prod => prod.destacados === true);

  // Filtrar por búsqueda
  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      ['nombre', 'marca', 'cod_producto', 'categoria'].some(field =>
        normalizeString(product[field] || '').includes(search)
      )
    );
  }

  // Aplicar filtros específicos
  filteredProducts = filterByField(filteredProducts, 'categoria', categories);
  filteredProducts = filterByField(filteredProducts, 'marca', brands);

  // Conteo de categorías y marcas
  const totalCategories = Object.entries(countByField(productsData, 'categoria')).sort();
  const totalBrands = Object.entries(countByField(productsData, 'marca')).sort();
  const filteredCategories = Object.entries(countByField(filteredProducts, 'categoria')).sort();
  const filteredBrands = Object.entries(countByField(filteredProducts, 'marca')).sort();

  // Paginar resultados
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  const totalPage = Math.ceil(filteredProducts.length / pageSize);

  return NextResponse.json({
    products: paginatedProducts,
    totalPage,
    allproductosDestacados,
    totalBrands: totalBrands.map(([brand, count]) => ({ brand, count })),
    totalCategories: totalCategories.map(([category, count]) => ({ category, count })),
    filteredBrands: filteredBrands.map(([brand, count]) => ({ brand, count })),
    filteredCategories: filteredCategories.map(([category, count]) => ({ category, count })),
  });
}
