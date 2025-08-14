// WARNING: AFIP integration disabled for safe deploy
// The active implementation is commented below. To enable, remove this handler and uncomment the implementation.

import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({ ok: false, message: 'AFIP integration is disabled. Set AFIP_INTEGRATION_ENABLED=true and configure certificates to enable.' }, { status: 501 });
}

/*
Full implementation (commented out to avoid execution in production). Re-enable only when ready and after setting environment variables.

... (kept in pages/api/arca/generate.js) ...
*/
