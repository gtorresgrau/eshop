'use client';

import Loading from '@/components/Loading/Loading';
import { useState } from 'react';

export default function ImportarProductos() {
  const [file, setFile] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMensaje('Por favor, seleccioná un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch('/api/importar-productos', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.message);
      } else {
        setMensaje(data.error || 'Hubo un error al importar.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl shadow-lg bg-white mt-10">
      <h2 className="text-xl font-semibold mb-4">Importar productos desde Excel</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" accept=".xlsm,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="border p-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" >
          {loading ?  <Loading /> : 'Subir archivo'}
        </button>
      </form>

      {mensaje && (
        <p className="mt-4 text-sm text-center text-gray-700">{mensaje}</p>
      )}
    </div>
  );
}
