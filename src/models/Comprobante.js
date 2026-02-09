// src/models/Comprobante.js
import mongoose from 'mongoose';

/**
 * Schema para guardar el historial de comprobantes generados
 * (presupuestos y recibos) para empresas
 */
const comprobanteSchema = new mongoose.Schema({
  // Tipo de documento
  tipo: {
    type: String,
    required: true,
    enum: ['presupuesto', 'recibo'],
    trim: true
  },
  
  // Fecha del comprobante
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Datos de la empresa/cliente
  empresa: {
    nombre: { type: String, required: true, trim: true },
    direccion: { type: String, trim: true },
    mail: { type: String, trim: true, lowercase: true },
    telefono: { type: String, trim: true },
    cuil: { type: String, trim: true },
    tipo: { type: String, trim: true },
    observaciones: { type: String, trim: true }
  },
  
  // Items/productos del comprobante
  items: [{
    cantidad: { type: Number, required: true, default: 1 },
    producto: { type: String, required: true, trim: true },
    codigo: { type: String, trim: true },
    precio: { type: Number, required: true, default: 0 },
    usd: { type: Boolean, default: false },
    dolar: { type: Number, default: 1 }
  }],
  
  // Pagos (para recibos)
  pagos: [{
    tipo: { type: String, trim: true },
    monto: { type: Number, default: 0 },
    CH_n: { type: String, trim: true }, // Número de cheque
    Bco: { type: String, trim: true }, // Banco
    cuit: { type: String, trim: true },
    date: { type: Date }
  }],
  
  // Total del comprobante
  total: {
    type: Number,
    required: true,
    default: 0
  },
  
  // URL del PDF generado (si se guarda en cloudinary o similar)
  pdfUrl: {
    type: String,
    trim: true
  },
  
  // Número de comprobante (auto-generado)
  numeroComprobante: {
    type: String,
    unique: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Pre-save hook para generar número de comprobante
comprobanteSchema.pre('save', async function(next) {
  if (!this.numeroComprobante) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Comprobante').countDocuments();
    this.numeroComprobante = `${this.tipo.toUpperCase()}-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.models.Comprobante || mongoose.model('Comprobante', comprobanteSchema);
