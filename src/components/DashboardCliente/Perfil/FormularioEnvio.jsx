'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema  } from './perfilSchema';
import { Input } from '../../ui/input';

const InputGroup = ({ label, name, register, error, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Input {...register(name)} id={name} />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);

export const FormularioEnvio = ({ user, onCancel, onSubmit: externalOnSubmit, missingFields }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      nombreCompleto: user?.nombreCompleto || '',
      dniOCuit: user?.dniOCuit || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || {
        pais: '', provincia: '', ciudad: '', calle: '', numero: '', casaOTorre: '', piso: '', depto: '', telefono: '', entreCalles: '', codigoPostal: '', referencia: ''
      }
    }
  });

  const onSubmit = (data) => externalOnSubmit(data);
  const mostrarCampo = (campo) => missingFields.includes(campo);

  return (
    <div className="max-h-[70vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {(mostrarCampo('nombreCompleto') || mostrarCampo('dniOCuit') || mostrarCampo('telefono')) && (
          <>
            <h3 className="text-lg font-medium mb-2">Datos personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mostrarCampo('nombreCompleto') && <InputGroup label="Nombre completo" name="nombreCompleto" register={register} error={errors.nombreCompleto} required />}
              {mostrarCampo('dniOCuit') && <InputGroup label="DNI o CUIT" name="dniOCuit" register={register} error={errors.dniOCuit} required />}
              {mostrarCampo('telefono') && <InputGroup label="Teléfono (sin 0)" name="telefono" register={register} error={errors.telefono} required />}
            </div>
          </>
        )}

        {(mostrarCampo('pais') || mostrarCampo('provincia') || mostrarCampo('ciudad') || mostrarCampo('calle') || mostrarCampo('numero') || mostrarCampo('codigoPostal')) && (
          <>
            <h3 className="text-lg font-medium mb-2 mt-6">Dirección de envío</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mostrarCampo('pais') && <InputGroup label="País" name="direccion.pais" register={register} error={errors.direccion?.pais} required />}
              {mostrarCampo('provincia') && <InputGroup label="Provincia" name="direccion.provincia" register={register} error={errors.direccion?.provincia} required />}
              {mostrarCampo('ciudad') && <InputGroup label="Ciudad" name="direccion.ciudad" register={register} error={errors.direccion?.ciudad} required />}
              {mostrarCampo('calle') && <InputGroup label="Calle" name="direccion.calle" register={register} error={errors.direccion?.calle} required />}
              {mostrarCampo('numero') && <InputGroup label="Número" name="direccion.numero" register={register} error={errors.direccion?.numero} required />}
              {mostrarCampo('casaOTorre') && <InputGroup label="Casa o Torre" name="direccion.casaOTorre" register={register} error={errors.direccion?.casaOTorre} />}
              {mostrarCampo('piso') && <InputGroup label="Piso" name="direccion.piso" register={register} error={errors.direccion?.piso} />}
              {mostrarCampo('depto') && <InputGroup label="Depto" name="direccion.depto" register={register} error={errors.direccion?.depto} />}
              {mostrarCampo('codigoPostal') && <InputGroup label="Código Postal" name="direccion.codigoPostal" register={register} error={errors.direccion?.codigoPostal} required />}
              {mostrarCampo('referencia') && <InputGroup label="Referencia" name="direccion.referencia" register={register} error={errors.direccion?.referencia} />}
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover">Guardar y continuar</button>
        </div>
      </form>
    </div>
  );
};
