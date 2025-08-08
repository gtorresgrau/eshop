// src/app/api/me/route.ts
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as any;

    return NextResponse.json({
      authenticated: true,
      user: {
        uid: decoded.uid,
        rol: decoded.rol,
        id: decoded.id,
      },
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
