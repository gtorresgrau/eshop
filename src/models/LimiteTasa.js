import mongoose from 'mongoose';

// Contador por clave (acción + IP + ventana de tiempo). Mongo borra solo los vencidos (índice TTL).
const schema = new mongoose.Schema({
  clave: { type: String, required: true, unique: true },
  n: { type: Number, default: 0 },
  expira: { type: Date, required: true, index: { expires: 0 } },
});

export default mongoose.models.LimiteTasa || mongoose.model('LimiteTasa', schema);
