'use client'

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Button } from '../../ui/Buttons';

/**
 * Componente para ver el historial de comprobantes generados
 * Permite filtrar por empresa, tipo y rango de fechas
 */
export default function HistorialComprobantes() {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    empresaNombre: '',
    tipo: '',
    desde: '',
    hasta: ''
  });

  // Cargar comprobantes al montar el componente
  useEffect(() => {
    fetchComprobantes();
  }, []);

  // Función para obtener comprobantes
  const fetchComprobantes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filtros.empresaNombre) params.append('empresaNombre', filtros.empresaNombre);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.desde) params.append('desde', filtros.desde);
      if (filtros.hasta) params.append('hasta', filtros.hasta);

      const res = await fetch(`/api/comprobantes?${params.toString()}`);
      const data = await res.json();
      
      setComprobantes(data);
    } catch (error) {
      console.error('Error al cargar comprobantes:', error);
      Swal.fire('Error', 'No se pudieron cargar los comprobantes', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los filtros
  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    fetchComprobantes();
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      empresaNombre: '',
      tipo: '',
      desde: '',
      hasta: ''
    });
    setTimeout(() => fetchComprobantes(), 100);
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Ver detalle del comprobante
  const verDetalle = (comprobante) => {
    const itemsHTML = comprobante.items.map(item => `
      <tr>
        <td class="border px-2 py-1">${item.cantidad}</td>
        <td class="border px-2 py-1">${item.producto}</td>
        <td class="border px-2 py-1">${item.codigo || '-'}</td>
        <td class="border px-2 py-1 text-right">
          ${item.usd ? `USD ${item.precio}` : `$${item.precio.toLocaleString('es-AR')}`}
        </td>
      </tr>
    `).join('');

    const pagosHTML = comprobante.pagos?.length > 0 ? `
      <div class="mt-4">
        <h4 class="font-bold mb-2">Formas de Pago:</h4>
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-gray-100">
              <th class="border px-2 py-1">Tipo</th>
              <th class="border px-2 py-1">Monto</th>
              <th class="border px-2 py-1">Detalles</th>
            </tr>
          </thead>
          <tbody>
            ${comprobante.pagos.map(pago => `
              <tr>
                <td class="border px-2 py-1">${pago.tipo}</td>
                <td class="border px-2 py-1 text-right">$${pago.monto?.toLocaleString('es-AR') || 0}</td>
                <td class="border px-2 py-1 text-xs">
                  ${pago.CH_n ? `CH: ${pago.CH_n}` : ''}
                  ${pago.Bco ? `Banco: ${pago.Bco}` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '';

    Swal.fire({
      title: `${comprobante.tipo.toUpperCase()} - ${comprobante.numeroComprobante}`,
      html: `
        <div class="text-left">
          <div class="mb-4">
            <h4 class="font-bold">Empresa:</h4>
            <p>${comprobante.empresa.nombre}</p>
            <p class="text-sm text-gray-600">${comprobante.empresa.direccion || ''}</p>
            <p class="text-sm text-gray-600">${comprobante.empresa.mail || ''}</p>
            <p class="text-sm text-gray-600">CUIL: ${comprobante.empresa.cuil || '-'}</p>
          </div>
          
          <div class="mb-4">
            <h4 class="font-bold">Fecha:</h4>
            <p>${formatearFecha(comprobante.fecha)}</p>
          </div>

          <div class="mb-4">
            <h4 class="font-bold mb-2">Items:</h4>
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border px-2 py-1">Cant.</th>
                  <th class="border px-2 py-1">Producto</th>
                  <th class="border px-2 py-1">Código</th>
                  <th class="border px-2 py-1">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
          </div>

          ${pagosHTML}

          <div class="mt-4 text-right">
            <h4 class="text-lg font-bold">Total: ${comprobante.total.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS'
            })}</h4>
          </div>

          ${comprobante.empresa.observaciones ? `
            <div class="mt-4 text-sm text-gray-600">
              <h4 class="font-bold">Observaciones:</h4>
              <p>${comprobante.empresa.observaciones}</p>
            </div>
          ` : ''}
        </div>
      `,
      width: '800px',
      confirmButtonText: 'Cerrar'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Historial de Comprobantes</h2>
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Empresa</label>
            <input
              type="text"
              placeholder="Nombre de empresa..."
              value={filtros.empresaNombre}
              onChange={(e) => handleFiltroChange('empresaNombre', e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              value={filtros.tipo}
              onChange={(e) => handleFiltroChange('tipo', e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="">Todos</option>
              <option value="presupuesto">Presupuesto</option>
              <option value="recibo">Recibo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Desde</label>
            <input
              type="date"
              value={filtros.desde}
              onChange={(e) => handleFiltroChange('desde', e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hasta</label>
            <input
              type="date"
              value={filtros.hasta}
              onChange={(e) => handleFiltroChange('hasta', e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={aplicarFiltros}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Aplicar Filtros
          </Button>
          <Button
            onClick={limpiarFiltros}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* Tabla de comprobantes */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando comprobantes...</p>
        </div>
      ) : comprobantes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron comprobantes</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">N° Comprobante</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Empresa</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comprobantes.map((comprobante) => (
                <tr key={comprobante._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono">{comprobante.numeroComprobante}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      comprobante.tipo === 'presupuesto' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {comprobante.tipo.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{comprobante.empresa.nombre}</div>
                    <div className="text-xs text-gray-500">{comprobante.empresa.cuil}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatearFecha(comprobante.fecha)}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold">
                    {comprobante.total.toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      onClick={() => verDetalle(comprobante)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Ver Detalle
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumen */}
      {!loading && comprobantes.length > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Comprobantes</p>
              <p className="text-2xl font-bold">{comprobantes.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Presupuestos</p>
              <p className="text-2xl font-bold text-blue-600">
                {comprobantes.filter(c => c.tipo === 'presupuesto').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Recibos</p>
              <p className="text-2xl font-bold text-green-600">
                {comprobantes.filter(c => c.tipo === 'recibo').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
