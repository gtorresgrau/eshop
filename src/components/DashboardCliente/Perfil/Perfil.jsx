'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { profileSchema } from './perfilSchema'; 
import { Input } from '../../ui/input';

const PerfilPage = ({ usuarioUid }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      nombreCompleto: '',
      correo: '',
      dniOCuit: '',
      telefono: '',
      direccion: {
        pais: '',
        provincia: '',
        ciudad: '',
        calle: '',
        numero: '',
        casaOTorre: '',
        piso: '',
        depto: '',
        codigoPostal: '',
        entreCalles: '',
        telefono: '',
        referencia: '',
      },
    },
  });

  useEffect(() => {
    if (!usuarioUid) {
      router.push('/user/Login');
    } else {
      fetchUserData();
    }
  }, [usuarioUid]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/usuarios/${usuarioUid}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al obtener datos del usuario');
      const data = await res.json();
      setUser(data);
      reset({
        nombreCompleto: data.nombreCompleto || '',
        correo: data.correo || '',
        dniOCuit: data.dniOCuit || '',
        telefono: data.telefono || '',
        direccion: data.direccion || {},
      });
    } catch (error) {
      toast.error(error.message || 'Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/usuarios/${usuarioUid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Error al actualizar el perfil');
      const updated = await res.json();
      setUser(updated);
      reset(updated);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-2 text-sm text-gray-600">
          Actualiza tu información personal y de contacto
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup label="Nombre completo *" name="nombreCompleto" register={register} error={errors.nombreCompleto} />
          <InputGroup label="Correo electrónico *" name="correo" register={register} error={errors.correo} disabled />
          <InputGroup label="Teléfono *" name="telefono" register={register} error={errors.telefono} />
          <InputGroup label="DNI o CUIT *" name="dniOCuit" register={register} error={errors.dniOCuit} />
        </div>

        <h3 className="text-lg font-medium mt-6 mb-2">Dirección</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup label="País" name="direccion.pais" register={register} />
          <InputGroup label="Provincia" name="direccion.provincia" register={register} />
          <InputGroup label="Ciudad" name="direccion.ciudad" register={register} />
          <InputGroup label="Código Postal" name="direccion.codigoPostal" register={register} error={errors.direccion?.codigoPostal} />
          <InputGroup label="Calle" name="direccion.calle" register={register} />
          <InputGroup label="Número" name="direccion.numero" register={register} />
          <InputGroup label="Casa o Torre" name="direccion.casaOTorre" register={register} />
          <InputGroup label="Piso" name="direccion.piso" register={register} />
          <InputGroup label="Depto" name="direccion.depto" register={register} />
          <InputGroup label="Entre calles" name="direccion.entreCalles" register={register} />
          <InputGroup label="Referencia" name="direccion.referencia" register={register} />
        </div>

        <div className="text-center mt-6">
          <button type="submit" className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default PerfilPage;

// ✅ Componente reutilizable para inputs
const InputGroup = ({ label, name, register, error, disabled }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium">{label}</label>
    <Input {...register(name)} id={name} className="input w-full" disabled={disabled} />
    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
  </div>
);
