// src/models/User.js
import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  pais: String,
  provincia: String,
  ciudad: String,
  calle: String,
  numero: String,
  casaOTorre: String,
  depto: String,
  codigoPostal: String
}, { _id: false });

const facturaSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['A', 'B', 'C'], default: 'B' },
  razonSocial: String,
  cuit: String,
  domicilio: String,
  codigoPostal: String,
  condicionIva: {
    type: String,
    enum: ['responsableInscripto', 'monotributista', 'exento', 'consumidorFinal'],
    default: 'consumidorFinal'
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  correo: { type: String, required: true, unique: true, lowercase: true, trim: true },
  nombreCompleto: { type: String, trim: true },
  telefono: { type: String, trim: true },
  dniOCuit: { type: String, unique: true, sparse: true, trim: true },
  rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },

  direcciones: [addressSchema],           // Múltiples direcciones disponibles
  datosFacturacion: facturaSchema,        // Facturación habitual

  fechaRegistro: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
