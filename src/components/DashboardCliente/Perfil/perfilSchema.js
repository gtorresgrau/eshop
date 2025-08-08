// ✅ 1. Esquema unificado de validación (src/Validations/perfilSchema.js)
import * as yup from 'yup';

export const direccionSchema = yup.object().shape({
  pais: yup.string().required('El país es obligatorio'),
  provincia: yup.string().required('La provincia es obligatoria'),
  ciudad: yup.string().required('La ciudad es obligatoria'),
  calle: yup.string().required('La calle es obligatoria'),
  numero: yup.string().required('El número es obligatorio'),
  casaOTorre: yup.string().notRequired(),
  piso: yup.string().notRequired(),
  depto: yup.string().notRequired(),
  codigoPostal: yup.string()
    .matches(/^\d{4,5}$/, 'Código postal inválido')
    .required('El código postal es obligatorio'),
  referencia: yup.string().notRequired()
});

export const profileSchema = yup.object().shape({
  nombreCompleto: yup.string().required('El nombre completo es requerido'),
  correo: yup.string().email('Correo electrónico inválido').required('El correo es requerido'),
  dniOCuit: yup.string()
    .matches(/^[0-9]+$/, 'DNI/CUIT debe contener solo números')
    .test('len', 'DNI debe tener 7-8 dígitos o CUIT 11 dígitos', val => {
      if (!val) return true;
      return val.length === 7 || val.length === 8 || val.length === 11;
    }),
  telefono: yup.string()
    .matches(/^[0-9]+$/, 'Teléfono debe contener solo números')
    .min(8, 'Teléfono debe tener al menos 8 dígitos'),
  direccion: direccionSchema
});

export const schemaFactura = yup.object().shape({
  tipo: yup.string().required(),
  razonSocial: yup.string().required('El campo es obligatorio'),
  cuit: yup.string().matches(/^\d{7,11}$/, 'Debe tener entre 7 y 11 dígitos numéricos').required('El CUIT/DNI es obligatorio'),
  telefono: yup.string().required('El teléfono es obligatorio'),
  email: yup.string().email('El email no es válido').required('El email es obligatorio'),
  condicionIva: yup.string().required('Selecciona una condición frente al IVA'),
})