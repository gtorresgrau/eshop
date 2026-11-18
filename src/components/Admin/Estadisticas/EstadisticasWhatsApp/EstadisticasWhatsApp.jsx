'use client';
import React from 'react';
import { COLOR, fmt, pct, Tarjeta, GrillaTarjetas, Panel, Reparto, Aviso, Cargable } from '../comun/ui';
import { GraficoBarras } from '../comun/graficos';
import { useEstadistica } from '../comun/useEstadistica';

export default function EstadisticasWhatsApp({ dias = '30' }) {
  const { data, loading, error, reintentar } = useEstadistica(`/api/whatsapp-stats?periodo=${dias}`);

  return (
    <Cargable loading={loading} error={error} onRetry={reintentar}>
      {data && <Contenido data={data} dias={dias} />}
    </Cargable>
  );
}

function Contenido({ data, dias }) {
  const { administracion, ventas, total } = data.totales;
  const porDia = data.porDia ?? [];

  if (total === 0) {
    return (
      <Aviso titulo="Todavía no hay clics en este período">
        Cada vez que alguien toca el botón de WhatsApp de Administración o de Ventas se registra acá.
      </Aviso>
    );
  }

  return (
    <div className="space-y-4">
      <GrillaTarjetas columnas="xl:grid-cols-3">
        <Tarjeta titulo="Clics a Administración" valor={fmt(administracion)} detalle={`${pct(administracion / total, 0)} del total`} />
        <Tarjeta titulo="Clics a Ventas" valor={fmt(ventas)} detalle={`${pct(ventas / total, 0)} del total`} />
        <Tarjeta titulo="Total de clics" valor={fmt(total)} detalle={`últimos ${dias} días`} />
      </GrillaTarjetas>

      <Panel titulo="A quién escriben" descripcion="Reparto de clics entre los dos botones">
        <Reparto
          partes={[
            { nombre: 'Administración', valor: administracion, color: COLOR.serie1 },
            { nombre: 'Ventas', valor: ventas, color: COLOR.serie2 },
          ]}
        />
      </Panel>

      {porDia.length > 0 && (
        <Panel titulo="Clics por día" descripcion="Cada barra suma los clics de ambos botones">
          <GraficoBarras
            datos={porDia}
            apilado
            etiqueta="Clics por día en los botones de WhatsApp"
            series={[
              { clave: 'administracion', nombre: 'Administración', color: COLOR.serie1 },
              { clave: 'ventas', nombre: 'Ventas', color: COLOR.serie2 },
            ]}
          />
        </Panel>
      )}
    </div>
  );
}
