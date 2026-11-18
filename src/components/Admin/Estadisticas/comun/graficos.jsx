'use client';
import React from 'react';
import {
  BarChart, Bar, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { COLOR, ejeProps, fmt, GraficoTooltip } from './ui';

// series: [{ clave, nombre, color? }]. Con 2 o más series se muestra leyenda.
// apilado: apila las barras (2px de separación entre segmentos).
export function GraficoBarras({ datos, ejeX = 'fecha', series, apilado = false, formato = fmt, alto = 'h-52 md:h-60', etiqueta, anchoEjeY = 40, tickFormatter, resaltarMaximo = false }) {
  const multiple = series.length > 1;
  const maximo = resaltarMaximo ? Math.max(...datos.map((d) => d[series[0].clave] ?? 0)) : null;
  return (
    <div className={alto} role="img" aria-label={etiqueta}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={COLOR.grilla} />
          <XAxis dataKey={ejeX} {...ejeProps} axisLine={{ stroke: COLOR.eje }} interval="preserveStartEnd" minTickGap={24} />
          <YAxis {...ejeProps} axisLine={false} width={anchoEjeY} allowDecimals={false} tickFormatter={tickFormatter ?? formato} />
          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} content={<GraficoTooltip formato={formato} />} />
          {multiple && <Legend verticalAlign="top" align="left" iconType="rect" wrapperStyle={{ fontSize: 12, paddingBottom: 8 }} />}
          {series.map((s, i) => (
            <Bar
              key={s.clave}
              dataKey={s.clave}
              name={s.nombre}
              fill={s.color ?? [COLOR.serie1, COLOR.serie2, COLOR.serie3][i % 3]}
              stackId={apilado ? 'a' : undefined}
              stroke={apilado ? '#fff' : undefined}
              strokeWidth={apilado ? 2 : 0}
              radius={!apilado || i === series.length - 1 ? [4, 4, 0, 0] : 0}
              maxBarSize={28}
            >
              {resaltarMaximo && datos.map((d, k) => (
                <Cell key={k} fill={maximo > 0 && d[s.clave] === maximo ? COLOR.serie2 : (s.color ?? COLOR.serie1)} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoLineas({ datos, ejeX = 'fecha', series, formato = fmt, alto = 'h-52 md:h-60', etiqueta, anchoEjeY = 40, tickFormatter }) {
  const multiple = series.length > 1;
  return (
    <div className={alto} role="img" aria-label={etiqueta}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={datos} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={COLOR.grilla} />
          <XAxis dataKey={ejeX} {...ejeProps} axisLine={{ stroke: COLOR.eje }} interval="preserveStartEnd" minTickGap={28} />
          <YAxis {...ejeProps} axisLine={false} width={anchoEjeY} allowDecimals={false} tickFormatter={tickFormatter ?? formato} />
          <Tooltip content={<GraficoTooltip formato={formato} />} />
          {multiple && <Legend verticalAlign="top" align="left" iconType="plainline" wrapperStyle={{ fontSize: 12, paddingBottom: 8 }} />}
          {series.map((s, i) => (
            <Line
              key={s.clave}
              type="monotone"
              dataKey={s.clave}
              name={s.nombre}
              stroke={s.color ?? [COLOR.serie1, COLOR.serie2, COLOR.serie3][i % 3]}
              strokeWidth={2}
              dot={datos.length <= 2}
              activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
