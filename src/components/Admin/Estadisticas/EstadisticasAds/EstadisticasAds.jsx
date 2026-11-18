'use client';
import React from 'react';
import SeccionCampania from './SeccionCampania';
import { Cargable } from '../comun/ui';
import { useEstadistica } from '../comun/useEstadistica';

// Campaña de Google Ads (leída desde Google Analytics). Las visitas del sitio están en la pestaña "Web".
export default function EstadisticasAds({ dias = '30' }) {
  const { data, loading, error, reintentar } = useEstadistica(`/api/admin/estadisticas-web?dias=${dias}&parte=ads`);

  return (
    <Cargable loading={loading} error={error} onRetry={reintentar}>
      {data?.ads && <SeccionCampania ads={data.ads} conversion={data.conversion} />}
    </Cargable>
  );
}
