import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'Sesión cerrada' });
  response.cookies.delete('token');
  response.cookies.delete('refreshToken');
  response.cookies.set('token', '', {
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
  return response;
}
