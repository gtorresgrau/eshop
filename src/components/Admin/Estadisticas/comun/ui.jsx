'use client';
import React from 'react';

// Paleta de gráficos (validada con la skill dataviz): serie 1 azul, serie 2 naranja, serie 3 aqua.
export const COLOR = {
  serie1: '#2a78d6',
  serie2: '#eb6834',
  serie3: '#1baf7a',
  apagado: '#898781',
  grilla: '#e1e0d9',
  eje: '#c3c2b7',
};

export const fmt = (n) => new Intl.NumberFormat('es-AR').format(Math.round(n ?? 0));
export const pct = (n, dec = 1) => `${((n ?? 0) * 100).toFixed(dec).replace('.', ',')}%`;
export const seg = (s) => `${Math.floor((s ?? 0) / 60)}m ${Math.round((s ?? 0) % 60)}s`;
export const monto = (n, moneda = 'ARS', dec = 2) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: dec === 0 ? 0 : undefined,
    maximumFractionDigits: dec,
  }).format(n ?? 0);
export const pesos = (n) => monto(n, 'ARS', 0);
// Pesos sin decimales; si la moneda no es ARS (no hubo cotización) se muestran 2 decimales
export const importe = (n, moneda = 'ARS') => monto(n, moneda, moneda === 'ARS' ? 0 : 2);

const fechaCorta = (iso) => {
  const d = iso ? new Date(iso) : null;
  return d && !Number.isNaN(d.getTime())
    ? new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit' }).format(d)
    : null;
};

// Aclara de dónde salen los importes cuando hubo que convertirlos de dólares a pesos
export function NotaConversion({ conversion, moneda }) {
  if (conversion) {
    const fecha = fechaCorta(conversion.fecha);
    return (
      <p className="text-xs text-gray-400">
        Google Analytics informa los importes en dólares. Se convirtieron a pesos con el {conversion.cotizacion}{' '}
        ({pesos(conversion.tasa)}{fecha ? `, actualizado el ${fecha}` : ''}), la cotización más alta del día.
      </p>
    );
  }
  if (moneda && moneda !== 'ARS') {
    return (
      <p className="text-xs text-amber-700">
        No se pudo obtener la cotización del dólar, por eso los importes se muestran en {moneda}.
      </p>
    );
  }
  return null;
}

export const ejeProps = {
  tick: { fill: COLOR.apagado, fontSize: 12 },
  tickLine: false,
};

export function Tarjeta({ titulo, valor, detalle }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-gray-200">
      <p className="text-xs font-medium text-gray-500">{titulo}</p>
      <p className="mt-1 truncate text-xl font-semibold tabular-nums tracking-tight text-gray-900 md:text-2xl" title={String(valor)}>
        {valor}
      </p>
      <p className="mt-0.5 min-h-4 text-xs text-gray-400">{detalle ?? ' '}</p>
    </div>
  );
}

export function GrillaTarjetas({ children, columnas = 'xl:grid-cols-6' }) {
  return <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 ${columnas}`}>{children}</div>;
}

export function Panel({ titulo, descripcion, children }) {
  return (
    <section className="min-w-0 rounded-xl bg-white p-4 ring-1 ring-gray-200 md:p-5">
      <header className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{titulo}</h3>
        {descripcion && <p className="mt-0.5 text-xs text-gray-500">{descripcion}</p>}
      </header>
      {children}
    </section>
  );
}

export function GraficoTooltip({ active, payload, label, formato = fmt }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-gray-200">
      <p className="mb-1 font-medium text-gray-900">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-2 text-gray-600">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          {p.name}: <span className="font-medium tabular-nums text-gray-900">{formato(p.value)}</span>
        </p>
      ))}
    </div>
  );
}

// Lista con barra de proporción (canales, páginas, categorías, rankings)
export function BarraLista({ items, vacio = 'Sin datos en el período.', numerada = false }) {
  if (!items.length) return <p className="text-sm text-gray-500">{vacio}</p>;
  const max = Math.max(...items.map((i) => i.valor), 1);
  return (
    <ul className="space-y-3">
      {items.map((i, idx) => (
        <li key={i.clave ?? idx}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-gray-700" title={i.etiqueta}>
              {numerada && <span className="mr-2 tabular-nums text-gray-400">{idx + 1}</span>}
              {i.etiqueta}
            </span>
            <span className="shrink-0 font-medium tabular-nums text-gray-900">
              {i.texto ?? fmt(i.valor)}
              {i.extra && <span className="ml-1.5 font-normal text-gray-500">{i.extra}</span>}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full"
              style={{ width: `${(i.valor / max) * 100}%`, background: i.color ?? COLOR.serie1 }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Reparto de un total entre pocas partes (ej.: Administración vs Ventas)
export function Reparto({ partes }) {
  const total = partes.reduce((a, p) => a + p.valor, 0);
  return (
    <div>
      <div className="flex h-3 gap-0.5 overflow-hidden rounded-full bg-gray-100" role="img"
        aria-label={partes.map((p) => `${p.nombre} ${total ? Math.round((p.valor / total) * 100) : 0}%`).join(', ')}>
        {total > 0 && partes.map((p) => (
          <div key={p.nombre} style={{ width: `${(p.valor / total) * 100}%`, background: p.color }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
        {partes.map((p) => (
          <li key={p.nombre} className="flex items-center gap-2 text-gray-600">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
            {p.nombre}
            <span className="font-medium tabular-nums text-gray-900">{fmt(p.valor)}</span>
            <span className="tabular-nums text-gray-400">{total ? pct(p.valor / total, 0) : '0%'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Aviso({ tipo = 'info', titulo, children }) {
  const estilos = {
    info: 'bg-blue-50 text-blue-900 ring-blue-200',
    aviso: 'bg-amber-50 text-amber-900 ring-amber-200',
    error: 'bg-red-50 text-red-900 ring-red-200',
  };
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={`rounded-xl p-4 text-sm ring-1 ${estilos[tipo]}`}>
      {titulo && <p className="font-semibold">{titulo}</p>}
      <div className={titulo ? 'mt-1' : ''}>{children}</div>
    </div>
  );
}

export function Esqueleto() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Cargando estadísticas">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-200/70" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-gray-200/70" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 rounded-xl bg-gray-200/70" />
        <div className="h-48 rounded-xl bg-gray-200/70" />
      </div>
    </div>
  );
}

// Muestra esqueleto mientras carga, error con reintento, o el contenido
export function Cargable({ loading, error, onRetry, children }) {
  if (loading) return <Esqueleto />;
  if (error) {
    return (
      <Aviso tipo="error" titulo="No se pudieron cargar las estadísticas">
        <p>{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 min-h-11 rounded-lg bg-white px-4 text-sm font-medium text-red-900 ring-1 ring-red-300 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Reintentar
        </button>
      </Aviso>
    );
  }
  return children;
}
