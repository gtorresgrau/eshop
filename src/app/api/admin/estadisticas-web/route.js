import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { verificarAdmin } from '../../../../lib/adminAuth';
import { dolarMasCaro } from '../../../../lib/cotizacionDolar';

// Datos de la web (GA4) y de la campaña de Google Ads vía la Analytics Data API.
//   GET ?dias=30&parte=web|ads   (sin `parte` devuelve las dos)
// Requiere:
//   - GA4_PROPERTY_ID: ID numérico de la propiedad GA4 (no el G-XXXX)
//   - GSC_CREDENTIALS_JSON: cuenta de servicio, agregada como "Lector" en la propiedad GA4
//   - API "Google Analytics Data API" habilitada en el proyecto de Google Cloud
//   - Para la parte de Ads: Google Ads vinculado a la propiedad GA4
// GA4 informa los importes en la moneda de la propiedad (USD). Se convierten a
// pesos con el dólar más caro del día; si no hay cotización se devuelven en USD.
export const dynamic = 'force-dynamic';

const num = (v) => Number(v ?? 0);

function crearCliente() {
  const raw = process.env.GSC_CREDENTIALS_JSON;
  if (!raw) throw new Error('GSC_CREDENTIALS_JSON no está definido.');
  const credentials = JSON.parse(raw);
  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  return google.analyticsdata({ version: 'v1beta', auth });
}

// Convierte las filas de GA4 en objetos { dim1, dim2, ..., metrica1, ... }
function filas(res, dims, mets) {
  return (res.data.rows ?? []).map((r) => {
    const o = {};
    dims.forEach((d, i) => { o[d] = r.dimensionValues?.[i]?.value ?? ''; });
    mets.forEach((m, i) => { o[m] = num(r.metricValues?.[i]?.value); });
    return o;
  });
}

function fechaGa(yyyymmdd) {
  return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}`;
}

function agruparPorDia(rows) {
  const porFecha = new Map();
  for (const r of rows) {
    if (!r.campania || r.campania === '(not set)') continue;
    const acc = porFecha.get(r.date) ?? { date: r.date, impresiones: 0, clics: 0, costo: 0 };
    acc.impresiones += r.impresiones;
    acc.clics += r.clics;
    acc.costo += r.costo;
    porFecha.set(r.date, acc);
  }
  return [...porFecha.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((x) => ({ ...x, fecha: fechaGa(x.date) }));
}

// Multiplica por `k` los campos de dinero de un objeto
const convertir = (obj, campos, k) => {
  const o = { ...obj };
  campos.forEach((c) => { o[c] = o[c] * k; });
  return o;
};

async function datosWeb(run, dateRanges, k, moneda) {
  const r = await Promise.allSettled([
    run({
      dateRanges,
      metrics: [
        { name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' },
        { name: 'engagementRate' }, { name: 'averageSessionDuration' },
        { name: 'ecommercePurchases' }, { name: 'purchaseRevenue' },
      ],
    }),
    run({
      dateRanges,
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    run({
      dateRanges,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'ecommercePurchases' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    }),
    run({
      dateRanges,
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    }),
    run({
      dateRanges,
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
    }),
  ]);
  const [rTot, rDia, rCanal, rPag, rDisp] = r;

  // Si falla el reporte principal es un problema de acceso o configuración
  if (rTot.status === 'rejected') throw rTot.reason;

  const t = rTot.value.data.rows?.[0]?.metricValues ?? [];
  return {
    moneda,
    totales: {
      usuarios: num(t[0]?.value),
      sesiones: num(t[1]?.value),
      paginasVistas: num(t[2]?.value),
      engagement: num(t[3]?.value),
      duracionProm: num(t[4]?.value),
      compras: num(t[5]?.value),
      ingresos: num(t[6]?.value) * k,
    },
    porDia: rDia.status === 'fulfilled'
      ? filas(rDia.value, ['date'], ['sesiones', 'usuarios']).map((x) => ({ ...x, fecha: fechaGa(x.date) }))
      : [],
    canales: rCanal.status === 'fulfilled' ? filas(rCanal.value, ['canal'], ['sesiones', 'compras']) : [],
    paginas: rPag.status === 'fulfilled' ? filas(rPag.value, ['pagina'], ['vistas', 'usuarios']) : [],
    dispositivos: rDisp.status === 'fulfilled' ? filas(rDisp.value, ['dispositivo'], ['sesiones']) : [],
  };
}

async function datosAds(run, dateRanges, k, moneda) {
  const [rAds, rAdsDia] = await Promise.allSettled([
    run({
      dateRanges,
      dimensions: [{ name: 'sessionGoogleAdsCampaignName' }],
      metrics: [
        { name: 'advertiserAdImpressions' }, { name: 'advertiserAdClicks' },
        { name: 'advertiserAdCost' }, { name: 'sessions' },
        { name: 'ecommercePurchases' }, { name: 'purchaseRevenue' },
      ],
      orderBys: [{ metric: { metricName: 'advertiserAdClicks' }, desc: true }],
      limit: 10,
    }),
    // Las métricas de Ads exigen una dimensión de campaña; se agrupa por día en código
    run({
      dateRanges,
      dimensions: [{ name: 'date' }, { name: 'sessionGoogleAdsCampaignName' }],
      metrics: [{ name: 'advertiserAdImpressions' }, { name: 'advertiserAdClicks' }, { name: 'advertiserAdCost' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
      limit: 10000,
    }),
  ]);

  // Si falla (p. ej. Ads no vinculado) se informa sin romper el resto
  if (rAds.status === 'rejected') {
    return {
      disponible: false,
      motivo: 'No se pudieron leer datos de Google Ads desde GA4. Verificá que Google Ads esté vinculado a la propiedad GA4.',
    };
  }

  const campanias = filas(
    rAds.value,
    ['campania'],
    ['impresiones', 'clics', 'costo', 'sesiones', 'compras', 'ingresos']
  )
    .filter((c) => c.campania && c.campania !== '(not set)')
    .map((c) => convertir(c, ['costo', 'ingresos'], k));
  const sum = (c) => campanias.reduce((a, x) => a + x[c], 0);

  return {
    disponible: true,
    moneda,
    totales: {
      impresiones: sum('impresiones'),
      clics: sum('clics'),
      costo: sum('costo'),
      sesiones: sum('sesiones'),
      compras: sum('compras'),
      ingresos: sum('ingresos'),
    },
    campanias,
    porDia: rAdsDia.status === 'fulfilled'
      ? agruparPorDia(filas(rAdsDia.value, ['date', 'campania'], ['impresiones', 'clics', 'costo']))
          .map((d) => convertir(d, ['costo'], k))
      : [],
  };
}

export async function GET(request) {
  if (!(await verificarAdmin(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return NextResponse.json(
      { error: 'Falta configurar GA4_PROPERTY_ID en las variables de entorno.' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const dias = Math.min(365, Math.max(7, parseInt(searchParams.get('dias') || '30', 10)));
  const parte = searchParams.get('parte'); // 'web' | 'ads' | null (ambas)
  const dateRanges = [{ startDate: `${dias}daysAgo`, endDate: 'today' }];
  const property = `properties/${propertyId}`;

  try {
    const ga = crearCliente();
    const run = (requestBody) => ga.properties.runReport({ property, requestBody });

    // Moneda de la propiedad: sale del propio reporte de Ads/Web (por defecto USD)
    const meta = await run({ dateRanges, metrics: [{ name: 'activeUsers' }] });
    const monedaGa = meta.data.metadata?.currencyCode ?? 'USD';

    // Conversión a pesos con el dólar más caro (solo si la propiedad está en USD)
    let conversion = null;
    let k = 1;
    let moneda = monedaGa;
    if (monedaGa === 'USD') {
      const dolar = await dolarMasCaro();
      if (dolar) {
        k = dolar.tasa;
        moneda = 'ARS';
        conversion = { de: 'USD', a: 'ARS', tasa: dolar.tasa, cotizacion: dolar.nombre, fecha: dolar.fecha };
      }
    }

    const respuesta = { dias, moneda, conversion };
    if (parte !== 'ads') respuesta.web = await datosWeb(run, dateRanges, k, moneda);
    if (parte !== 'web') respuesta.ads = await datosAds(run, dateRanges, k, moneda);

    return NextResponse.json(respuesta);
  } catch (error) {
    console.error('[api/admin/estadisticas-web]', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas de Google Analytics', detalle: error.message },
      { status: 500 }
    );
  }
}
