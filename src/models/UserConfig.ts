import mongoose from 'mongoose';

const UserConfigSchema = new mongoose.Schema({
  // Datos básicos de la tienda
  basicData: {
    name: { type: String, default: 'Mi Tienda Online' },
    direccion: { type: String, default: '' },
    email: { type: String, default: 'contacto@mitienda.com' },
    cuil: { type: String, default: '' },
  },

  // Configuración de contacto
  contact: {
    telefono: { type: String, default: '' },
    codigoPais: { type: String, default: '54' },
    textoPredefinido: { 
      type: String, 
      default: 'Hola, estoy interesado en un producto de su tienda' 
    },
    textBoton: { type: String, default: 'Contactar' },
    botonNav: { type: String, default: 'WhatsApp' },
    whatsappActivo: { type: Boolean, default: true },
  },

  // Configuración administrativa
  administracion: {
    label: { type: String, default: 'Administración' },
    contacto: { type: String, default: '' },
    codigoPais: { type: String, default: '54' },
    textoPredefinido: { 
      type: String, 
      default: 'Consulta administrativa' 
    },
  },

  // Configuración de ventas
  ventas: {
    label: { type: String, default: 'Ventas' },
    contacto: { type: String, default: '' },
    codigoPais: { type: String, default: '54' },
    textoPredefinido: { 
      type: String, 
      default: 'Consulta sobre productos' 
    },
  },

  // Configuración multimedia
  multimedia: {
    portada: {
      tipo: { type: String, default: 'imagen', enum: ['imagen', 'video'] },
      url: { type: String, default: '' },
    },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
  },

  // Datos bancarios
  banco: {
    banco: { type: String, default: '' },
    cbu: { type: String, default: '' },
    alias: { type: String, default: '' },
    titular: { type: String, default: '' },
    cuit: { type: String, default: '' },
  },

  // Redes sociales
  redesSociales: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },

  // Textos destacados
  textosDestacados: {
    homeBanner: { 
      type: String, 
      default: 'Bienvenidos a nuestra tienda online' 
    },
    avisoLegal: { type: String, default: '' },
  },

  // Horario de atención
  horarioAtencion: {
    dias: { 
      type: String, 
      default: 'Lunes a Viernes' 
    },
    horas: { 
      type: String, 
      default: '9:00 a 18:00 hs' 
    },
  },

  // Modo mantenimiento
  mantenimiento: {
    activo: { type: Boolean, default: false },
    mensaje: { 
      type: String, 
      default: 'Sitio en mantenimiento. Volvemos pronto!' 
    },
  },

  // Configuración SEO
  seo: {
    title: { 
      type: String, 
      default: 'Mi Tienda Online - Los mejores productos' 
    },
    description: { 
      type: String, 
      default: 'Descubre nuestra amplia variedad de productos' 
    },
    keywords: { 
      type: [String], 
      default: ['tienda', 'online', 'productos'] 
    },
    imagenCompartida: { type: String, default: '' },
  },

  // Branding y diseño
  branding: {
    primaryColor: { type: String, default: '#3B82F6' }, // blue-500
    secondaryColor: { type: String, default: '#10B981' }, // emerald-500
    modoOscuro: { type: Boolean, default: false },
    fuentePrincipal: { type: String, default: 'Inter' },
  },

  // Configuración de la tienda
  configuracionTienda: {
    modoCatalogo: { type: Boolean, default: false },
    mostrarStock: { type: Boolean, default: true },
    permitirComprasSinLogin: { type: Boolean, default: true },
    carritoActivo: { type: Boolean, default: true },
    enviarWhatsappAuto: { type: Boolean, default: true },
  },

  // Configuración de envíos
  envios: {
    metodo: { 
      type: String, 
      default: 'correo', 
      enum: ['correo', 'motomensajeria', 'retiro'] 
    },
    tiempoEstimado: { 
      type: String, 
      default: '3-5 días hábiles' 
    },
    retiroLocal: { type: Boolean, default: true },
    costoFijo: { type: Number, default: 0 },
    gratisDesde: { type: Number, default: 0 },
  },

  // Acceso administrativo
  adminAccess: {
    usuariosAutorizados: { 
      type: [String], 
      default: ['admin@mitienda.com'] 
    },
    claveSeguridad: { type: String, default: '' },
  },

}, { 
  timestamps: true,
  // Para que los métodos toObject y toJSON incluyan los getters y virtuals
  toObject: { getters: true, virtuals: true },
  toJSON: { getters: true, virtuals: true }
});

// Middleware para asegurar que siempre haya un documento de configuración
UserConfigSchema.post('save', function(error: any, doc: any, next: any) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Ya existe una configuración'));
  } else {
    next(error);
  }
});

// Método para obtener la configuración actual
UserConfigSchema.statics.getConfig = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

// Verificar si el modelo ya está compilado para evitar errores
const UserConfig = mongoose.models.UserConfig || mongoose.model('UserConfig', UserConfigSchema);

export default UserConfig;