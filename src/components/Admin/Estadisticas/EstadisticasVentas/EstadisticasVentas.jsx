'use client';
import React from 'react';
import { COLOR, fmt, pesos, Tarjeta, GrillaTarjetas, Panel, BarraLista, Aviso, Cargable } from '../comun/ui';
import { GraficoBarras, GraficoLineas } from '../comun/graficos';
import { useEstadistica } from '../comun/useEstadistica';

export default function EstadisticasVentas({ dias = '30' }) {
  const { data, loading, error, reintentar } = useEstadistica(`/api/estadisticas-ventas?periodo=${dias}`);

  return (
    <Cargable loading={loading} error={error} onRetry={reintentar}>
      {data && <Contenido data={data} dias={dias} />}
    </Cargable>
  );
}

function Contenido({ data, dias }) {
  const t = data.totales;
  const porDia = data.porDia ?? [];
  const categorias = [...(data.porCategoria ?? [])].sort((a, b) => b.value - a.value);
  const topProductos = data.topProductos ?? [];

  if (!t.ventas && !t.ingresos) {
    return (
      <Aviso titulo="No hay ventas en este período">
        Probá con un período más largo para ver el detalle.
      </Aviso>
    );
  }

  return (
    <div className="space-y-4">
      <GrillaTarjetas columnas="xl:grid-cols-4">
        <Tarjeta titulo="Ventas" valor={fmt(t.ventas)} detalle={`últimos ${dias} días`} />
        <Tarjeta titulo="Ingresos" valor={pesos(t.ingresos)} detalle="total generado" />
        <Tarjeta titulo="Unidades vendidas" valor={fmt(t.productosVendidos)} />
        <Tarjeta titulo="Promedio por venta" valor={pesos(t.promedioVenta)} />
      </GrillaTarjetas>

      {porDia.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel titulo="Ventas por día" descripcion="Cantidad de ventas">
            <GraficoLineas
              datos={porDia}
              etiqueta="Cantidad de ventas por día"
              series={[{ clave: 'ventas', nombre: 'Ventas', color: COLOR.serie1 }]}
            />
          </Panel>
          <Panel titulo="Ingresos por día" descripcion="En pesos">
            <GraficoBarras
              datos={porDia}
              etiqueta="Ingresos por día"
              formato={pesos}
              anchoEjeY={72}
              tickFormatter={(v) => `${fmt(v / 1000)}k`}
              series={[{ clave: 'ingresos', nombre: 'Ingresos', color: COLOR.serie1 }]}
            />
          </Panel>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {categorias.length > 0 && (
          <Panel titulo="Ventas por categoría">
            <BarraLista items={categorias.slice(0, 8).map((c) => ({ clave: c.name, etiqueta: c.name, valor: c.value }))} />
          </Panel>
        )}

        {topProductos.length > 0 && (
          <Panel titulo="Productos más vendidos" descripcion="Por unidades vendidas">
            <BarraLista
              numerada
              items={topProductos.map((p) => ({
                clave: p.nombre,
                etiqueta: p.nombre,
                valor: p.cantidad,
                extra: `· ${pesos(p.ingresos)}`,
              }))}
            />
          </Panel>
        )}
      </div>
    </div>
  );
}
