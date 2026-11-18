import Link from 'next/link';

/**
 * Paginación por enlaces reales (no botones): cada página es rastreable.
 */
export default function Paginacion({ pagina, totalPaginas, basePath }) {
  if (totalPaginas <= 1) return null;
  const href = (n) => (n === 1 ? basePath : `${basePath}?page=${n}`);

  // Ventana de 5 páginas alrededor de la actual
  const desde = Math.max(1, Math.min(pagina - 2, totalPaginas - 4));
  const hasta = Math.min(totalPaginas, desde + 4);
  const paginas = [];
  for (let i = desde; i <= hasta; i++) paginas.push(i);

  const base = 'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm';

  return (
    <nav aria-label="Paginación del catálogo" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {pagina > 1 && (
        <Link href={href(pagina - 1)} rel="prev" className={`${base} border-gray-300 text-gray-700 hover:bg-gray-50`}>
          Anterior
        </Link>
      )}
      {desde > 1 && <Link href={href(1)} className={`${base} border-gray-300 text-gray-700 hover:bg-gray-50`}>1</Link>}
      {desde > 2 && <span className="px-1 text-gray-400">…</span>}
      {paginas.map((n) =>
        n === pagina ? (
          <span key={n} aria-current="page" className={`${base} border-blue-700 bg-blue-700 font-semibold text-white`}>{n}</span>
        ) : (
          <Link key={n} href={href(n)} className={`${base} border-gray-300 text-gray-700 hover:bg-gray-50`}>{n}</Link>
        )
      )}
      {hasta < totalPaginas - 1 && <span className="px-1 text-gray-400">…</span>}
      {hasta < totalPaginas && (
        <Link href={href(totalPaginas)} className={`${base} border-gray-300 text-gray-700 hover:bg-gray-50`}>{totalPaginas}</Link>
      )}
      {pagina < totalPaginas && (
        <Link href={href(pagina + 1)} rel="next" className={`${base} border-gray-300 text-gray-700 hover:bg-gray-50`}>
          Siguiente
        </Link>
      )}
    </nav>
  );
}
