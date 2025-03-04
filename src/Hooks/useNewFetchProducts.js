import { getInLocalStorage, setInLocalStorage } from "../Hooks/localStorage";

const newFetchProductos = async () => {
    try {
        const productosGuardados = getInLocalStorage('productos');
        if (productosGuardados !== null) {  // Evita el error si `productosGuardados` es `null`
            //  console.log("Productos desde localStorage:", productosGuardados);
            return productosGuardados;
        }
        const res = await fetch('/api/productos');
        //console.log("Estado de la respuesta:", res.status);
        const data = await res.json();
        //console.log("Contenido de la respuesta:", data);
        if (!res.ok) {
            throw new Error('Error al cargar los productos');
        }
        setInLocalStorage('productos', data.productos);
        return data.productos;
    } catch (error) {
        console.error("Error en newFetchProductos:", error);
        return [];
    }
};

  
  export default newFetchProductos

  