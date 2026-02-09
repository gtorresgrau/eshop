'use client'

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Swal from 'sweetalert2';
import { Button } from '../../ui/Buttons';

/**
 * Componente modal para ver el historial de comprobantes de una empresa específica
 */
export default function HistorialEmpresaModal({ empresa }) {
  const [open, setOpen] = useState(false);
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar comprobantes cuando se abre el modal
  useEffect(() => {
    if (open && empresa) {
      fetchComprobantes();
    }
  }, [open, empresa]);

  const fetchComprobantes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        empresaNombre: empresa.nombre
      });

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

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
          Ver Historial
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[80vh] -translate-x-1/2 -translate-y-1/2 z-50 overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">
            Historial de Comprobantes - {empresa?.nombre}
          </Dialog.Title>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando comprobantes...</p>
            </div>
          ) : comprobantes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay comprobantes para esta empresa</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">N° Comprobante</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Fecha</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold">Acción</th>
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
                            size="sm"
                            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                          >
                            Ver
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumen */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Comprobantes</p>
                    <p className="text-xl font-bold">{comprobantes.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Presupuestos</p>
                    <p className="text-xl font-bold text-blue-600">
                      {comprobantes.filter(c => c.tipo === 'presupuesto').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recibos</p>
                    <p className="text-xl font-bold text-green-600">
                      {comprobantes.filter(c => c.tipo === 'recibo').length}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Total Facturado</p>
                  <p className="text-2xl font-bold text-primary">
                    {comprobantes.reduce((acc, c) => acc + c.total, 0).toLocaleString('es-AR', {
                      style: 'currency',
                      currency: 'ARS'
                    })}
                  </p>
                </div>
              </div>
            </>
          )}

          <Dialog.Close asChild>
            <Button variant="outline" className="mt-6 w-full">Cerrar</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
