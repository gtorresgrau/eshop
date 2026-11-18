// src/app/api/arca/generate/route.js
// Emite una Factura C (ARCA/WSFE) a partir de un comprobante (presupuesto) guardado.
// Solo administradores. El total se calcula en el servidor desde el comprobante guardado.

import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Comprobante from '../../../../models/Comprobante';
import { ArcaError, emitirFacturaC, getConfig } from '../../../../lib/arca';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const token = (await cookies()).get('token')?.value;
  if (!token) return false;
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return (decoded.role ?? decoded.rol) === 'admin';
  } catch {
    return false;
  }
}

const redondear = (n) => Math.round(Number(n) * 100) / 100;

function totalComprobante(c) {
  return redondear(
    c.items.reduce((acc, it) => {
      const precio = it.usd ? Number(it.precio) * Number(it.dolar || 1) : Number(it.precio);
      return acc + Number(it.cantidad) * precio;
    }, 0)
  );
}

// Datos de configuración para mostrar en el modal (ambiente, punto de venta)
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const cfg = getConfig();
    return NextResponse.json({ ambiente: cfg.env, ptoVta: cfg.ptoVta, cuit: cfg.cuit });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const { comprobanteId, receptor, concepto = 3, totalEsperado, ambienteConfirmado } = body || {};
  if (!comprobanteId || !receptor) {
    return NextResponse.json({ error: 'Faltan comprobanteId o receptor' }, { status: 400 });
  }

  const docTipo = Number(receptor.docTipo);
  const docNro = String(receptor.docNro || '').replace(/\D/g, '');
  const condicionIva = Number(receptor.condicionIva);
  if (![80, 96, 99].includes(docTipo)) {
    return NextResponse.json({ error: 'Tipo de documento inválido' }, { status: 400 });
  }
  if (docTipo === 80 && docNro.length !== 11) {
    return NextResponse.json({ error: 'El CUIT debe tener 11 dígitos' }, { status: 400 });
  }
  if (docTipo === 96 && !(docNro.length >= 7 && docNro.length <= 8)) {
    return NextResponse.json({ error: 'El DNI debe tener 7 u 8 dígitos' }, { status: 400 });
  }
  if (!Number.isInteger(condicionIva) || condicionIva <= 0) {
    return NextResponse.json({ error: 'Falta la condición frente al IVA del receptor' }, { status: 400 });
  }
  if (![1, 2, 3].includes(Number(concepto))) {
    return NextResponse.json({ error: 'Concepto inválido' }, { status: 400 });
  }

  let cfg;
  try {
    cfg = getConfig();
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  // Evita emitir en producción si el usuario creía estar en homologación (o al revés)
  if (ambienteConfirmado !== cfg.env) {
    return NextResponse.json(
      { error: `El servidor está en ambiente "${cfg.env}" y la pantalla indicaba "${ambienteConfirmado}". Recargá e intentá de nuevo.` },
      { status: 409 }
    );
  }

  await connectDB();
  const comprobante = await Comprobante.findById(comprobanteId);
  if (!comprobante) return NextResponse.json({ error: 'Comprobante no encontrado' }, { status: 404 });
  if (comprobante.tipo !== 'presupuesto') {
    return NextResponse.json({ error: 'Solo se pueden facturar presupuestos' }, { status: 400 });
  }

  const total = totalComprobante(comprobante);
  if (totalEsperado !== undefined && redondear(totalEsperado) !== total) {
    return NextResponse.json(
      { error: `El total cambió (${total}). Recargá el historial y revisá antes de emitir.` },
      { status: 409 }
    );
  }

  // Reserva atómica: impide emitir dos veces el mismo comprobante (doble clic, dos pestañas)
  const reservado = await Comprobante.findOneAndUpdate(
    { _id: comprobanteId, 'factura.estado': { $nin: ['procesando', 'emitida', 'incierto'] } },
    { $set: { 'factura.estado': 'procesando' } },
    { new: true }
  );
  if (!reservado) {
    return NextResponse.json(
      { error: 'Este comprobante ya fue facturado o tiene una emisión en curso / pendiente de verificar.' },
      { status: 409 }
    );
  }

  try {
    const r = await emitirFacturaC({
      total,
      docTipo,
      docNro: docTipo === 99 ? 0 : docNro,
      condicionIvaReceptor: condicionIva,
      concepto: Number(concepto),
    });

    const factura = {
      estado: 'emitida',
      cbteTipo: r.cbteTipo,
      ptoVta: r.ptoVta,
      nroCbte: r.nroCbte,
      fecha: r.fecha,
      cae: r.cae,
      caeVto: r.caeVto,
      ambiente: r.ambiente,
      total,
      receptor: {
        docTipo,
        docNro: docTipo === 99 ? '0' : docNro,
        razonSocial: String(receptor.razonSocial || comprobante.empresa.nombre || '').slice(0, 200),
        condicionIva,
      },
      emitidaEn: new Date(),
    };
    await Comprobante.updateOne({ _id: comprobanteId }, { $set: { factura } });

    return NextResponse.json({ ok: true, factura, observaciones: r.observaciones });
  } catch (e) {
    const arca = e instanceof ArcaError ? e : new ArcaError(e.message);
    if (arca.incierto) {
      await Comprobante.updateOne(
        { _id: comprobanteId },
        { $set: { 'factura.estado': 'incierto', 'factura.error': arca.message } }
      );
      return NextResponse.json({ ok: false, incierto: true, error: arca.message }, { status: 502 });
    }
    // Rechazo claro de ARCA o error previo al envío: se libera para reintentar
    await Comprobante.updateOne({ _id: comprobanteId }, { $unset: { factura: '' } });
    console.error('Error al emitir factura ARCA:', arca.message);
    return NextResponse.json({ ok: false, error: arca.message, detalle: arca.detalle }, { status: 422 });
  }
}
