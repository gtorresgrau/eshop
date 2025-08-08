'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaFactura } from './perfilSchema'
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


export default function FormularioFactura({ tipo, onSubmit, onCancel, usuarioUid, initialData, esConsumidorFinal = true }) {
  const { register, reset, handleSubmit, watch, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schemaFactura),
    defaultValues: {
      tipo: tipo || 'B',
      razonSocial: '',
      cuit: '',
      telefono: '',
      email: '',
      condicionIva: '',
    },
    mode: 'onChange'
  })

  const condicionIva = watch('condicionIva')
  const tipoFactura = condicionIva === 'Responsable Inscripto' ? 'A' : 'B'

  useEffect(() => {
    if (initialData) {
      reset({
        tipo: tipo || 'B',
        razonSocial: initialData.razonSocial || '',
        cuit: initialData.cuit || '',
        telefono: initialData.telefono || '',
        email: initialData.email || '',
        condicionIva: initialData.condicionIva || '',
      })
    } else if (usuarioUid) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/usuarios/${usuarioUid}`)
          const userData = await response.json()

          reset({
            tipo: tipo || 'B',
            razonSocial: userData.factura?.razonSocial || '',
            cuit: userData.factura?.cuit || userData.dniOCuit || '',
            telefono: userData.factura?.telefono || (userData.direccion ? `${userData.direccion.calle || ''} ${userData.direccion.numero || ''}, ${userData.direccion.ciudad || ''}`.trim() : ''),
            email: userData.factura?.email || userData.direccion?.email || '',
            condicionIva: userData.factura?.condicionIva || 'Consumidor Final'
          })
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      fetchData()
    }
  }, [initialData, reset, tipo, usuarioUid])

  const enviar = (datos) => {
    if (!isValid) return
    onSubmit({ ...datos, tipo: tipoFactura, cuit: datos.cuit.trim() })
  }

  return (
    <div className="p-6 bg-white rounded-xl max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 uppercase">Datos del Cliente</h2>
      <form className="space-y-4" onSubmit={handleSubmit(enviar)}>
        <InputGroup label={esConsumidorFinal ? 'Nombre y Apellido' : 'Razón Social'} name="razonSocial" register={register} error={errors.razonSocial} />
        <InputGroup label={esConsumidorFinal ? 'DNI' : 'CUIT'} name="cuit" register={register} error={errors.cuit} />
        <InputGroup label="Teléfono" name="telefono" register={register} error={errors.telefono} />
        <InputGroup label="Email" name="email" register={register} error={errors.email} />
        <div>
          <label className="block text-sm uppercase">Condición frente al IVA</label>
          <select {...register('condicionIva')} className="w-full border rounded p-2">
            <option value="">Seleccionar</option>
            <option value="Consumidor Final">Consumidor Final</option>
            <option value="Responsable Inscripto">Responsable Inscripto</option>
            <option value="Monotributista">Monotributista</option>
            <option value="IVA Exento">IVA Exento</option>
          </select>
          {errors.condicionIva && <p className="text-red-500 text-sm">{errors.condicionIva.message}</p>}
        </div>
        {Object.keys(errors).length > 0 && <p className="text-red-500 text-sm">Completa todos los campos correctamente.</p>}
        <div className="flex justify-between mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600">Cancelar</button>
          <button type="submit" disabled={!isValid} className={`px-4 py-2 rounded text-white ${isValid ? 'bg-primary hover:bg-primary-hover' : 'bg-gray-400 cursor-not-allowed'}`}>Guardar</button>
        </div>
      </form>
    </div>
  )
}
