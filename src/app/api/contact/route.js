import { NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/mailer';
import { permitir, pareceBot } from '../../../lib/antiBot';

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });

    // Bot: se responde "ok" para no darle pistas, pero no se envía nada
    if (pareceBot({ trampa: body.website || body.botcheck, ms: body.t })) return NextResponse.json({ ok: true });

    // Máximo 5 envíos por hora desde la misma IP
    if (!(await permitir(request, 'contacto', 5, 3600))) {
      return NextResponse.json({ error: 'Enviaste muchos mensajes. Probá de nuevo más tarde.' }, { status: 429 });
    }

    const name = String(body.name ?? '').trim().slice(0, 80);
    const email = String(body.email ?? '').trim().slice(0, 120);
    const message = String(body.message ?? '').trim().slice(0, 2000);
    const newsletter = Boolean(body.Newsletter);
    if (!EMAIL.test(email) || (!newsletter && (!name || !message))) {
      return NextResponse.json({ error: 'Revisá los datos del formulario' }, { status: 400 });
    }

    const subject = newsletter ? 'Agregar Email al NEWSLETTER - eshopdevices' : 'Mensaje enviado desde Website eshopdevices';
    const html = newsletter
      ? `<p>Una persona quiere sumarse al Newsletter desde el sitio web.</p><p>Email: ${esc(email)}</p>`
      : `<p>Mensaje enviado desde el sitio web:</p><p><b>Nombre:</b> ${esc(name)}</p><p><b>Email:</b> ${esc(email)}</p><p><b>Mensaje:</b></p><p>${esc(message).replace(/\n/g, '<br>')}</p>`;

    await sendEmail({ to: process.env.TO, subject, html });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
  }
}
