'use client';
import { useState } from 'react';

export default function FormularioEntrega({ telefonoInicial = '', onSubmit, onCancel }) {
  const [tipoEntrega, setTipoEntrega] = useState(null);
  const [telefono, setTelefono] = useState(telefonoInicial);
  const [error, setError] = useState('');

  const handleConfirmar = () => {
    setError('');
    if (!tipoEntrega) {
      setError('Seleccioná cómo querés recibir tu pedido.');
      return;
    }
    if (!telefono.trim()) {
      setError('Ingresá un número de teléfono de contacto.');
      return;
    }
    onSubmit({ tipoEntrega, telefono: telefono.trim() });
  };

  return (
    <div className="p-6 bg-white rounded-xl max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-1 text-gray-800">¿Cómo recibís tu pedido?</h2>
      <p className="text-sm text-gray-500 mb-5">Elegí una opción y confirmá tu teléfono de contacto.</p>

      {/* Opciones de entrega */}
      <div className="flex gap-3 mb-5">
        <button
          type="button"
          onClick={() => setTipoEntrega('retiro')}
          className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
            tipoEntrega === 'retiro'
              ? 'border-orange-500 bg-orange-50 shadow-sm'
              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
          }`}
        >
          <span className="text-2xl">🏪</span>
          <span className="font-semibold text-sm text-gray-700">Retiro en local</span>
          <span className="text-xs text-green-600 font-medium">Sin costo</span>
        </button>

        <button
          type="button"
          onClick={() => setTipoEntrega('envio')}
          className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
            tipoEntrega === 'envio'
              ? 'border-orange-500 bg-orange-50 shadow-sm'
              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
          }`}
        >
          <span className="text-2xl">🚚</span>
          <span className="font-semibold text-sm text-gray-700">Envío a domicilio</span>
          <span className="text-xs text-gray-400">A coordinar</span>
        </button>
      </div>

      {/* Teléfono */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono de contacto
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 1122334455"
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Te contactamos para coordinar la entrega.</p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Acciones */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirmar}
          className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
