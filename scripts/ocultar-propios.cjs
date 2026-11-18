// Oculta (hide: true) todos los productos que NO son de New Bytes. Reversible.
//
//   node scripts/ocultar-propios.cjs              → solo muestra qué haría (no escribe)
//   node scripts/ocultar-propios.cjs --aplicar    → guarda respaldo de ids y oculta
//   node scripts/ocultar-propios.cjs --revertir <archivo.json>  → vuelve a mostrar SOLO los que estaban visibles
//
// Importante: correr DESPUÉS de importar el catálogo de NB (POST /api/newbytes/sync),
// para que la tienda no quede vacía.
const fs = require('fs');
const mongoose = require('mongoose');

for (const l of fs.readFileSync(__dirname + '/../.env.local', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^MONGODB_URI=(.*)$/);
  if (m) process.env.MONGODB_URI = m[1].replace(/^["']|["']$/g, '');
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const P = mongoose.connection.db.collection('productos');
  const args = process.argv.slice(2);

  if (args[0] === '--revertir') {
    const ids = JSON.parse(fs.readFileSync(args[1], 'utf8')).ids.map((s) => new mongoose.Types.ObjectId(s));
    const r = await P.updateMany({ _id: { $in: ids }, origen: { $ne: 'nb' } }, { $set: { hide: false } });
    console.log('Vueltos a mostrar:', r.modifiedCount);
  } else {
    const nb = await P.countDocuments({ origen: 'nb', hide: { $ne: true } });
    const propiosVisibles = await P.find({ origen: { $ne: 'nb' }, hide: { $ne: true } }, { projection: { _id: 1 } }).toArray();
    console.log(`Productos de NB visibles: ${nb}`);
    console.log(`Productos propios visibles (se ocultarían): ${propiosVisibles.length}`);
    if (nb === 0) console.log('⚠ No hay productos de NB visibles: importá el catálogo primero.');

    if (args[0] === '--aplicar') {
      if (nb === 0) { console.log('Abortado: la tienda quedaría vacía.'); process.exit(2); }
      const respaldo = `D:/eshop_propios_ocultados_${new Date().toISOString().slice(0, 10)}.json`;
      fs.writeFileSync(respaldo, JSON.stringify({ fecha: new Date(), ids: propiosVisibles.map((p) => String(p._id)) }));
      const r = await P.updateMany({ origen: { $ne: 'nb' } }, { $set: { hide: true } });
      console.log(`Ocultados: ${r.modifiedCount}. Respaldo de ids: ${respaldo}`);
    } else {
      console.log('(simulación: no se escribió nada. Usá --aplicar para ocultar)');
    }
  }
  await mongoose.disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
