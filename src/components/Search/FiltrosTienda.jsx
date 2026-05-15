'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import fetchFiltersData from '../../Hooks/useBrandsCategories';

const SORT_OPTIONS = [
  { value: 'rel',         label: '⭐ Relevancia' },
  { value: 'precio_asc',  label: '💰 Precio: menor a mayor' },
  { value: 'precio_desc', label: '💰 Precio: mayor a menor' },
  { value: 'dest',        label: '🔥 Destacados' },
];

const COND_OPTIONS = [
  { value: '',      label: 'Todos' },
  { value: 'nuevo', label: '✨ Nuevo' },
  { value: 'usado', label: '🔄 Usado' },
];

export default function FiltrosTienda() {
  const router   = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [marcas,     setMarcas]     = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  const catActiva   = searchParams.get('cat')   || '';
  const marcaActiva = searchParams.get('marca')  || '';
  const condActiva  = searchParams.get('cond')   || '';
  const ordenActivo = searchParams.get('orden')  || 'rel';

  useEffect(() => {
    fetchFiltersData().then((data) => {
      if (data) {
        setMarcas(     (data.marcas     || []).filter(Boolean).sort());
        setCategorias( (data.categorias || []).filter(Boolean).sort());
      }
      setLoadingFilters(false);
    });
  }, []);

  const updateParam = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}#productos`, { scroll: false });
  }, [searchParams, pathname, router]);

  const toggleParam = useCallback((key, value) => {
    const current = searchParams.get(key) || '';
    updateParam(key, current === value ? '' : value);
  }, [searchParams, updateParam]);

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    const search = searchParams.get('search');
    if (search) params.set('search', search);
    router.push(`${pathname}?${params.toString()}#productos`, { scroll: false });
  }, [searchParams, pathname, router]);

  const activeFiltersCount = [catActiva, marcaActiva, condActiva].filter(Boolean).length;
  const hasActiveFilters   = activeFiltersCount > 0 || (ordenActivo && ordenActivo !== 'rel');

  if (loadingFilters) {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-3 py-2">
        <div className="flex gap-2 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-gray-100 animate-pulse shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-3 py-2 space-y-2">

      {/* ── Categorías (pills scroll horizontal) ── */}
      {categorias.length > 0 && (
        <div className="relative">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* "Todas" pill */}
            <button
              onClick={() => updateParam('cat', '')}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                !catActiva
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              Todas las categorías
            </button>

            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleParam('cat', cat)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                  catActiva === cat
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Fila de filtros secundarios ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Marca */}
        {marcas.length > 0 && (
          <div className="relative">
            <select
              value={marcaActiva}
              onChange={(e) => updateParam('marca', e.target.value)}
              className={`text-xs rounded-lg px-3 py-1.5 border outline-none cursor-pointer transition-all appearance-none pr-7 ${
                marcaActiva
                  ? 'bg-orange-50 border-orange-400 text-orange-700 font-semibold'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
              title="Filtrar por marca"
            >
              <option value="">Todas las marcas</option>
              {marcas.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
          </div>
        )}

        {/* Condición */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {COND_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('cond', opt.value)}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all border-r last:border-r-0 border-gray-200 ${
                condActiva === opt.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Orden */}
        <div className="relative ml-auto">
          <select
            value={ordenActivo}
            onChange={(e) => updateParam('orden', e.target.value)}
            className={`text-xs rounded-lg px-3 py-1.5 border outline-none cursor-pointer transition-all appearance-none pr-7 ${
              ordenActivo !== 'rel'
                ? 'bg-orange-50 border-orange-400 text-orange-700 font-semibold'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
            title="Ordenar productos"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▾</span>
        </div>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1.5 rounded-lg hover:bg-red-50 transition border border-red-200 hover:border-red-300"
            title="Limpiar todos los filtros"
          >
            ✕ Limpiar
            {activeFiltersCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── Chips de filtros activos ── */}
      {(catActiva || marcaActiva || condActiva) && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {catActiva && (
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
              📦 {catActiva}
              <button onClick={() => updateParam('cat', '')} className="hover:text-orange-900 ml-0.5" aria-label="Quitar filtro categoría">✕</button>
            </span>
          )}
          {marcaActiva && (
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
              🏷️ {marcaActiva}
              <button onClick={() => updateParam('marca', '')} className="hover:text-blue-900 ml-0.5" aria-label="Quitar filtro marca">✕</button>
            </span>
          )}
          {condActiva && (
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {condActiva === 'nuevo' ? '✨' : '🔄'} {condActiva === 'nuevo' ? 'Nuevo' : 'Usado'}
              <button onClick={() => updateParam('cond', '')} className="hover:text-green-900 ml-0.5" aria-label="Quitar filtro condición">✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
