// config/userConfig.ts

const userConfig = {
  basicData: {
    name: 'Eshop Devices',
    direccion: 'Las Flores 1600, Wilde',
    email: 'infoeshopdevices@gmail.com',
    cuil: '23331083739',
  },

  contact: {
    telefono: 1136317470,
    codigoPais: 54,
    textoPredefinido: 'Hola, me gustaría consultar sobre ',
    textBoton: '¡Contáctame!',
    botonNav: 'CONTACTAME',
    whatsappActivo: true,
  },

  administracion: {
    label: 'Administración',
    contacto: 1136317470,
    codigoPais: 54,
    textoPredefinido: 'Hola, me gustaría contactar con administración.',
  },

  ventas: {
    label: 'Ventas',
    contacto: 1136317470,
    codigoPais: 54,
    textoPredefinido: 'Hola, me interesa saber más sobre productos o servicios.',
  },

  multimedia: {
    portada: {
      tipo: 'video', // 'imagen' | 'video'
      url: '/videos/portada.mp4',
    },
    logo: '/images/logo.png',
    favicon: '/images/favicon.ico',
  },

  banco: {
    banco: 'Mercado Pago',
    cbu: '0000003100003176461967',
    alias: 'gonzalotorresgrau.mp',
    titular: 'Gonzalo Torres Grau',
    cuit: '23-33108373-9',
  },

  redesSociales: {
    instagram: 'https://instagram.com/eshopdevices',
    facebook: 'https://www.facebook.com/eshopdevices',
    tiktok: '',
  },

  textosDestacados: {
    homeBanner: 'Equipos y accesorios al mejor precio',
    avisoLegal: 'Precios válidos hasta agotar stock. Imágenes a modo ilustrativo.',
  },

  horarioAtencion: {
    dias: 'Lunes a Viernes',
    horas: '9:00 a 18:00 hs',
  },

  mantenimiento: {
    activo: false,
    mensaje: 'Estamos en mantenimiento. Volvemos pronto.',
  },

  seo: {
    title: 'Eshop Devices | Tecnología al mejor precio',
    description: 'Comprá productos tecnológicos desde la comodidad de tu casa. Envíos a todo el país.',
    keywords: ['ecommerce', 'tecnología', 'celulares', 'gadgets'],
    imagenCompartida: '/images/og-image.jpg',
  },

  branding: {
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    modoOscuro: true,
    fuentePrincipal: 'Inter, sans-serif',
  },

  configuracionTienda: {
    modoCatalogo: false,
    mostrarStock: true,
    permitirComprasSinLogin: true,
    carritoActivo: true,
    enviarWhatsappAuto: true,
  },

  envios: {
    metodo: 'PickIt',
    tiempoEstimado: '2 a 5 días hábiles',
    retiroLocal: true,
    costoFijo: 6500,
    gratisDesde: 60000,
  },

  adminAccess: {
    usuariosAutorizados: ['admin@eshopdevices.com'],
    claveSeguridad: 'eshopadmin2025',
  },
};

export default userConfig;
