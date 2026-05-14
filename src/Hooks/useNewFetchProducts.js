import { getInLocalStorage, setInLocalStorage } from "../Hooks/localStorage";

const newFetchProductos = async () => {
    try {
        const lastUpdate = getInLocalStorage("productos_timestamp");
        const now = Date.now();

        if (lastUpdate && now - lastUpdate < 3 * 60 * 1000) {
            const productosGuardados = getInLocalStorage("productos");
            if (productosGuardados) {
                console.log('[Productos] Cache HIT — cantidad:', productosGuardados.length);
                return productosGuardados;
            }
            console.warn('[Productos] Cache timestamp existe pero datos vacíos, recargando...');
        } else {
            console.log('[Productos] Cache MISS — haciendo fetch...');
        }

        const res = await fetch("/api/productos");
        console.log('[Productos] Fetch status:', res.status);

        if (!res.ok) {
            throw new Error(`Error al cargar los productos: ${res.status}`);
        }

        const data = await res.json();
        console.log('[Productos] Respuesta API — keys:', Object.keys(data), '— cantidad:', data.productos?.length ?? 'undefined');

        setInLocalStorage("productos", data.productos);
        setInLocalStorage("productos_timestamp", now);

        return data.productos;
    } catch (error) {
        console.error("[Productos] Error en newFetchProductos:", error);
        return [];
    }
};

export const startAutoUpdateProductos = () => {
    newFetchProductos();

    const intervalId = setInterval(() => {
        newFetchProductos();
    }, 3 * 60 * 1000);

    return intervalId;
};

export default newFetchProductos;
