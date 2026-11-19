'use client';
import React from 'react';
import { COLOR, fmt, pct, seg, importe, Tarjeta, GrillaTarjetas, Panel, BarraLista, NotaConversion } from '../comun/ui';
import { GraficoLineas } from '../comun/graficos';

export default function SeccionWeb({ web, conversion }) {
  const t = web.totales;

  return (
    <div className="space-y-4">
      <GrillaTarjetas>
        <Tarjeta titulo="Usuarios" valor={fmt(t.usuarios)} />
        <Tarjeta titulo="Sesiones" valor={fmt(t.sesiones)} detalle={`${fmt(t.sesionesConInteraccion)} con interacción`} />
        <Tarjeta titulo="Páginas vistas" valor={fmt(t.paginasVistas)} />
        <Tarjeta titulo="Interacción" valor={pct(t.engagement)} detalle={`Duración ${seg(t.duracionProm)}`} />
        <Tarjeta titulo="Compras" valor={fmt(t.compras)} />
        <Tarjeta titulo="Ingresos" valor={importe(t.ingresos, web.moneda)} detalle={web.moneda === 'ARS' ? 'en pesos' : `en ${web.moneda}`} />
      </GrillaTarjetas>

      <Panel titulo="Visitas por día">
        {web.porDia.length === 0 ? (
          <p className="text-sm text-gray-500">Sin datos en el período.</p>
        ) : (
          <GraficoLineas
            datos={web.porDia}
            alto="h-56 md:h-64"
            etiqueta="Sesiones y usuarios por día"
            series={[
              { clave: 'sesiones', nombre: 'Sesiones', color: COLOR.serie1 },
              { clave: 'usuarios', nombre: 'Usuarios', color: COLOR.serie2 },
            ]}
          />
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel titulo="De dónde llegan" descripcion="Sesiones por canal">
          <BarraLista
            items={web.canales.map((c) => ({
              clave: c.canal,
              etiqueta: c.canal,
              valor: c.sesiones,
              extra: c.compras > 0 ? `· ${fmt(c.compras)} compras` : null,
            }))}
          />
        </Panel>
        <Panel titulo="Páginas más vistas" descripcion="Vistas por página">
          <BarraLista
            items={web.paginas.map((p) => ({ clave: p.pagina, etiqueta: p.pagina, valor: p.vistas }))}
          />
        </Panel>
      </div>

      <Panel
        titulo="Usuarios por país"
        descripcion="Siempre sin filtro. Los que no tienen sesiones con interacción abrieron una página y se fueron: casi siempre son bots"
      >
        <BarraLista
          items={(web.paises || []).map((p) => ({
            clave: p.pais,
            etiqueta: p.pais || '(sin definir)',
            valor: p.usuarios,
            extra: `· ${fmt(p.sesionesConInteraccion)} con interacción`,
          }))}
        />
      </Panel>

      <Panel titulo="Dispositivos" descripcion="Sesiones por tipo de dispositivo">
        <BarraLista
          items={web.dispositivos.map((d) => ({ clave: d.dispositivo, etiqueta: d.dispositivo, valor: d.sesiones }))}
        />
      </Panel>

      <NotaConversion conversion={conversion} moneda={web.moneda} />
    </div>
  );
}
