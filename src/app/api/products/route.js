import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import Producto from '../../../models/product';

// Función para normalizar cadenas y eliminar acentos
function normalizeString(str) {
  return str
    ?.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Función para filtrar productos basado en múltiples valores
function filterByField(products, field, values) {
  if (!values.length) return products;
  const normalizedValues = values.map(normalizeString);
  return products.filter(product => 
    normalizedValues.includes(normalizeString(product[field]))
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
  const productsData = await Producto.find().lean();
  const { searchParams } = new URL(request.url);

  let filteredProducts = productsData;

  const search = normalizeString(searchParams.get('search') || '');
  const categories = searchParams.getAll('category');
  const brands = searchParams.getAll('brand');
  const vehiculos = searchParams.getAll('vehiculo');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '9');

  // Filtrar productos destacados
  const allproductosDestacados = productsData.filter(prod => prod.destacados === true);

  // Filtrar por búsqueda
  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      ['nombre', 'marca', 'vehiculo', 'cod_producto', 'categoria'].some(field =>
        normalizeString(product[field] || '').includes(search) // Evita errores con campos faltantes
      )
    );
  }

  // Aplicar filtros específicos
  filteredProducts = filterByField(filteredProducts, 'categoria', categories);
  filteredProducts = filterByField(filteredProducts, 'marca', brands);
  filteredProducts = filterByField(filteredProducts, 'vehiculo', vehiculos);

  // Calcular conteos de categorías, marcas y vehículos
  const totalCategories = Object.entries(countByField(productsData, 'categoria')).sort();
  const totalBrands = Object.entries(countByField(productsData, 'marca')).sort();
  const totalVehiculos = Object.entries(countByField(productsData, 'vehiculo')).sort();

  const filteredCategories = Object.entries(countByField(filteredProducts, 'categoria')).sort();
  const filteredBrands = Object.entries(countByField(filteredProducts, 'marca')).sort();
  const filteredVehiculos = Object.entries(countByField(filteredProducts, 'vehiculo')).sort();

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
    totalVehiculos: totalVehiculos.map(([vehiculo, count]) => ({ vehiculo, count })),
    filteredBrands: filteredBrands.map(([brand, count]) => ({ brand, count })),
    filteredCategories: filteredCategories.map(([category, count]) => ({ category, count })),
    filteredVehiculos: filteredVehiculos.map(([vehiculo, count]) => ({ vehiculo, count })),
  });
}
