'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { direccionSchema } from './perfilSchema';
import { Input } from '../../ui/input';

// Componente de input reutilizable
const InputGroup = ({ label, name, register, error }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium">{label}</label>
    <Input
      id={name}
      {...register(name)}
      className="input w-full"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export default function FormularioDireccion({ onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(direccionSchema),
    defaultValues: {
      pais: 'Argentina',
      provincia: '',
      ciudad: '',
      calle: '',
      numero: '',
      casaOTorre: '',
      piso: '',
      depto: '',
      telefono: '',
      entreCalles: '',
      codigoPostal: '',
      referencia: '',
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 uppercase">Dirección de Envío</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 uppercase">
        <div className="grid grid-cols-2 gap-4">
          <InputGroup label="País" name="pais" register={register} error={errors.pais} />
          <InputGroup label="Provincia" name="provincia" register={register} error={errors.provincia} />
          <InputGroup label="Localidad" name="ciudad" register={register} error={errors.ciudad} />
          <InputGroup label="Calle" name="calle" register={register} error={errors.calle} />
          <InputGroup label="Número" name="numero" register={register} error={errors.numero} />
          <InputGroup label="Casa / Torre" name="casaOTorre" register={register} error={errors.casaOTorre} />
          <InputGroup label="Piso" name="piso" register={register} error={errors.piso} />
          <InputGroup label="Depto" name="depto" register={register} error={errors.depto} />
          <InputGroup label="Teléfono" name="telefono" register={register} error={errors.telefono} />
          <InputGroup label="Cód. Postal" name="codigoPostal" register={register} error={errors.codigoPostal} />
          <InputGroup label="Entre Calles" name="entreCalles" register={register} error={errors.entreCalles} />
          <InputGroup label="Referencia" name="referencia" register={register} error={errors.referencia} />
        </div>

        <div className="flex justify-between mt-6 text-base">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
