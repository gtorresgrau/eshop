// Las fotos de New Bytes vienen en dos tamaños con el mismo nombre y hash:
//   .../nb_<nombre>_ver_<hash>.jpeg     → 1500 px (400–800 KB): para detalle grande
//   .../nb_<nombre>_export_<hash>.jpeg  → 800 px  (30–300 KB): para cards y hero
// En listados se usa la liviana: una página de 24 productos pasa de ~10 MB a ~3 MB.
export function fotoLiviana(url) {
  if (typeof url !== 'string') return url;
  return url.includes('static.nb.com.ar') && url.includes('_ver_') ? url.replace('_ver_', '_export_') : url;
}
