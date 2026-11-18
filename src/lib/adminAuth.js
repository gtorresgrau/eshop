import { jwtVerify } from 'jose';

/**
 * Verifica que la request venga de un admin (cookie `token` con JWT firmado).
 * Devuelve el payload si es admin, o null si no.
 */
export async function verificarAdmin(request) {
  const token = request.cookies.get('token')?.value;
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.rol === 'admin' ? payload : null;
  } catch {
    return null;
  }
}
