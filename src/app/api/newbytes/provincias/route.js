export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getProvinces } from '../../../../lib/newbytes';

// Provincias de Argentina según New Bytes ({ id, description }). Se cachea 24 hs en memoria.
let cache = { at: 0, data: null };

export async function GET() {
  try {
    if (!cache.data || Date.now() - cache.at > 24 * 3600 * 1000) {
      const list = await getProvinces();
      cache = {
        at: Date.now(),
        data: (Array.isArray(list) ? list : [])
          .filter((p) => p.countryId === 7)
          .map((p) => ({ id: p.id, nombre: String(p.description).replace(/\s*\(.*\)\s*$/, '').trim() })),
      };
    }
    return NextResponse.json({ provincias: cache.data });
  } catch (e) {
    return NextResponse.json({ error: 'No se pudieron cargar las provincias' }, { status: 502 });
  }
}
