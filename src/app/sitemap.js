// Next.js App Router – genera /sitemap.xml automáticamente.
// Revalida cada 6 horas para reflejar productos nuevos.
export const revalidate = 21600;

import { connectDB } from '../lib/mongodb';
import Producto from '../models/product';
import { getProductPath } from '../Utils/productSlug';
import { listarCategorias, listarMarcas } from '../lib/catalogo';
import { categoriaUrl, marcaUrl } from '../Utils/catalogSlug';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

const COMPARATIVAS = ['almacenamiento', 'memoria', 'fuente', 'mothers', 'procesadores', 'tecnologias'];

export default async function sitemap() {
  const ahora = new Date();

  // 1) Rutas estáticas
  const staticEntries = [
    { url: SITE, lastModified: ahora, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE}/productos`, lastModified: ahora, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/nosotros`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/envios`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.8 },
    ...['devoluciones', 'contacto'].map((slug) => ({
      url: `${SITE}/${slug}`,
      lastModified: ahora,
      changeFrequency: 'yearly',
      priority: 0.5,
    })),
    { url: `${SITE}/productos/StarLinkmini`, lastModified: ahora, changeFrequency: 'monthly', priority: 0.8 },
    ...COMPARATIVAS.map((c) => ({
      url: `${SITE}/comparativas/${c}`,
      lastModified: ahora,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];

  // 2) Landings de categoría y marca: capturan las búsquedas genéricas
  let landingEntries = [];
  try {
    const [categorias, marcas] = await Promise.all([listarCategorias(), listarMarcas()]);
    landingEntries = [
      ...categorias.map((c) => ({ url: `${SITE}${categoriaUrl(c.valor)}`, lastModified: ahora, changeFrequency: 'weekly', priority: 0.8 })),
      ...marcas.map((m) => ({ url: `${SITE}${marcaUrl(m.valor)}`, lastModified: ahora, changeFrequency: 'weekly', priority: 0.8 })),
    ];
  } catch (e) {
    console.error('[Sitemap] Error en landings:', e);
  }

  // 3) Fichas de producto desde Mongo (sin los ocultos)
  let productEntries = [];
  try {
    await connectDB();
    const productos = await Producto
      .find({ hide: { $ne: true } }, { nombre: 1, foto_1_1: 1, categoria: 1, updatedAt: 1 })
      .lean();

    productEntries = productos
      .filter((p) => p?.nombre && String(p.nombre).trim())
      .map((p) => ({
        url: `${SITE}${getProductPath(p)}`,
        lastModified: p.updatedAt || ahora,
        changeFrequency: 'weekly',
        priority: 0.9,
        images: p.foto_1_1 ? [p.foto_1_1] : undefined,
      }));
  } catch (e) {
    // Si falla la DB devolvemos solo lo estático
    console.error('[Sitemap] DB error:', e);
  }

  // 4) Sin repetidas (algunas categorías/marcas generan el mismo slug)
  const vistas = new Set();
  return [...staticEntries, ...landingEntries, ...productEntries].filter((e) => {
    if (vistas.has(e.url)) return false;
    vistas.add(e.url);
    return true;
  });
}
