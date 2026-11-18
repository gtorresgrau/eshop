// Cotización del dólar más cara del día (la de mayor valor de venta entre
// oficial, blue, bolsa, CCL, mayorista, cripto y tarjeta), desde dolarapi.com.
// Devuelve null si el servicio no responde: quien llama decide cómo seguir.
export async function dolarMasCaro() {
  try {
    const res = await fetch('https://dolarapi.com/v1/dolares', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const lista = await res.json();
    const validas = (Array.isArray(lista) ? lista : []).filter((c) => Number.isFinite(c?.venta) && c.venta > 0);
    if (!validas.length) return null;
    const max = validas.reduce((a, b) => (b.venta > a.venta ? b : a));
    return { tasa: max.venta, nombre: max.nombre, fecha: max.fechaActualizacion ?? null };
  } catch {
    return null;
  }
}
