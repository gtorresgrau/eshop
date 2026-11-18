'use client';
import { useState } from 'react';
import Swal from 'sweetalert2';

const fmt = (n) => Number(n || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const BADGE = {
  pendiente_aprobacion: 'bg-yellow-100 text-yellow-800',
  procesando: 'bg-blue-100 text-blue-800',
  enviado: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
};
const LABEL = {
  pendiente_aprobacion: 'Pendiente de aprobación',
  procesando: 'Procesando…',
  enviado: 'Enviado a NB',
  error: 'Error',
};

/** Panel de dropshipping New Bytes para un pedido del Admin. No renderiza nada si el pedido no tiene productos de NB. */
export default function NBPanel({ pedido }) {
  const [nb, setNb] = useState(pedido?.nb);
  const [cargando, setCargando] = useState(false);

  if (!nb || !nb.estado || nb.estado === 'no_aplica') return null;
  const pagado = pedido.estado === 'pagado';
  const puedeAprobar = pagado && (nb.estado === 'pendiente_aprobacion' || nb.estado === 'error');
  const envio = pedido.envio;

  const aprobar = async () => {
    const reintento = nb.estado === 'error';
    const ok = await Swal.fire({
      icon: 'warning',
      title: reintento ? 'Reintentar envío a New Bytes' : 'Enviar pedido a New Bytes',
      html:
        `<p style="text-align:left">Se va a generar una <b>compra real</b> en New Bytes que se paga por transferencia.</p>` +
        (envio ? `<p style="text-align:left;margin-top:8px">Envío: <b>${envio.nombre}</b> · costo NB ${fmt(envio.costoNB)} · cobrado al cliente ${envio.gratis ? 'GRATIS' : fmt(envio.costoCliente)}</p>` : '') +
        (reintento && /INCIERTO|incierto/.test(nb.error || '')
          ? `<p style="text-align:left;margin-top:8px;color:#b91c1c"><b>El intento anterior tuvo un resultado incierto.</b> Verificá en Mi cuenta de NB que NO exista ya este pedido antes de continuar.</p>`
          : ''),
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    });
    if (!ok.isConfirmed) return;

    setCargando(true);
    setNb((n) => ({ ...n, estado: 'procesando' }));
    try {
      const res = await fetch(`/api/newbytes/pedido/${pedido._id}/aprobar`, { method: 'POST', credentials: 'include' });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j.error || 'No se pudo enviar');
      setNb({ ...nb, estado: 'enviado', orderId: String(j.orderId), branch: String(j.branch), status: String(j.status), statusDetail: j.detalle, error: '' });
      Swal.fire({ icon: 'success', title: 'Pedido enviado a New Bytes', text: `N° ${j.branch}-${j.orderId}` });
    } catch (e) {
      setNb({ ...nb, estado: 'error', error: e.message });
      Swal.fire({ icon: 'error', title: 'No se pudo enviar', text: e.message });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="my-2 p-2 border rounded-md text-sm bg-gray-50">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-gray-700">New Bytes</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${BADGE[nb.estado] || ''}`}>{LABEL[nb.estado] || nb.estado}</span>
      </div>
      {envio && (
        <p className="text-xs text-gray-600 mt-1">
          {envio.nombre} · CP {envio.codigoPostal} · NB {fmt(envio.costoNB)} / cliente {envio.gratis ? 'gratis' : fmt(envio.costoCliente)}
        </p>
      )}
      {nb.estado === 'enviado' && (
        <p className="text-xs text-gray-700 mt-1">
          Pedido NB <b>{nb.branch}-{nb.orderId}</b> · {nb.statusDetail || nb.status}
        </p>
      )}
      {nb.estado === 'error' && nb.error && <p className="text-xs text-red-700 mt-1 break-words">{nb.error}</p>}
      {!pagado && nb.estado === 'pendiente_aprobacion' && (
        <p className="text-xs text-gray-500 mt-1">Se puede aprobar cuando el pedido figure como pagado.</p>
      )}
      {puedeAprobar && (
        <button
          onClick={aprobar}
          disabled={cargando}
          className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-3 py-1 rounded"
        >
          {nb.estado === 'error' ? 'Reintentar envío a NB' : 'Aprobar y enviar a NB'}
        </button>
      )}
    </div>
  );
}
