import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../lib/mailer'; // ajustá el path según la ubicación real
import { getSesion } from '../../../lib/sesion';
import { connectDB } from '../../../lib/mongodb';
import Usuario from '../../../models/User';

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export async function POST(req: NextRequest) {
  // Antes era un relé de emails abierto: cualquiera podía mandar mails con tu marca a cualquier dirección.
  const sesion = await getSesion();
  if (!sesion) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    let clienteEmail = body.clienteEmail;
    let adminEmail = body.adminEmail;
    const tracking = body.tracking ?? '';
    const estadoPedido = esc(body.estadoPedido);
    const clienteNombre = esc(body.clienteNombre);
    const numeroPedido = esc(body.numeroPedido);
    const montoTotal = esc(body.montoTotal);

    if (sesion.rol !== 'admin') {
      // Un cliente solo puede disparar el aviso a SU correo y al admin configurado en el servidor
      await connectDB();
      const yo: any = await (Usuario as any).findOne({ uid: sesion.uid }).select('correo').lean();
      if (!yo?.correo) return NextResponse.json({ ok: false, error: 'Usuario sin correo' }, { status: 400 });
      clienteEmail = yo.correo;
      adminEmail = process.env.TO || undefined;
    }
    // console.log('clienteEmail:',clienteEmail)
    // console.log('clienteNombre:',clienteNombre)
    // console.log('estadoPedido:', estadoPedido)
    // console.log('adminEmail:',adminEmail)
    // console.log('numeroPedido:',numeroPedido)
    // console.log('montoTotal:',montoTotal)

    // Enviar email al cliente
    await sendEmail({
      to: clienteEmail,
      subject: `Tu pedido #${numeroPedido} ahora está: ${estadoPedido}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #F5F8FA; padding: 24px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="background-color: #F3781B; padding: 16px; text-align: center;">
              <img src="https://eshopdevices.com/logos/logo.webp" alt="Logo" style="height: 60px; margin: 0 auto;" />
            </div>
            <div style="padding: 32px;">
              <h2 style="font-size: 20px; margin-bottom: 16px; color: #F3781B;">Hola ${clienteNombre},</h2>
              <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
                Te informamos que el estado de tu pedido <strong>#${numeroPedido}</strong> ${estadoPedido === 'pendiente' ? 'está consolidado como' : 'ha sido actualizado a'} 
                <span style="font-weight: bold; color: #1a2f98;">${estadoPedido}</span>.
              </p>
              <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                Se actualizara a PAGADO cuando corroboremos el ingreso del pago.
              </p>
              <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                Gracias por confiar en nosotros. Si tenés alguna consulta, no dudes en responder a este correo.
              </p>
              <a href="https://eshopdevices.com/Dashboard" style="display: inline-block; background-color: #F3781B; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">
                Ver mi pedido
              </a>
            </div>
            <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
              © ${new Date().getFullYear()} ESHOP. Todos los derechos reservados.
            </div>
          </div>
        </div>
      `


    });

    // Enviar email al administrador si el estado es "pagado"
    if (adminEmail && (estadoPedido.toLowerCase() === 'pagado' || tracking !== "")) {
      await sendEmail({
        to: adminEmail,
        subject: `🔔 Pedido #${numeroPedido} pagado`,
        html: `
        <div style="font-family: 'Segoe UI', sans-serif; background-color: #F5F8FA; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
        <h3>Notificación de Pago</h3>
                <div style="background-color: #F3781B; padding: 16px; text-align: center;">
                    <img src="https://eshopdevices.com/logos/logo.webp" alt="Logo" style="height: 60px; margin: 0 auto;" />
                </div>
                <div style="padding: 32px;">
                    <h2 style="font-size: 20px; margin-bottom: 16px; color: #F3781B;">Hola ESHOP</h2>
                    <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
                    Te informamos que el estado del pedido <strong>#${numeroPedido}</strong> ha sido actualizado a: 
                    <span style="font-weight: bold; color: #1a2f98;">${estadoPedido}</span>.
                    </p>
                    <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
                    Por un monto Total: <span style="font-weight: bold; color: #1a2f98;">${montoTotal}</span>.
                    </p>
                    <a href="https://eshopdevices.com/Admin" style="display: inline-block; background-color: #F3781B; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 16px;">
                    Ver Panel de ADM
                    </a>
                </div>
                <div style="background-color: #F3781B; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
                    © ${new Date().getFullYear()} ESHOP. Todos los derechos reservados.
                </div>
            </div>
        </div>
        `,
      });
    }

    return NextResponse.json({ ok: true, message: 'Correos enviados' });
  } catch (error) {
    console.error('Error al enviar correos:', error);
    return NextResponse.json({ ok: false, error: 'Fallo el envío' }, { status: 500 });
  }
}
