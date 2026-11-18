// Mapeo puro catálogo New Bytes → documento `producto`. Sin I/O, fácil de testear.
//
// Precio de venta (ARS) = finalPrice (USD con IVA) × cotización NB × (1 + margen)
// Se usa la cotización que informa NB porque es la que se usa para cobrarnos.

export const MARGEN_PCT_DEFAULT = 30;

export function precioVentaARS({ finalPrice, cotizacion }, margenPct = MARGEN_PCT_DEFAULT) {
  const usd = Number(finalPrice);
  const tc = Number(cotizacion);
  if (!(usd > 0) || !(tc > 0)) return 0;
  const ars = usd * tc * (1 + margenPct / 100);
  return Math.round(ars); // pesos enteros
}

/** Devuelve null si el ítem no se puede publicar (sin id, título o precio). */
export function mapItem(it, { margenPct = MARGEN_PCT_DEFAULT, ahora = new Date() } = {}) {
  if (!it || !it.id || !it.title) return null;
  const costoUSD = Number(it.price?.finalPrice ?? 0);
  const cotizacion = Number(it.cotizacion ?? 0);
  const precio = precioVentaARS({ finalPrice: costoUSD, cotizacion }, margenPct);
  if (!precio) return null;

  const cantidad = Math.max(0, Number(it.amountStock ?? it.availableStock ?? 0) || 0);

  return {
    nbId: Number(it.id),
    // Campos que el sync mantiene actualizados (siempre se pisan)
    set: {
      origen: 'nb',
      nbId: Number(it.id),
      nbSku: it.sku ?? '',
      nombre: it.title,
      titulo_de_producto: it.title,
      marca: it.brand ?? '',
      categoria: it.category ?? '',
      precio: String(precio),
      usd: false,
      cantidad,
      stock: cantidad <= 0, // en esta base `stock: true` significa SIN stock
      costoUSD,
      nbCotizacion: cotizacion,
      pesoGr: it.weightAverage ?? undefined,
      altoCm: it.highAverage ?? undefined,
      anchoCm: it.widthAverage ?? undefined,
      largoCm: it.lengthAverage ?? undefined,
      foto_1_1: it.mainImage ?? '',
      nbSyncAt: ahora,
      hide: false,
    },
    // Solo al crear: lo que edites después en el Admin no se pisa
    setOnInsert: {
      cod_producto: `NB-${it.id}`,
      modelo: it.sku || String(it.id),
      descripcion: it.title,
      destacados: false,
      descuento: 0,
      vendido: false,
      usado: false,
    },
  };
}
