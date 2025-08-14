//src/app/api/logout/route.ts

import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ok: true, message: 'Sesión cerrada' });
  response.cookies.delete('token'); // Eliminar la cookie 'token'
  response.cookies.delete('refreshToken'); // Eliminar la cookie 'refreshToken'
  // Eliminar la cookie asegurándote que los valores coincidan con la creación
  response.cookies.set('token', '', {
    path: '/',                   // Debe coincidir con la cookie original
    expires: new Date(0),        // Fuerza la expiración
    httpOnly: true,              // Debe coincidir también si la cookie original era httpOnly
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  }); 

  return response;
}
