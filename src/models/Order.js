// src/models/Order.js
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'producto',
    required: true
  },
  nombreProducto: String,
  cantidad: { type: Number, required: true },
  precioUnitario: { type: Number, required: true }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  pais: String,
  provincia: String,
  ciudad: String,
  calle: String,
  numero: String,
  casaOTorre: String,
  piso: String,
  depto: String,
  telefono: String,
  entreCalles: String,
  codigoPostal: String,
  referencia: String
}, { _id: false });

const facturaSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['A', 'B', 'C'], default: 'B' },
  fecha: Date,
  cuit: String,
  razonSocial: String,
  telefono: String,
  email: String,
  condicionIva: {
    type: String,
    enum: ['Responsable Inscripto', 'Monotributista', 'IVA Exento', 'Consumidor Final'],
    default: 'Consumidor Final'
  }
}, { _id: false });

const paymentDetailsSchema = new mongoose.Schema({
  status: String,
  status_detail: String,
  payment_method_id: String,
  payment_type_id: String,
  installments: Number,
  transaction_amount: Number,
  date_approved: Date,
  date_created: Date,
  last_updated: Date,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  fechaPedido: { type: Date, default: Date.now },
  
  direccionEnvio: addressSchema,    // Snapshot en el momento de la compra
  datosFacturacion: facturaSchema,  // Snapshot también

  items: [orderItemSchema],

  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },

  paymentMethod: {
    type: String,
    enum: ['mercadopago', 'transferencia', 'efectivo'],
    default: 'transferencia',
    required: true
  },

  total: { type: Number, required: true, min: 0 },

  pref_id: String,
  external_reference: { type: String, sparse: true, index: true },
  paymentId: String,
  nroComprobante: String,

  collectionId: String,
  collectionStatus: String,
  paymentType: String,
  merchantOrderId: String,
  preferenceId: String,
  init_point: String,
  siteId: String,
  processingMode: String,
  merchantAccountId: String,
  payerEmail: String,

  etiquetaEnvio: { type: String, default: '' },
  trackingCode: { type: String, default: '' },

  paymentDetails: paymentDetailsSchema,

  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
