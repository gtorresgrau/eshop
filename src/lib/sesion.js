// Sesión del servidor: lee y verifica la cookie `token` (JWT HS256 emitido por /api/auth/login).
// Usar en TODAS las rutas /api que no sean públicas: el middleware no cubre /api.
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

/** @returns {Promise<{uid: string, rol: string, id?: string} | null>} */
export async function getSesion() {
  const token = (await cookies()).get('token')?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: ['HS256'] });
    const rol = payload.rol ?? payload.role;
    if (!payload.uid) return null;
    return { uid: String(payload.uid), rol: String(rol || ''), id: payload.id ? String(payload.id) : undefined };
  } catch {
    return null;
  }
}

const json = (error, status) => NextResponse.json({ error }, { status });

/** Devuelve una respuesta 401/403 si no es admin; null si puede seguir. Uso: `const d = await guardAdmin(); if (d) return d;` */
export async function guardAdmin() {
  const s = await getSesion();
  if (!s) return json('No autorizado', 401);
  if (s.rol !== 'admin') return json('Acceso denegado', 403);
  return null;
}

/** Devuelve { sesion } si hay sesión (cualquier rol) o { denied } con la respuesta 401. */
export async function requireSesion() {
  const sesion = await getSesion();
  return sesion ? { sesion } : { denied: json('No autorizado', 401) };
}

export const esAdmin = (sesion) => sesion?.rol === 'admin';
