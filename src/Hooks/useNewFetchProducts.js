import { getInLocalStorage, setInLocalStorage } from "../Hooks/localStorage";

// Si el catálogo serializado supera esto, no se guarda en localStorage (cuota ~5 MB): se sigue
// funcionando sin caché en vez de perder los productos.
const MAX_CACHE_CHARS = 2_000_000;

/**
 * @param {{ todos?: boolean }} [opts] todos=true (solo admin): incluye los productos ocultos y los datos internos.
 */
const newFetchProductos = async ({ todos = false } = {}) => {
    const keyDatos = todos ? "productos_admin" : "productos";
    const keyTime = todos ? "productos_admin_timestamp" : "productos_timestamp";
    try {
        const lastUpdate = getInLocalStorage(keyTime);
        const now = Date.now();

        if (lastUpdate && now - lastUpdate < 3 * 60 * 1000) {
            const productosGuardados = getInLocalStorage(keyDatos);
            if (productosGuardados) return productosGuardados;
        }

        const res = await fetch(todos ? "/api/productos?todos=1" : "/api/productos", { credentials: 'include' });
        if (!res.ok) {
            throw new Error(`Error al cargar los productos: ${res.status}`);
        }

        const data = await res.json();
        const productos = Array.isArray(data.productos) ? data.productos : [];

        // El caché es opcional: si no entra o falla, igual se devuelven los productos
        try {
            if (JSON.stringify(productos).length <= MAX_CACHE_CHARS) {
                setInLocalStorage(keyDatos, productos);
                setInLocalStorage(keyTime, now);
            }
        } catch (e) {
            console.warn("[Productos] No se pudo guardar el caché:", e?.name);
        }

        return productos;
    } catch (error) {
        console.error("[Productos] Error en newFetchProductos:", error);
        return [];
    }
};

export const startAutoUpdateProductos = (opts) => {
    newFetchProductos(opts);

    const intervalId = setInterval(() => {
        newFetchProductos(opts);
    }, 3 * 60 * 1000);

    return intervalId;
};

export default newFetchProductos;
