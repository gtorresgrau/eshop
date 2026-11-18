import { connectDB } from './mongodb';
import Producto from '../models/product';
import { getCatalog } from './newbytes';
import { mapItem, MARGEN_PCT_DEFAULT } from './nbMap';

const MIN_ESPERADOS = 100; // si NB devuelve menos, algo anda mal: no ocultamos nada

/**
 * Sincroniza el catálogo de NB a la colección `producto`.
 * - Solo toca documentos con origen 'nb' (los productos propios no se modifican).
 * - Los productos que NB dejó de listar se ocultan (hide) y quedan sin stock.
 * @param {{dry?: boolean}} opts dry=true calcula y devuelve el resumen sin escribir.
 */
export async function sincronizarCatalogoNB({ dry = false } = {}) {
  const margenPct = Number(process.env.NB_MARGEN_PCT) || MARGEN_PCT_DEFAULT;
  const catalogo = await getCatalog();
  if (!Array.isArray(catalogo) || catalogo.length < MIN_ESPERADOS) {
    throw new Error(`Catálogo NB inesperado (${Array.isArray(catalogo) ? catalogo.length : typeof catalogo} ítems). Sync abortado.`);
  }

  const ahora = new Date();
  const mapeados = [];
  let omitidos = 0;
  let sinStock = 0;
  for (const it of catalogo) {
    const m = mapItem(it, { margenPct, ahora });
    if (!m) { omitidos++; continue; }
    // Solo se publican productos con stock. Los que se quedan sin stock se ocultan abajo.
    if (m.set.cantidad <= 0) { sinStock++; continue; }
    mapeados.push(m);
  }

  const resumen = {
    margenPct,
    recibidos: catalogo.length,
    aSincronizar: mapeados.length,
    omitidosSinPrecio: omitidos,
    omitidosSinStock: sinStock,
    muestra: mapeados.slice(0, 3).map((m) => ({ nbId: m.nbId, ...m.set, nbSyncAt: undefined })),
  };
  if (dry) return { dry: true, ...resumen };

  await connectDB();
  const ops = mapeados.map((m) => ({
    updateOne: {
      // cod_producto es único: se identifica por nbId y, al crear, se fija NB-<id>
      filter: { nbId: m.nbId, origen: 'nb' },
      update: { $set: m.set, $setOnInsert: m.setOnInsert },
      upsert: true,
    },
  }));

  let escritos = { upserted: 0, modified: 0 };
  for (let i = 0; i < ops.length; i += 500) {
    const r = await Producto.bulkWrite(ops.slice(i, i + 500), { ordered: false });
    escritos.upserted += r.upsertedCount;
    escritos.modified += r.modifiedCount;
  }

  const ids = mapeados.map((m) => m.nbId);
  const ocultos = await Producto.updateMany(
    { origen: 'nb', nbId: { $nin: ids }, hide: { $ne: true } },
    { $set: { hide: true, cantidad: 0, stock: true, nbSyncAt: ahora } }
  );

  return { dry: false, ...resumen, creados: escritos.upserted, actualizados: escritos.modified, ocultados: ocultos.modifiedCount };
}
