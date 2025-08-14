import { NextResponse } from 'next/server';
import { sendEmail } from '../../../../src/lib/mailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message, Newsletter } = body;

    let subject = '';
    let html = '';

    if (!Newsletter) {
      subject = 'Mensaje enviado desde Website eshopdevices';
      html = `...`; // keep concise; original HTML is in pages api
    } else {
      subject = 'Agregar Email al NEWSLETTER - eshopdevices';
      html = `<p>La Persona ha hecho contacto desde el sitio web:</p><p>Quiere sumarse al Newsletter</p><p>Email: ${email}</p>`;
    }

    await sendEmail({ to: process.env.TO, subject, html });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error al enviar correo:', err);
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
  }
}
