/**
 * En esta base `stock: true` significa SIN stock (campo invertido) y `vendido`
 * marca productos ya vendidos. Centralizado para no repetir la regla.
 */
export const estaAgotado = (p) =>
  Boolean(p?.vendido) || p?.stock === true || (typeof p?.cantidad === 'number' && p.cantidad <= 0);
