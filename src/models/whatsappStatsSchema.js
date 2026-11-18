import mongoose from 'mongoose';

const whatsappStatsSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['administracion', 'ventas']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  fecha: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Índice para mejorar las consultas por fecha y tipo
whatsappStatsSchema.index({ fecha: 1, tipo: 1 });
whatsappStatsSchema.index({ timestamp: -1 });

const WhatsappStats = mongoose.models.WhatsappStats || mongoose.model('WhatsappStats', whatsappStatsSchema);

export default WhatsappStats;
