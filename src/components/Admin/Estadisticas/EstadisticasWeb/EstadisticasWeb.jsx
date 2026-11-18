'use client';
import React from 'react';
import SeccionWeb from './SeccionWeb';
import { Cargable } from '../comun/ui';
import { useEstadistica } from '../comun/useEstadistica';

// Visitas del sitio (Google Analytics). Los datos de la campaña están en la pestaña "Ads".
export default function EstadisticasWeb({ dias = '30' }) {
  const { data, loading, error, reintentar } = useEstadistica(`/api/admin/estadisticas-web?dias=${dias}&parte=web`);

  return (
    <Cargable loading={loading} error={error} onRetry={reintentar}>
      {data?.web && <SeccionWeb web={data.web} conversion={data.conversion} />}
    </Cargable>
  );
}
