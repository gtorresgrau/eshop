export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cotizarEnvioCarrito } from '../../../../lib/nbEnvio';

// POST { items: [{ cod_producto, quantity }], codigoPostal }
// Público (lo usa el checkout). No confía en precios del cliente.
export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }); }
  const r = await cotizarEnvioCarrito({ items: body?.items, codigoPostal: body?.codigoPostal });
  if (r.error) return NextResponse.json({ error: r.error }, { status: r.status || 500 });
  return NextResponse.json(r);
}
