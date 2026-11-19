'use client';
import React, { useState } from 'react';
import SeccionWeb from './SeccionWeb';
import { Cargable } from '../comun/ui';
import { useEstadistica } from '../comun/useEstadistica';

// Visitas del sitio (Google Analytics). Los datos de la campaña están en la pestaña "Ads".
export default function EstadisticasWeb({ dias = '30' }) {
  // Por defecto solo Argentina: el resto del mundo es casi todo tráfico automático (bots)
  const [soloArgentina, setSoloArgentina] = useState(true);
  const { data, loading, error, reintentar } = useEstadistica(
    `/api/admin/estadisticas-web?dias=${dias}&parte=web${soloArgentina ? '&pais=AR' : ''}`
  );
  const boton = (activo) =>
    `px-3 py-1.5 text-sm font-semibold ${activo ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Alcance de las visitas">
        <button type="button" onClick={() => setSoloArgentina(true)} aria-pressed={soloArgentina} className={boton(soloArgentina)}>Solo Argentina</button>
        <button type="button" onClick={() => setSoloArgentina(false)} aria-pressed={!soloArgentina} className={boton(!soloArgentina)}>Todo el mundo</button>
      </div>
      <Cargable loading={loading} error={error} onRetry={reintentar}>
        {data?.web && <SeccionWeb web={data.web} conversion={data.conversion} />}
      </Cargable>
    </div>
  );
}
