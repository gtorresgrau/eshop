/**
 * Fuente única de verdad para el slug y la URL pública de un producto.
 * Usar SIEMPRE estas funciones (compartir, cards, sitemap, canonical, JSON-LD).
 *
 * Formato: el nombre del producto con espacios -> "_". Es el formato con el que
 * las fichas ya están indexadas y compartidas, así que NO se cambia: si cambia,
 * se rompen los links existentes. /api/productos/[slug] resuelve ese mismo formato.
 */
export const getProductSlug = (product) =>
  String(product?.nombre || '').trim().replace(/\s+/g, '_');

/** Ruta relativa a la ficha, con el slug codificado para URL. */
export const getProductPath = (product) =>
  `/productos/${encodeURIComponent(getProductSlug(product))}`;

/** URL completa. Pasar origin en cliente (window.location.origin) o servidor (NEXT_PUBLIC_SITE_URL). */
export const getProductUrl = (product, origin = '') => `${origin}${getProductPath(product)}`;
