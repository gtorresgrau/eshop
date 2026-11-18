export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { verificarAdmin } from '../../../../lib/adminAuth';
import { connectDB } from '../../../../lib/mongodb';
import Producto from '../../../../models/product';

// Oculta (hide: true) los productos que NO son de New Bytes. Reversible. Solo admin.
//   POST ?dry=1       → cuenta, no escribe
//   POST              → oculta los propios visibles y los marca con ocultoPorMigracion
//   POST ?revertir=1  → vuelve a mostrar SOLO los que ocultó esta operación
// Se niega a ocultar si no hay productos de NB visibles (la tienda quedaría vacía).
export async function POST(req) {
  if (!(await verificarAdmin(req))) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  const q = new URL(req.url).searchParams;
  const dry = q.get('dry') === '1';

  await connectDB();

  if (q.get('revertir') === '1') {
    if (dry) return NextResponse.json({ ok: true, dry: true, aRestaurar: await Producto.countDocuments({ ocultoPorMigracion: true }) });
    const r = await Producto.updateMany({ ocultoPorMigracion: true }, { $set: { hide: false }, $unset: { ocultoPorMigracion: '' } });
    return NextResponse.json({ ok: true, restaurados: r.modifiedCount });
  }

  const nbVisibles = await Producto.countDocuments({ origen: 'nb', hide: { $ne: true } });
  const filtro = { origen: { $ne: 'nb' }, hide: { $ne: true } };
  const propiosVisibles = await Producto.countDocuments(filtro);

  if (dry) return NextResponse.json({ ok: true, dry: true, nbVisibles, propiosVisibles });
  if (nbVisibles === 0) {
    return NextResponse.json({ ok: false, error: 'No hay productos de NB visibles: importá el catálogo primero.' }, { status: 409 });
  }
  const r = await Producto.updateMany(filtro, { $set: { hide: true, ocultoPorMigracion: true } });
  return NextResponse.json({ ok: true, nbVisibles, ocultados: r.modifiedCount });
}
