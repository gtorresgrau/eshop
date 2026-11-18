export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cotizarEnvioCarrito } from '../../../../lib/nbEnvio';

// Límite simple por IP (por instancia): evita usar este endpoint para martillar la API de NB.
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 20;
const hits = new Map();

function limitado(ip) {
  const ahora = Date.now();
  const lista = (hits.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
  lista.push(ahora);
  hits.set(ip, lista);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => ahora - t < VENTANA_MS)) hits.delete(k);
  return lista.length > MAX_POR_VENTANA;
}

// POST { items: [{ cod_producto, quantity }], codigoPostal }
// Público (lo usa el checkout). No confía en precios del cliente.
export async function POST(req) {
  const ip = (req.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (limitado(ip)) return NextResponse.json({ error: 'Demasiadas consultas, probá en un minuto.' }, { status: 429 });

  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }); }
  const r = await cotizarEnvioCarrito({ items: body?.items, codigoPostal: body?.codigoPostal });
  if (r.error) return NextResponse.json({ error: r.error }, { status: r.status || 500 });
  return NextResponse.json(r);
}
