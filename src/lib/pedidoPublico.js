// Lo que ve el cliente de su pedido: sin costos ni datos internos del proveedor (New Bytes).
// El admin sigue viendo todo.
const MENSAJE_NB = {
  pendiente_aprobacion: 'Estamos preparando tu pedido',
  procesando: 'Estamos preparando tu pedido',
  error: 'Estamos preparando tu pedido',
  enviado: 'Tu pedido ya fue despachado',
};

/** Devuelve el pedido apto para el cliente (objeto plano o documento de mongoose). */
export function paraCliente(pedido) {
  if (!pedido) return pedido;
  const o = typeof pedido.toObject === 'function' ? pedido.toObject() : { ...pedido };
  const mensaje = MENSAJE_NB[o.nb?.estado];
  delete o.nb;
  if (o.envio) {
    const { costoNB, ...envio } = o.envio; // el costo del proveedor no se muestra
    o.envio = envio;
  }
  if (mensaje) o.seguimiento = mensaje;
  return o;
}
