import { NextResponse } from 'next/server';
import { auth } from '../../../lib/firebaseClient';

export async function GET() {
  return NextResponse.json({ ok: true });
}
