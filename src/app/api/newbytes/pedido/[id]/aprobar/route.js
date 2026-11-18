export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { NextResponse } from 'next/server';
import { verificarAdmin } from '../../../../../../lib/adminAuth';
import { aprobarPedidoNB } from '../../../../../../lib/nbPedido';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// POST /api/newbytes/pedido/<id>/aprobar — solo admin. Crea la compra real en New Bytes.
export async function POST(req, { params }) {
  if (!(await verificarAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const { id } = await params;
  if (!objectIdRegex.test(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  const r = await aprobarPedidoNB(id);
  return NextResponse.json(r, { status: r.ok ? 200 : r.status || 500 });
}
