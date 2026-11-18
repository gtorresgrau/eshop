import Link from 'next/link';

/**
 * Paginación por enlaces reales (no botones): cada página es rastreable.
 * `q` conserva la búsqueda al cambiar de página.
 */
export default function Paginacion({ pagina, totalPaginas, basePath, q = '' }) {
  if (totalPaginas <= 1) return null;
  const href = (n) => {
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (n > 1) p.set('page', String(n));
    const s = p.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  // Ventana de 5 páginas alrededor de la actual
  const desde = Math.max(1, Math.min(pagina - 2, totalPaginas - 4));
  const hasta = Math.min(totalPaginas, desde + 4);
  const paginas = [];
  for (let i = desde; i <= hasta; i++) paginas.push(i);

  const base = 'inline-flex h-11 min-w-11 items-center justify-center px-4 text-base transition-colors';
  const normal = `${base} bg-gray-100 text-gray-900 hover:bg-gray-200`;

  return (
    <nav aria-label="Paginación del catálogo" className="mt-14 flex flex-wrap items-center gap-2">
      {pagina > 1 && (
        <Link href={href(pagina - 1)} rel="prev" className={normal}>
          Anterior
        </Link>
      )}
      {desde > 1 && <Link href={href(1)} className={normal}>1</Link>}
      {desde > 2 && <span className="px-1 text-gray-600">…</span>}
      {paginas.map((n) =>
        n === pagina ? (
          <span key={n} aria-current="page" className={`${base} bg-gray-900 font-semibold text-white`}>{n}</span>
        ) : (
          <Link key={n} href={href(n)} className={normal}>{n}</Link>
        )
      )}
      {hasta < totalPaginas - 1 && <span className="px-1 text-gray-600">…</span>}
      {hasta < totalPaginas && <Link href={href(totalPaginas)} className={normal}>{totalPaginas}</Link>}
      {pagina < totalPaginas && (
        <Link href={href(pagina + 1)} rel="next" className={normal}>
          Siguiente
        </Link>
      )}
    </nav>
  );
}
