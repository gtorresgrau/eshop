// Defensas contra bots, sin servicios externos:
//  1) trampa (honeypot): un campo oculto que una persona nunca completa y un bot sí;
//  2) tiempo mínimo: un formulario enviado en menos de 3 s lo mandó un programa;
//  3) límite por IP: máximo N intentos por ventana, contado en Mongo (sirve entre instancias serverless).
import { connectDB } from './mongodb';
import LimiteTasa from '../models/LimiteTasa';

/** IP del visitante (Vercel la pone en x-forwarded-for; la primera es la del cliente). */
export function ipDe(req) {
  const xff = req.headers.get('x-forwarded-for') || '';
  return (xff.split(',')[0] || req.headers.get('x-real-ip') || 'desconocida').trim().slice(0, 64);
}

/**
 * Cuenta un intento y dice si se permite. Falla abierto: si la base no responde no se bloquea a nadie.
 * @returns {Promise<boolean>} true = puede seguir; false = superó el límite
 */
export async function permitir(req, accion, max, ventanaSeg) {
  try {
    await connectDB();
    const ventana = Math.floor(Date.now() / (ventanaSeg * 1000));
    const doc = await LimiteTasa.findOneAndUpdate(
      { clave: `${accion}:${ipDe(req)}:${ventana}` },
      { $inc: { n: 1 }, $setOnInsert: { expira: new Date((ventana + 1) * ventanaSeg * 1000 + 60000) } },
      { upsert: true, new: true }
    );
    return doc.n <= max;
  } catch (e) {
    console.error('[antiBot] límite no disponible:', e?.message);
    return true;
  }
}

/** true si el envío parece de un bot: campo trampa lleno o enviado demasiado rápido. */
export function pareceBot({ trampa, ms }, minMs = 3000) {
  if (trampa) return true;
  const t = Number(ms);
  return !Number.isFinite(t) || t < minMs;
}
