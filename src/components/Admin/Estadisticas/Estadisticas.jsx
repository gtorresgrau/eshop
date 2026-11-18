'use client';
import React, { useState } from 'react';
import { FaWhatsapp, FaChartLine, FaStore, FaBullhorn, FaGlobe } from 'react-icons/fa';
import EstadisticasWhatsApp from './EstadisticasWhatsApp/EstadisticasWhatsApp';
import EstadisticasVentas from './EstadisticasVentas/EstadisticasVentas';
import EstadisticasNegocio from './EstadisticasNegocio/EstadisticasNegocio';
import EstadisticasWeb from './EstadisticasWeb/EstadisticasWeb';
import EstadisticasAds from './EstadisticasAds/EstadisticasAds';

const TABS = [
  { id: 'negocio', nombre: 'Negocio', icono: FaStore, componente: EstadisticasNegocio, usaPeriodo: true },
  { id: 'ventas', nombre: 'Ventas', icono: FaChartLine, componente: EstadisticasVentas, usaPeriodo: true },
  { id: 'web', nombre: 'Web', icono: FaGlobe, componente: EstadisticasWeb, usaPeriodo: true },
  { id: 'ads', nombre: 'Ads', icono: FaBullhorn, componente: EstadisticasAds, usaPeriodo: true },
  { id: 'whatsapp', nombre: 'WhatsApp', icono: FaWhatsapp, componente: EstadisticasWhatsApp, usaPeriodo: true },
];

const PERIODOS = [
  { valor: '7', texto: 'Últimos 7 días' },
  { valor: '30', texto: 'Últimos 30 días' },
  { valor: '90', texto: 'Últimos 90 días' },
  { valor: '180', texto: 'Últimos 6 meses' },
  { valor: '365', texto: 'Último año' },
];

export default function Estadisticas() {
  const [activa, setActiva] = useState('negocio');
  const [dias, setDias] = useState('30');

  const tab = TABS.find((t) => t.id === activa) ?? TABS[0];
  const Componente = tab.componente;

  // Flechas izquierda/derecha entre pestañas (patrón de accesibilidad de tabs)
  const onKeyTabs = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = TABS.findIndex((t) => t.id === activa);
    const sig = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setActiva(sig.id);
    document.getElementById(`estadisticas-tab-${sig.id}`)?.focus();
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">Estadísticas</h1>
          <p className="mt-0.5 text-sm text-gray-500">Cómo van las ventas, la web y las campañas.</p>
        </div>

        {tab.usaPeriodo ? (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <span className="sr-only sm:not-sr-only">Período</span>
            <select
              value={dias}
              onChange={(e) => setDias(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
            >
              {PERIODOS.map((p) => (
                <option key={p.valor} value={p.valor}>{p.texto}</option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-xs text-gray-500">Esta sección no usa período.</p>
        )}
      </header>

      {/* Pestañas: nombres siempre visibles; en celular se desplazan hacia el costado */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label="Secciones de estadísticas"
          onKeyDown={onKeyTabs}
          className="flex min-w-max gap-1 border-b border-gray-200"
        >
          {TABS.map(({ id, nombre, icono: Icono }) => {
            const seleccionada = id === activa;
            return (
              <button
                key={id}
                id={`estadisticas-tab-${id}`}
                role="tab"
                type="button"
                aria-selected={seleccionada}
                aria-controls="estadisticas-panel"
                tabIndex={seleccionada ? 0 : -1}
                onClick={() => setActiva(id)}
                className={`-mb-px flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  seleccionada
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                <Icono className="h-4 w-4" aria-hidden="true" />
                {nombre}
              </button>
            );
          })}
        </div>
      </div>

      <div role="tabpanel" id="estadisticas-panel" aria-labelledby={`estadisticas-tab-${tab.id}`}>
        <Componente dias={dias} />
      </div>
    </div>
  );
}
