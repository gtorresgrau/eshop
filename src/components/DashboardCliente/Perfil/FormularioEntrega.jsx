'use client';
import { useEffect, useState } from 'react';

const fmt = (n) => Number(n).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const inputCls =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent';

/**
 * @param {object} props
 * @param {{cod_producto: string, quantity: number}[]} [props.cart] carrito (para cotizar envío)
 * @param {boolean} [props.requiereEnvio] true si hay productos de New Bytes: solo envío a domicilio, con cotización
 */
export default function FormularioEntrega({ telefonoInicial = '', cart = [], requiereEnvio = false, onSubmit, onCancel }) {
  const [tipoEntrega, setTipoEntrega] = useState(requiereEnvio ? 'envio' : null);
  const [telefono, setTelefono] = useState(telefonoInicial);
  const [error, setError] = useState('');

  const [dir, setDir] = useState({ calle: '', numero: '', piso: '', depto: '', ciudad: '', provinciaId: '', codigoPostal: '' });
  const [provincias, setProvincias] = useState([]);
  const [cotizando, setCotizando] = useState(false);
  const [cotizacion, setCotizacion] = useState(null); // { cp, opciones, envioGratis }
  const [carrierId, setCarrierId] = useState(null);

  const set = (k) => (e) => {
    setDir((d) => ({ ...d, [k]: e.target.value }));
    if (k === 'codigoPostal') { setCotizacion(null); setCarrierId(null); }
  };

  useEffect(() => {
    if (!requiereEnvio) return;
    fetch('/api/newbytes/provincias').then((r) => r.json()).then((j) => setProvincias(j.provincias || [])).catch(() => {});
  }, [requiereEnvio]);

  const cotizar = async () => {
    setError('');
    const cp = dir.codigoPostal.trim();
    if (!/^\d{4}$/.test(cp)) { setError('Ingresá un código postal de 4 dígitos.'); return; }
    setCotizando(true);
    try {
      const res = await fetch('/api/newbytes/envio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map((i) => ({ cod_producto: i.cod_producto, quantity: i.quantity })), codigoPostal: cp }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'No se pudo cotizar el envío');
      setCotizacion({ cp, opciones: j.opciones || [], envioGratis: !!j.envioGratis });
      setCarrierId(j.opciones?.[0]?.carrierId ?? null);
    } catch (e) {
      setCotizacion(null);
      setCarrierId(null);
      setError(e.message);
    } finally {
      setCotizando(false);
    }
  };

  const handleConfirmar = () => {
    setError('');
    if (!tipoEntrega) return setError('Seleccioná cómo querés recibir tu pedido.');
    if (!telefono.trim()) return setError('Ingresá un número de teléfono de contacto.');

    if (requiereEnvio) {
      if (!dir.calle.trim() || !dir.numero.trim() || !dir.ciudad.trim() || !dir.provinciaId) {
        return setError('Completá calle, número, localidad y provincia.');
      }
      if (!cotizacion || !carrierId) return setError('Calculá y elegí un envío.');
      const prov = provincias.find((p) => String(p.id) === String(dir.provinciaId));
      const op = cotizacion.opciones.find((o) => o.carrierId === carrierId);
      return onSubmit({
        tipoEntrega: 'envio',
        telefono: telefono.trim(),
        direccion: {
          pais: 'Argentina',
          provincia: prov?.nombre || '',
          provinciaId: Number(dir.provinciaId),
          ciudad: dir.ciudad.trim(),
          calle: dir.calle.trim(),
          numero: dir.numero.trim(),
          piso: dir.piso.trim(),
          depto: dir.depto.trim(),
          codigoPostal: cotizacion.cp,
          telefono: telefono.trim(),
        },
        // El servidor vuelve a cotizar con estos dos datos: el costo mostrado es solo informativo
        envio: { carrierId, codigoPostal: cotizacion.cp, costoCliente: op?.costoCliente ?? 0, nombre: op?.nombre },
      });
    }
    onSubmit({ tipoEntrega, telefono: telefono.trim() });
  };

  return (
    <div className="p-6 bg-white rounded-xl max-w-md mx-auto text-left max-h-[85vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-1 text-gray-800">¿Cómo recibís tu pedido?</h2>
      <p className="text-sm text-gray-500 mb-5">
        {requiereEnvio
          ? 'Tu pedido incluye productos que se envían a domicilio. Completá la dirección y elegí el envío.'
          : 'Elegí una opción y confirmá tu teléfono de contacto.'}
      </p>

      {!requiereEnvio && (
        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={() => setTipoEntrega('retiro')}
            className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
              tipoEntrega === 'retiro' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
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
              tipoEntrega === 'envio' ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
            }`}
          >
            <span className="text-2xl">🚚</span>
            <span className="font-semibold text-sm text-gray-700">Envío a domicilio</span>
            <span className="text-xs text-gray-400">A coordinar</span>
          </button>
        </div>
      )}

      {requiereEnvio && (
        <div className="mb-5 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <input className={`${inputCls} col-span-2`} placeholder="Calle" value={dir.calle} onChange={set('calle')} />
            <input className={inputCls} placeholder="Número" value={dir.numero} onChange={set('numero')} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Piso (opcional)" value={dir.piso} onChange={set('piso')} />
            <input className={inputCls} placeholder="Depto (opcional)" value={dir.depto} onChange={set('depto')} />
          </div>
          <input className={inputCls} placeholder="Localidad" value={dir.ciudad} onChange={set('ciudad')} />
          <select className={inputCls} value={dir.provinciaId} onChange={set('provinciaId')}>
            <option value="">Provincia</option>
            {provincias.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              className={inputCls}
              inputMode="numeric"
              maxLength={4}
              placeholder="Código postal (4 dígitos)"
              value={dir.codigoPostal}
              onChange={set('codigoPostal')}
            />
            <button
              type="button"
              onClick={cotizar}
              disabled={cotizando}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 whitespace-nowrap"
            >
              {cotizando ? 'Cotizando…' : 'Calcular envío'}
            </button>
          </div>

          {cotizacion && (
            <div className="space-y-2">
              {cotizacion.envioGratis && (
                <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">¡Envío gratis por superar los $100.000!</p>
              )}
              {cotizacion.opciones.map((o) => (
                <label
                  key={o.carrierId}
                  className={`flex items-center justify-between gap-3 border-2 rounded-lg px-3 py-2 cursor-pointer ${
                    carrierId === o.carrierId ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <input type="radio" name="envio" checked={carrierId === o.carrierId} onChange={() => setCarrierId(o.carrierId)} />
                    <span>
                      <span className="font-medium text-gray-800">{o.nombre}</span>
                      {o.estimado && <span className="block text-xs text-gray-500">{o.estimado}</span>}
                    </span>
                  </span>
                  <span className={`text-sm font-semibold ${o.costoCliente === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {o.costoCliente === 0 ? 'Gratis' : fmt(o.costoCliente)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📞</span>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 1122334455"
            className={`${inputCls} pl-9 py-2.5`}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {requiereEnvio ? 'El transportista lo usa para coordinar la entrega.' : 'Te contactamos para coordinar la entrega.'}
        </p>
      </div>

      {error && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex gap-3 mt-2">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
          Cancelar
        </button>
        <button type="button" onClick={handleConfirmar} className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium">
          Confirmar
        </button>
      </div>
    </div>
  );
}
