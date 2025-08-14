import React, { useState, useEffect } from 'react';

// El frontend llamará a la ruta interna del servidor que actúa como proxy
const API_URL = '/api/arca/generate';

const GenerarFacturaArcaModal = ({ pedido, onClose }) => {
  // Inicializar items editables desde pedido: preferir pedido.items (Order model) o pedido.metadata.cart
  const mapPedidoItems = (p) => {
    if (!p) return [];
    if (Array.isArray(p.items) && p.items.length > 0) {
      return p.items.map(it => ({
        descripcion: it.nombreProducto || it.nombre || (it.producto && String(it.producto)) || '',
        cantidad: it.cantidad || 1,
        precio_unitario: it.precioUnitario || it.precio_unitario || it.precio || 0,
        iva: it.iva ?? 21,
      }));
    }
    const cart = p.metadata?.cart || [];
    return cart.map(item => ({
      descripcion: item.titulo_de_producto || item.descripcion || '',
      cantidad: item.quantity || item.cantidad || 1,
      precio_unitario: item.precioUnitario || item.precio_unitario || item.precio || 0,
      iva: item.iva ?? 21,
    }));
  };

  const [loading, setLoading] = useState(false);
  const [factura, setFactura] = useState(null);
  const [error, setError] = useState('');
  const [localItems, setLocalItems] = useState(() => mapPedidoItems(pedido));

  useEffect(() => {
    setLocalItems(mapPedidoItems(pedido));
  }, [pedido]);

  if (!pedido) return null;

  const cuit = pedido.tipoFactura?.cuit || '';

  const handleGenerarFactura = async () => {
    setLoading(true);
    setError('');
    setFactura(null);
    try {
      // Enviamos al backend (que guarda la API key en process.env)
      const payloadItems = localItems.map(i => ({
        descripcion: i.descripcion,
        cantidad: Number(i.cantidad || 1),
        precio_unitario: Number(i.precio_unitario || 0),
        iva: Number(i.iva || 21),
      }));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuit, items: payloadItems, orderId: pedido._id }),
      });
      if (!response.ok) throw new Error('Error al generar la factura');
      const data = await response.json();
      setFactura(data);
    } catch (err) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Generar Factura ARCA</h2>
        <ul className="mb-4 text-sm">
          <li><strong>CUIT:</strong> {cuit}</li>
          <li><strong>Razón Social:</strong> {pedido.tipoFactura?.razonSocial}</li>
          <li><strong>Condición IVA:</strong> {pedido.tipoFactura?.condicionIva}</li>
        </ul>
        <table className="w-full text-xs mb-4">
          <thead>
            <tr>
              <th className="border px-2">Descripción</th>
              <th className="border px-2">Cantidad</th>
              <th className="border px-2">Precio Unitario</th>
              <th className="border px-2">IVA</th>
            </tr>
          </thead>
          <tbody>
            {localItems.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2">{item.descripcion}</td>
                <td className="border px-2 text-center">{item.cantidad}</td>
                <td className="border px-2 text-right">${item.precio_unitario}</td>
                <td className="border px-2 text-center">
                  <select
                    value={item.iva}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setLocalItems(prev => prev.map((p, i) => i === idx ? { ...p, iva: v } : p));
                    }}
                    className="border px-1 py-0 rounded text-sm"
                  >
                    <option value={21}>21%</option>
                    <option value={10.5}>10.5%</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-sm mb-4">
          <strong>Totales:</strong>
          <div className="mt-2">
            {(() => {
              const totals = localItems.reduce((acc, it) => {
                const qty = Number(it.cantidad || 1);
                const price = Number(it.precio_unitario || 0);
                const iva = Number(it.iva || 21);
                const net = qty * price;
                acc.neto += net;
                if (iva === 21) acc.iva21 += net * 0.21;
                else acc.iva105 += net * 0.105;
                return acc;
              }, { neto: 0, iva21: 0, iva105: 0 });
              const neto = totals.neto.toFixed(2);
              const iva21 = totals.iva21.toFixed(2);
              const iva105 = totals.iva105.toFixed(2);
              const total = (Number(neto) + Number(iva21) + Number(iva105)).toFixed(2);
              return (
                <div>
                  <div>Neto: ${neto}</div>
                  <div>IVA 21%: ${iva21}</div>
                  <div>IVA 10.5%: ${iva105}</div>
                  <div className="mt-1 font-bold">Total: ${total}</div>
                </div>
              );
            })()}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cerrar</button>
          <button
            onClick={handleGenerarFactura}
            disabled={loading}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            {loading ? 'Generando...' : 'Generar Factura'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {factura && (
          <div className="mt-4 bg-green-50 p-2 rounded text-xs">
            <b>Factura generada:</b>
            <pre>{JSON.stringify(factura, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerarFacturaArcaModal;