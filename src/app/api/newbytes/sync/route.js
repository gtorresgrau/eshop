export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextResponse } from 'next/server';
import { verificarAdmin } from '../../../../lib/adminAuth';
import { sincronizarCatalogoNB } from '../../../../lib/nbSync';

// POST /api/newbytes/sync?dry=1  → calcula sin escribir
// POST /api/newbytes/sync        → importa/actualiza el catálogo. Solo admin.
export async function POST(req) {
  if (!(await verificarAdmin(req))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const dry = new URL(req.url).searchParams.get('dry') === '1';
  try {
    return NextResponse.json({ ok: true, ...(await sincronizarCatalogoNB({ dry })) });
  } catch (e) {
    console.error('[NB sync]', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
