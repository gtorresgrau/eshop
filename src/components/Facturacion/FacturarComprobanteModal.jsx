'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

// Precio unitario máximo por ítem para Monotributo en venta de cosas muebles.
// Se actualiza con cada recategorización: ajustalo cuando ARCA publique el nuevo valor.
const MAX_PRECIO_UNITARIO = 716840.77;

const CONDICIONES_IVA = [
  { id: 1, label: 'IVA Responsable Inscripto' },
  { id: 4, label: 'IVA Sujeto Exento' },
  { id: 5, label: 'Consumidor Final' },
  { id: 6, label: 'Responsable Monotributo' },
  { id: 13, label: 'Monotributista Social' },
  { id: 15, label: 'IVA No Alcanzado' },
];

const pesos = (n) =>
  Number(n).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 });

const precioFinal = (it) => (it.usd ? Number(it.precio) * Number(it.dolar || 1) : Number(it.precio));

/**
 * Modal para emitir una Factura C a partir de un presupuesto guardado.
 * Props: comprobante (documento de /api/comprobantes), onClose(), onEmitida(facturaGuardada)
 */
export default function FacturarComprobanteModal({ comprobante, onClose, onEmitida }) {
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState('');
  const [docTipo, setDocTipo] = useState(80);
  const [docNro, setDocNro] = useState(String(comprobante.empresa?.cuil || '').replace(/\D/g, ''));
  const [razonSocial, setRazonSocial] = useState(comprobante.empresa?.nombre || '');
  const [condicionIva, setCondicionIva] = useState('');
  const [concepto, setConcepto] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/arca/generate')
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'No se pudo leer la configuración de ARCA');
        setConfig(d);
      })
      .catch((e) => setConfigError(e.message));
  }, []);

  const total = useMemo(
    () => Math.round(comprobante.items.reduce((a, it) => a + Number(it.cantidad) * precioFinal(it), 0) * 100) / 100,
    [comprobante]
  );
  const itemsCaros = comprobante.items.filter((it) => precioFinal(it) > MAX_PRECIO_UNITARIO);
  const esProd = config?.ambiente === 'prod';

  const emitir = async () => {
    setError('');
    if (!condicionIva) return setError('Elegí la condición frente al IVA del receptor.');
    if (docTipo === 80 && String(docNro).replace(/\D/g, '').length !== 11) return setError('El CUIT debe tener 11 dígitos.');

    const ok = await Swal.fire({
      title: esProd ? '¿Emitir factura REAL?' : '¿Emitir factura de PRUEBA?',
      html: `<div style="text-align:left">
        <p><b>Factura C</b> · PV ${String(config.ptoVta).padStart(5, '0')}</p>
        <p>Receptor: ${razonSocial} (${docNro || 'sin identificar'})</p>
        <p>Total: <b>${pesos(total)}</b></p>
        <p style="margin-top:8px;color:${esProd ? '#b91c1c' : '#555'}">${
          esProd
            ? 'Se generará el CAE en ARCA y <b>no se puede deshacer</b> (solo anular con nota de crédito).'
            : 'Ambiente de homologación: no tiene validez fiscal.'
        }</p></div>`,
      icon: esProd ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, emitir',
      cancelButtonText: 'Cancelar',
    });
    if (!ok.isConfirmed) return;

    setLoading(true);
    try {
      const res = await fetch('/api/arca/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          comprobanteId: comprobante._id,
          receptor: { docTipo, docNro, razonSocial, condicionIva: Number(condicionIva) },
          concepto,
          totalEsperado: total,
          ambienteConfirmado: config.ambiente,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'No se pudo emitir la factura');
        if (data.incierto) onEmitida?.(null); // refresca la lista: quedó "pendiente de verificar"
        return;
      }
      await Swal.fire({
        icon: 'success',
        title: 'Factura emitida',
        html: `<p>Factura C ${String(data.factura.ptoVta).padStart(5, '0')}-${String(data.factura.nroCbte).padStart(8, '0')}</p>
               <p>CAE: <b>${data.factura.cae}</b></p>
               <p>Vto. CAE: ${data.factura.caeVto.replace(/(\d{4})(\d{2})(\d{2})/, '$3/$2/$1')}</p>
               ${data.factura.ambiente === 'homo' ? '<p style="color:#555">(homologación, sin validez fiscal)</p>' : ''}`,
      });
      onEmitida?.(data.factura);
      onClose();
    } catch (e) {
      setError(e.message || 'Error de red');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Facturar {comprobante.numeroComprobante}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">✕</button>
        </div>

        {configError && <p className="bg-red-50 text-red-700 p-2 rounded mb-3 text-sm">{configError}</p>}
        {config && (
          <p className={`p-2 rounded mb-3 text-sm font-semibold ${esProd ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-800'}`}>
            Ambiente: {esProd ? 'PRODUCCIÓN (factura real)' : 'HOMOLOGACIÓN (prueba, sin validez fiscal)'} · Punto de venta {String(config.ptoVta).padStart(5, '0')}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
          <label className="block">Razón social
            <input className="border rounded p-2 w-full" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} />
          </label>
          <label className="block">Condición IVA del receptor
            <select className="border rounded p-2 w-full" value={condicionIva} onChange={(e) => setCondicionIva(e.target.value)}>
              <option value="">Seleccionar…</option>
              {CONDICIONES_IVA.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="block">Documento
            <select className="border rounded p-2 w-full" value={docTipo} onChange={(e) => setDocTipo(Number(e.target.value))}>
              <option value={80}>CUIT</option>
              <option value={96}>DNI</option>
              <option value={99}>Consumidor final sin identificar</option>
            </select>
          </label>
          {docTipo !== 99 && (
            <label className="block">Número
              <input className="border rounded p-2 w-full" value={docNro} onChange={(e) => setDocNro(e.target.value)} />
            </label>
          )}
          <label className="block">Concepto
            <select className="border rounded p-2 w-full" value={concepto} onChange={(e) => setConcepto(Number(e.target.value))}>
              <option value={1}>Productos</option>
              <option value={2}>Servicios</option>
              <option value={3}>Productos y Servicios</option>
            </select>
          </label>
        </div>

        <table className="w-full text-sm mb-3">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Cant.</th>
              <th className="border px-2 py-1 text-left">Detalle</th>
              <th className="border px-2 py-1 text-right">Precio unit.</th>
              <th className="border px-2 py-1 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {comprobante.items.map((it, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{it.cantidad}</td>
                <td className="border px-2 py-1">{it.producto}</td>
                <td className="border px-2 py-1 text-right">{pesos(precioFinal(it))}</td>
                <td className="border px-2 py-1 text-right">{pesos(it.cantidad * precioFinal(it))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-right text-lg font-bold mb-3">Total: {pesos(total)}</p>
        <p className="text-xs text-gray-500 mb-3">Factura C: no discrimina IVA; el total facturado es el total del presupuesto.</p>

        {itemsCaros.length > 0 && (
          <p className="bg-yellow-50 text-yellow-800 p-2 rounded mb-3 text-sm">
            Atención: {itemsCaros.length} ítem(s) superan el precio unitario máximo de Monotributo para venta de cosas muebles
            ({pesos(MAX_PRECIO_UNITARIO)}). Dividilos en varios ítems antes de facturar.
          </p>
        )}

        {error && <p className="bg-red-50 text-red-700 p-2 rounded mb-3 text-sm">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cerrar</button>
          <button
            onClick={emitir}
            disabled={loading || !config}
            className={`${esProd ? 'bg-red-600' : 'bg-green-600'} text-white px-4 py-2 rounded disabled:opacity-50`}
          >
            {loading ? 'Emitiendo…' : 'Emitir Factura C'}
          </button>
        </div>
      </div>
    </div>
  );
}
