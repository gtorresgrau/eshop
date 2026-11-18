/**
 * Slugs para las landings de catálogo (/categorias/... y /marcas/...).
 *
 * Ojo: NO reutiliza `toSlug` de productSlug.js a propósito. Ese usa "_" como
 * separador porque las URLs de ficha ya están indexadas con ese formato y no
 * se pueden romper. Para las rutas nuevas usamos "-", que es el estándar.
 */

export const toKebab = (text = '') =>
  String(text)
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Dado un slug y la lista de valores reales de la DB, devuelve el valor original.
 * Las listas de categorías/marcas son chicas (decenas), así que resolver en
 * memoria es más barato y más seguro que armar un regex contra Mongo.
 */
export const resolveFromSlug = (slug = '', values = []) => {
  const target = toKebab(slug);
  return values.find((v) => toKebab(v) === target) || null;
};

export const categoriaUrl = (categoria = '') => `/categorias/${toKebab(categoria)}`;
export const marcaUrl = (marca = '') => `/marcas/${toKebab(marca)}`;
