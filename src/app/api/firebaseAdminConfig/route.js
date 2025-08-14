import { NextResponse } from 'next/server';
import admin from '../../../lib/firebaseAdmin';

export async function GET() {
  return NextResponse.json({ ok: true });
}
