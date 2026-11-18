'use client';
import React from 'react';
import { COLOR, fmt, pesos, Tarjeta, GrillaTarjetas, Panel, BarraLista, Aviso, Cargable } from '../comun/ui';
import { GraficoBarras, GraficoLineas } from '../comun/graficos';
import { useEstadistica } from '../comun/useEstadistica';

const ESTADO_TEXTO = {
  pendiente: 'Pendiente',
  pagado: 'Pagado',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export default function EstadisticasNegocio({ dias = '30' }) {
  const { data, loading, error, reintentar } = useEstadistica(`/api/admin/estadisticas-negocio?dias=${dias}`);

  return (
    <Cargable loading={loading} error={error} onRetry={reintentar}>
      {data && <Contenido data={data} dias={dias} />}
    </Cargable>
  );
}

function Contenido({ data, dias }) {
  const { totales, distribucionEstados, metodosPago, topProductos, porDia, porDiaSemana, rangoTickets, nuevosCompradores } = data;

  if (totales.totalPedidos === 0) {
    return (
      <Aviso titulo="No hay pedidos en este período">
        Probá con un período más largo para ver el detalle.
      </Aviso>
    );
  }

  const perdidaEstimada = totales.ticketProm * totales.cancelados;
  const compradores = nuevosCompradores.reduce((s, x) => s + x.nuevos, 0);
  const principal = metodosPago[0];

  return (
    <div className="space-y-4">
      <GrillaTarjetas columnas="xl:grid-cols-4">
        <Tarjeta titulo="Ingresos" valor={pesos(totales.ingresos)} detalle="pedidos cobrados" />
        <Tarjeta titulo="Pedidos cobrados" valor={fmt(totales.pedidos)} detalle={`de ${fmt(totales.totalPedidos)} en ${dias} días`} />
        <Tarjeta titulo="Unidades vendidas" valor={fmt(totales.unidades)} />
        <Tarjeta titulo="Ticket promedio" valor={pesos(totales.ticketProm)} detalle="por pedido cobrado" />
        <Tarjeta titulo="Tasa de conversión" valor={`${totales.tasaConversion}%`} detalle="cobrados sobre no cancelados" />
        <Tarjeta titulo="Pedidos cancelados" valor={fmt(totales.cancelados)} detalle={totales.cancelados > 0 ? `~${pesos(perdidaEstimada)} estimados` : null} />
        <Tarjeta titulo="Compradores nuevos" valor={fmt(compradores)} detalle="primera compra en el período" />
        <Tarjeta titulo="Medio de pago principal" valor={principal?.metodo ?? '—'} detalle={principal ? `${fmt(principal.cantidad)} pedidos` : null} />
      </GrillaTarjetas>

      {porDia.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel titulo="Ingresos por día" descripcion="Pedidos cobrados, en pesos">
            <GraficoBarras
              datos={porDia}
              etiqueta="Ingresos por día"
              formato={pesos}
              anchoEjeY={72}
              tickFormatter={(v) => `${fmt(v / 1000)}k`}
              series={[{ clave: 'ingresos', nombre: 'Ingresos', color: COLOR.serie1 }]}
            />
          </Panel>
          <Panel titulo="Pedidos por día" descripcion="Pedidos cobrados">
            <GraficoBarras
              datos={porDia}
              etiqueta="Pedidos cobrados por día"
              series={[{ clave: 'pedidos', nombre: 'Pedidos', color: COLOR.serie1 }]}
            />
          </Panel>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel titulo="Estado de los pedidos">
          <BarraLista
            items={distribucionEstados.map((e) => ({
              clave: e.estado,
              etiqueta: ESTADO_TEXTO[e.estado] ?? e.estado,
              valor: e.total,
            }))}
          />
        </Panel>
        <Panel titulo="Medios de pago" descripcion="Pedidos e ingresos">
          <BarraLista
            items={metodosPago.map((m) => ({
              clave: m.metodo,
              etiqueta: m.metodo,
              valor: m.cantidad,
              extra: `· ${pesos(m.ingresos)}`,
            }))}
          />
        </Panel>
      </div>

      {topProductos.length > 0 && (
        <Panel titulo="Productos más vendidos" descripcion="Por unidades vendidas en pedidos cobrados">
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel titulo="Pedidos por día de la semana" descripcion="El día de más pedidos va en naranja">
          <GraficoBarras
            datos={porDiaSemana}
            ejeX="dia"
            resaltarMaximo
            etiqueta="Pedidos por día de la semana"
            series={[{ clave: 'pedidos', nombre: 'Pedidos', color: COLOR.serie1 }]}
          />
        </Panel>
        <Panel titulo="Pedidos según el monto" descripcion="Cantidad de pedidos por rango de total">
          <GraficoBarras
            datos={rangoTickets}
            ejeX="label"
            etiqueta="Pedidos por rango de monto"
            series={[{ clave: 'cantidad', nombre: 'Pedidos', color: COLOR.serie1 }]}
          />
        </Panel>
      </div>

      {nuevosCompradores.length > 0 && (
        <Panel titulo="Compradores nuevos por semana">
          <GraficoLineas
            datos={nuevosCompradores}
            ejeX="semana"
            etiqueta="Compradores nuevos por semana"
            series={[{ clave: 'nuevos', nombre: 'Compradores nuevos', color: COLOR.serie1 }]}
          />
        </Panel>
      )}
    </div>
  );
}
