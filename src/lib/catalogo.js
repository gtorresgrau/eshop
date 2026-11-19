import { cache } from 'react';
import { connectDB } from './mongodb';
import Producto from '../models/product';

export { estaAgotado } from '../Utils/estadoProducto';

const CAMPOS = {
  cod_producto: 1, nombre: 1, titulo_de_producto: 1, marca: 1, categoria: 1,
  precio: 1, usd: 1, foto_1_1: 1, vendido: 1, stock: 1, cantidad: 1,
};

export const POR_PAGINA = 24;

const serialize = (docs) => JSON.parse(JSON.stringify(docs));

/** Solo productos publicables: `hide: true` queda fuera del catálogo indexable. */
const filtroBase = { hide: { $ne: true } };

const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Filtro de búsqueda por texto: cada palabra debe aparecer en el nombre, título, marca,
 * categoría, modelo o código (sin importar mayúsculas). Devuelve {} si no hay texto.
 */
export function filtroBusqueda(q) {
  const palabras = String(q ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .map((p) => p.slice(0, 40));
  if (!palabras.length) return {};
  const campos = ['nombre', 'titulo_de_producto', 'marca', 'categoria', 'modelo', 'cod_producto', 'nbSku'];
  return {
    $and: palabras.map((p) => {
      const re = new RegExp(escapar(p), 'i');
      return { $or: campos.map((c) => ({ [c]: re })) };
    }),
  };
}

export async function listarProductos({ filtro = {}, pagina = 1, porPagina = POR_PAGINA } = {}) {
  await connectDB();
  const query = { ...filtroBase, ...filtro };
  const total = await Producto.countDocuments(query);
  const productos = await Producto.find(query, CAMPOS)
    // Disponibles primero: la primera pantalla decide el rebote.
    .sort({ vendido: 1, stock: 1, nombre: 1 })
    .skip((pagina - 1) * porPagina)
    .limit(porPagina)
    .lean();
  return { productos: serialize(productos), total, totalPaginas: Math.max(1, Math.ceil(total / porPagina)) };
}

/** Valores distintos con su conteo, ya filtrados de vacíos. */
async function distintos(campo) {
  await connectDB();
  const filas = await Producto.aggregate([
    { $match: { ...filtroBase, [campo]: { $nin: [null, ''] } } },
    { $group: { _id: `$${campo}`, total: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return filas.map((f) => ({ valor: String(f._id).trim(), total: f.total })).filter((f) => f.valor);
}

export async function contarProductos() {
  await connectDB();
  return Producto.countDocuments(filtroBase);
}

// Categorías cuyas fotos de estudio (fondo blanco) quedan bien ampliadas en el hero
const CATEGORIAS_HERO = [
  'TECLADOS', 'MOUSES', 'AURICULARES', 'GABINETE GAMER', 'COOLERS', 'FUENTES', 'PROCESADORES', 'PARLANTES',
  'MONITORES', 'MEMORIAS', 'DISCOS SSD', 'PLACA DE VIDEO', 'NOTEBOOKS Y PORTATILES', 'CAMARAS IP', 'JOYSTICKS', 'WEBCAMS',
];

/** Productos reales con stock y foto de NB para el hero: `n` de categorías distintas, al azar. */
export async function productosParaHero(n = 3) {
  await connectDB();
  const docs = await Producto.aggregate([
    {
      $match: {
        ...filtroBase,
        origen: 'nb',
        cantidad: { $gt: 0 },
        foto_1_1: { $regex: '^https://static\\.nb\\.com\\.ar/' },
        categoria: { $in: CATEGORIAS_HERO },
      },
    },
    { $sample: { size: 40 } },
    { $project: { cod_producto: 1, nombre: 1, titulo_de_producto: 1, marca: 1, categoria: 1, precio: 1, foto_1_1: 1, usd: 1 } },
  ]);
  const vistas = new Set();
  const elegidos = [];
  for (const d of docs) {
    if (vistas.has(d.categoria)) continue;
    vistas.add(d.categoria);
    elegidos.push(d);
    if (elegidos.length >= n) break;
  }
  return serialize(elegidos);
}

// cache() dedupe por request: generateMetadata y el componente piden lo mismo.
export const listarCategorias = cache(() => distintos('categoria'));
export const listarMarcas = cache(() => distintos('marca'));
