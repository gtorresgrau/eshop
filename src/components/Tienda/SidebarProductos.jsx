'use client';
import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const LIMITE = 10;

const ORDEN = [
  { value: 'rel', label: 'Relevancia' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'dest', label: 'Destacados' },
];

/** Cuenta cuántos productos hay por valor de un campo (categoría, marca) y ordena por cantidad. */
function contar(productos, campo) {
  const m = new Map();
  for (const p of productos) {
    const v = String(p?.[campo] ?? '').trim();
    if (v) m.set(v, (m.get(v) || 0) + 1);
  }
  return [...m]
    .map(([valor, total]) => ({ valor, total }))
    .sort((a, b) => b.total - a.total || a.valor.localeCompare(b.valor, 'es'));
}

const filaBase = 'flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left text-[15px] leading-snug transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700';
const filaActiva = 'bg-orange-100 font-semibold text-orange-900';
const filaNormal = 'text-gray-800 hover:bg-gray-100';

function ListaFiltro({ titulo, plural, items, activa, onSelect, todasLabel }) {
  const [todas, setTodas] = useState(false);
  const sobran = items.length - LIMITE;

  return (
    <section aria-label={titulo} className="mb-8">
      <h2 className="mb-2 text-lg font-bold text-gray-900">{titulo}</h2>
      <ul>
        <li>
          <button type="button" onClick={() => onSelect('')} aria-pressed={!activa} className={`${filaBase} ${!activa ? filaActiva : filaNormal}`}>
            <span>{todasLabel}</span>
          </button>
        </li>
        {items.map((c, i) => {
          const esActiva = activa === c.valor;
          return (
            <li key={c.valor} hidden={!todas && i >= LIMITE && !esActiva}>
              <button
                type="button"
                onClick={() => onSelect(esActiva ? '' : c.valor)}
                aria-pressed={esActiva}
                className={`${filaBase} ${esActiva ? filaActiva : filaNormal}`}
              >
                <span>{c.valor}</span>
                <span className="text-sm tabular-nums text-gray-600">{c.total}</span>
              </button>
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
 * Menú lateral de la tienda: orden, condición, categorías y marcas. Los filtros viven en la URL
 * (?cat=&marca=&cond=&orden=) y los aplica Productos.jsx. Las cuentas salen de los productos cargados.
 */
export default function SidebarProductos({ productos = [], isLoading = false }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [abierto, setAbierto] = useState(false);

  const catActiva = searchParams.get('cat') || '';
  const marcaActiva = searchParams.get('marca') || '';
  const condActiva = searchParams.get('cond') || '';
  const ordenActivo = searchParams.get('orden') || 'rel';

  const categorias = useMemo(() => contar(productos, 'categoria'), [productos]);
  const marcas = useMemo(() => contar(productos, 'marca'), [productos]);
  const hayUsados = useMemo(() => productos.some((p) => p?.usado), [productos]);

  const setParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}#productos`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const limpiar = useCallback(() => {
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) params.set('search', search);
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}#productos`, { scroll: false });
  }, [searchParams, pathname, router]);

  const hayFiltros = Boolean(catActiva || marcaActiva || condActiva || ordenActivo !== 'rel');

  return (
    <aside className="mb-6 lg:sticky lg:top-20 lg:mb-0 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto" aria-label="Filtros de productos">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="filtros-tienda"
        className="flex w-full items-center justify-between bg-gray-100 px-4 py-3 text-base font-semibold text-gray-900 lg:hidden"
      >
        <span>Filtros{hayFiltros ? ' (activos)' : ''}</span>
        <span aria-hidden="true">{abierto ? '−' : '+'}</span>
      </button>

      <div id="filtros-tienda" className={`${abierto ? 'mt-4 block' : 'hidden'} lg:mt-0 lg:block`}>
        {isLoading ? (
          <div className="space-y-2" aria-hidden="true">
            {[...Array(8)].map((_, i) => <div key={i} className="h-9 animate-pulse bg-gray-100 motion-reduce:animate-none" />)}
          </div>
        ) : (
          <>
            {hayFiltros && (
              <button type="button" onClick={limpiar} className="mb-6 px-3 py-2 text-[15px] font-semibold text-orange-800 hover:underline">
                Limpiar filtros
              </button>
            )}

            <section aria-label="Ordenar" className="mb-8">
              <label htmlFor="orden-tienda" className="mb-2 block text-lg font-bold text-gray-900">Ordenar por</label>
              <select
                id="orden-tienda"
                value={ordenActivo}
                onChange={(e) => setParam('orden', e.target.value === 'rel' ? '' : e.target.value)}
                className="h-11 w-full bg-gray-100 px-3 text-base text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700"
              >
                {ORDEN.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </section>

            {hayUsados && (
              <section aria-label="Condición" className="mb-8">
                <h2 className="mb-2 text-lg font-bold text-gray-900">Condición</h2>
                <ul>
                  {[['', 'Todos'], ['nuevo', 'Nuevos'], ['usado', 'Usados']].map(([v, label]) => (
                    <li key={v || 'todos'}>
                      <button type="button" onClick={() => setParam('cond', v)} aria-pressed={condActiva === v} className={`${filaBase} ${condActiva === v ? filaActiva : filaNormal}`}>
                        <span>{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <ListaFiltro titulo="Categorías" plural="categorías" items={categorias} activa={catActiva} onSelect={(v) => setParam('cat', v)} todasLabel="Todas las categorías" />
            <ListaFiltro titulo="Marcas" plural="marcas" items={marcas} activa={marcaActiva} onSelect={(v) => setParam('marca', v)} todasLabel="Todas las marcas" />
          </>
        )}
      </div>
    </aside>
  );
}
