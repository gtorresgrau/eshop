// src/models/product.js
import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  _id: { type: String }, // mismo que cod_producto
  cod_producto: { type: String, required: true, unique: true },
  n_producto: { type: Number, required: true },
  marca: { type: String, required: true },
  categoria: { type: String, required: true },
  nombre: { type: String, required: true },
  modelo: { type: String, required: true },
  n_serie: { type: String },
  titulo_de_producto: { type: String, required: true },
  descripcion: { type: String, required: true },
  n_electronica: { type: String },
  precio: { type: String, required: true },
  medidas: String,
  foto_1_1: String,
  foto_1_2: String,
  foto_1_3: String,
  foto_1_4: String,
  hide: { type: Boolean, default: false },
  stock: { type: Boolean, default: false },
  vendido: { type: Boolean, default: false },
  destacados: { type: Boolean, default: false },
  usd: { type: Boolean, default: false },
  usado: { type: Boolean, default: false },
}, {
  timestamps: true,
  _id: false
});

productoSchema.pre('save', function (next) {
  this._id = this.cod_producto;
  next();
});

const producto = mongoose.models.producto || mongoose.model('producto', productoSchema);

export default producto;
