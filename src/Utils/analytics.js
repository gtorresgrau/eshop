import { parsePrecio } from './parsePrecio';

// Helper minimo para enviar eventos a GA4 (gtag se carga en src/app/layout.jsx).
// Nunca lanza errores: el tracking no debe romper la tienda.
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    const gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    gtag("event", name, params);
  } catch {
    // ignorar
  }
}

export function itemGA4(product, quantity = 1) {
  return {
    item_id: String(product?.cod_producto || product?.producto || product?.nombre || ""),
    item_name: product?.nombre || product?.nombreProducto,
    price: parsePrecio(product?.precio ?? product?.precioUnitario),
    quantity: Number(product?.quantity ?? quantity) || 1,
  };
}
