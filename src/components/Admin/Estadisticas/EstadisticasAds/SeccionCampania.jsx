'use client';
import React from 'react';
import { COLOR, fmt, pct, importe, Tarjeta, GrillaTarjetas, Panel, Aviso, NotaConversion } from '../comun/ui';
import { GraficoBarras } from '../comun/graficos';

function MiniGrafico({ titulo, datos, clave, formato, etiqueta, anchoEjeY }) {
  return (
    <Panel titulo={titulo}>
      <GraficoBarras
        datos={datos}
        alto="h-44"
        formato={formato}
        anchoEjeY={anchoEjeY}
        etiqueta={`${titulo} por día`}
        series={[{ clave, nombre: etiqueta, color: COLOR.serie1 }]}
      />
    </Panel>
  );
}

export default function SeccionCampania({ ads, conversion }) {
  if (!ads.disponible) {
    return (
      <Aviso tipo="aviso" titulo="No hay datos de la campaña">
        {ads.motivo}
      </Aviso>
    );
  }

  const t = ads.totales;
  const moneda = ads.moneda;
  const formatoCosto = (n) => importe(n, moneda);

  if (t.impresiones === 0 && t.clics === 0) {
    return (
      <Aviso titulo="Sin actividad en este período">
        La campaña no registró impresiones ni clics. Probá con un período más largo.
      </Aviso>
    );
  }

  return (
    <div className="space-y-4">
      <GrillaTarjetas>
        <Tarjeta titulo="Impresiones" valor={fmt(t.impresiones)} />
        <Tarjeta
          titulo="Clics"
          valor={fmt(t.clics)}
          detalle={t.impresiones > 0 ? `CTR ${pct(t.clics / t.impresiones)}` : null}
        />
        <Tarjeta titulo="Costo" valor={formatoCosto(t.costo)} detalle={moneda === "ARS" ? "en pesos" : `en ${moneda}`} />
        <Tarjeta titulo="CPC promedio" valor={t.clics > 0 ? formatoCosto(t.costo / t.clics) : '—'} />
        <Tarjeta titulo="Compras" valor={fmt(t.compras)} detalle={t.clics > 0 ? `${fmt(t.sesiones)} sesiones` : null} />
        <Tarjeta
          titulo="Ingresos"
          valor={formatoCosto(t.ingresos)}
          detalle={t.costo > 0 && t.ingresos > 0 ? `ROAS ${(t.ingresos / t.costo).toFixed(1).replace('.', ',')}x` : null}
        />
      </GrillaTarjetas>

      {ads.porDia.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          <MiniGrafico titulo="Impresiones" datos={ads.porDia} clave="impresiones" etiqueta="Impresiones" formato={fmt} />
          <MiniGrafico titulo="Clics" datos={ads.porDia} clave="clics" etiqueta="Clics" formato={fmt} />
          <MiniGrafico titulo={moneda === 'ARS' ? 'Costo (pesos)' : `Costo (${moneda})`} datos={ads.porDia} clave="costo" etiqueta="Costo" formato={formatoCosto} anchoEjeY={64} />
        </div>
      )}

      {ads.campanias.length > 0 && (
        <Panel titulo="Por campaña">
          {/* Celular: una tarjeta por campaña */}
          <ul className="space-y-3 md:hidden">
            {ads.campanias.map((c) => (
              <li key={c.campania} className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">{c.campania}</p>
                <dl className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  {[
                    ['Impr.', fmt(c.impresiones)],
                    ['Clics', fmt(c.clics)],
                    ['Costo', formatoCosto(c.costo)],
                    ['Sesiones', fmt(c.sesiones)],
                    ['Compras', fmt(c.compras)],
                    ['CPC', c.clics > 0 ? formatoCosto(c.costo / c.clics) : '—'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="font-medium tabular-nums text-gray-900">{v}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>

          {/* Tablet y escritorio: tabla */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-xs text-gray-500">
                <tr>
                  <th scope="col" className="py-2 pr-4 font-medium">Campaña</th>
                  {['Impr.', 'Clics', 'Costo', 'CPC', 'Sesiones', 'Compras'].map((h) => (
                    <th key={h} scope="col" className="py-2 pl-4 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {ads.campanias.map((c) => (
                  <tr key={c.campania} className="border-b border-gray-100 last:border-0">
                    <th scope="row" className="py-3 pr-4 font-medium text-gray-900">{c.campania}</th>
                    <td className="py-3 pl-4 text-right">{fmt(c.impresiones)}</td>
                    <td className="py-3 pl-4 text-right">{fmt(c.clics)}</td>
                    <td className="py-3 pl-4 text-right">{formatoCosto(c.costo)}</td>
                    <td className="py-3 pl-4 text-right">{c.clics > 0 ? formatoCosto(c.costo / c.clics) : '—'}</td>
                    <td className="py-3 pl-4 text-right">{fmt(c.sesiones)}</td>
                    <td className="py-3 pl-4 text-right">{fmt(c.compras)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <div className="space-y-1">
        <NotaConversion conversion={conversion} moneda={moneda} />
        <p className="text-xs text-gray-400">
          Datos de Google Ads leídos desde Google Analytics. Los informes no se actualizan en tiempo real.
        </p>
      </div>
    </div>
  );
}
