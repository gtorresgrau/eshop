export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verificarAdmin } from '../../../../lib/adminAuth';
import { getCatalog, NBError } from '../../../../lib/newbytes';

// Prueba de conexión con New Bytes. Solo admin. No crea carritos ni pedidos.
export async function GET(req) {
  if (!(await verificarAdmin(req))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const data = await getCatalog();
    return NextResponse.json({
      ok: true,
      base: process.env.NB_API_URL || 'https://api-nb-dev.blu.net.ar/v1',
      muestra: JSON.stringify(data).slice(0, 1000),
    });
  } catch (e) {
    const status = e instanceof NBError ? e.status || 502 : 500;
    return NextResponse.json({ ok: false, error: e.message, detalle: e.body ?? null }, { status });
  }
}
