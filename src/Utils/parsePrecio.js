/**
 * Normaliza el precio de un producto a Number.
 *
 * En la base los precios se guardan como String (models/product.js) y llegaron
 * valores cargados a mano como "$456726", "456.726", "456.726,50" o "  1234 ".
 * Number("$456726") es NaN y eso rompía el subtotal, MercadoPago y el pedido.
 *
 * @param {*} valor precio crudo (string o number)
 * @returns {number} el precio como número, o 0 si no se puede interpretar
 */
export const parsePrecio = (valor) => {
  if (valor === null || valor === undefined) return 0;
  if (typeof valor === 'number') return Number.isFinite(valor) && valor > 0 ? valor : 0;

  // Dejamos solo dígitos, separadores y el signo menos
  let s = String(valor).replace(/[^\d.,-]/g, '').trim();
  if (!s) return 0;

  const tieneComa = s.includes(',');
  const tienePunto = s.includes('.');

  if (tieneComa && tienePunto) {
    // El separador decimal es el que aparece último: "1.234,56" o "1,234.56"
    const decimal = s.lastIndexOf(',') > s.lastIndexOf('.') ? ',' : '.';
    const miles = decimal === ',' ? '.' : ',';
    s = s.split(miles).join('');
    s = s.replace(decimal, '.');
  } else if (tieneComa) {
    // es-AR: la coma es decimal salvo que sea separador de miles ("456,726")
    const dec = s.split(',').pop();
    s = dec.length === 3 ? s.split(',').join('') : s.replace(',', '.');
  } else if (tienePunto) {
    // "456.726" son miles; "456.72" es decimal
    const dec = s.split('.').pop();
    s = dec.length === 3 ? s.split('.').join('') : s;
  }

  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/** true si el producto tiene un precio válido y comprable */
export const tienePrecio = (producto) => parsePrecio(producto?.precio) > 0;

export default parsePrecio;
