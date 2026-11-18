'use client';
import { useState } from 'react';
import Link from 'next/link';
import { categoriaUrl, marcaUrl } from '../../Utils/catalogSlug';

const LIMITE = 10;

/**
 * Lista de enlaces con "Ver más". Todos los enlaces están siempre en el HTML (rastreables por Google);
 * los que sobran solo se ocultan hasta que se pide verlos. La opción activa nunca se oculta.
 */
function Lista({ titulo, plural, items, urlFn, activa }) {
  const [todas, setTodas] = useState(false);
  const ordenadas = [...items].sort((a, b) => b.total - a.total || a.valor.localeCompare(b.valor, 'es'));
  const sobran = ordenadas.length - LIMITE;

  return (
    <section aria-label={titulo} className="mb-8">
      <h2 className="mb-2 text-lg font-bold text-gray-900">{titulo}</h2>
      <ul>
        {ordenadas.map((c, i) => {
          const esActiva = activa === c.valor;
          return (
            <li key={c.valor} hidden={!todas && i >= LIMITE && !esActiva}>
              <Link
                href={urlFn(c.valor)}
                aria-current={esActiva ? 'page' : undefined}
                className={`flex items-baseline justify-between gap-3 px-3 py-2 text-[15px] leading-snug transition-colors ${
                  esActiva ? 'bg-orange-100 font-semibold text-orange-900' : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span>{c.valor}</span>
                <span className="text-sm tabular-nums text-gray-600">{c.total}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {sobran > 0 && (
        <button
          type="button"
          onClick={() => setTodas((v) => !v)}
          aria-expanded={todas}
          className="mt-2 px-3 py-2 text-[15px] font-semibold text-orange-800 hover:underline"
        >
          {todas ? 'Ver menos' : `Ver más ${plural} (${sobran})`}
        </button>
      )}
    </section>
  );
}

/**
 * Menú lateral con todas las categorías y marcas. En pantallas chicas se abre con un botón.
 */
export default function SidebarFiltros({ categorias = [], marcas = [], categoriaActiva, marcaActiva, hayFiltro }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto" aria-label="Filtros del catálogo">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="filtros-panel"
        className="mb-4 flex w-full items-center justify-between bg-gray-100 px-4 py-3 text-base font-semibold text-gray-900 lg:hidden"
      >
        <span>Categorías y marcas</span>
        <span aria-hidden="true">{abierto ? '−' : '+'}</span>
      </button>

      <div id="filtros-panel" className={`${abierto ? 'block' : 'hidden'} lg:block`}>
        {hayFiltro && (
          <Link href="/productos" className="mb-6 block px-3 py-2 text-[15px] font-semibold text-orange-800 hover:underline">
            Ver todo el catálogo
          </Link>
        )}
        <Lista titulo="Categorías" plural="categorías" items={categorias} urlFn={categoriaUrl} activa={categoriaActiva} />
        <Lista titulo="Marcas" plural="marcas" items={marcas} urlFn={marcaUrl} activa={marcaActiva} />
      </div>
    </aside>
  );
}
