/**
 * Datos de empresa y políticas comerciales.
 * Fuente única para las páginas legales y el JSON-LD.
 * Si cambia un plazo o un teléfono, se cambia acá (o en userData) y se propaga.
 *
 * REVISAR: plazos y condiciones de devolución. El plazo de 10 días corridos es el
 * mínimo legal para compras a distancia (Ley 24.240, art. 34); ajustar si el
 * negocio ofrece más.
 */
import userData from '../../components/constants/userData';

export const empresa = {
  nombre: 'Eshop Devices',
  cuit: userData.cuil,
  email: userData.email,
  telefono: `+${userData.codigoPais}${userData.contact}`,
  telefonoLegible: `+${userData.codigoPais} 11 3631-7470`,
  whatsapp: `https://wa.me/+${userData.codigoPais}${userData.contact}`,
  direccion: userData.direccion, // 'Las Flores 1600, Wilde'
  calle: 'Las Flores 1600',
  localidad: 'Wilde',
  provincia: 'Buenos Aires',
  pais: 'AR',
};

export const devoluciones = {
  // Ley 24.240 art. 34: 10 días corridos para revocar compras a distancia, sin costo para el consumidor.
  plazoDias: 10,
  plazoReintegroDias: 10,
};
