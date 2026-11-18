import toast from 'react-hot-toast';
import { parsePrecio } from './parsePrecio';
import { trackEvent, itemGA4 } from './analytics';

const addToCart = (product, cart, setCart) => {  
    // Productos sin precio válido no se pueden comprar (solo consulta)
    if (parsePrecio(product?.precio) <= 0) {
      toast.error(`${product?.nombre || 'El producto'} no tiene precio publicado. Consultanos por WhatsApp.`);
      return false;
    }
    // Verificamos si el producto ya existe en el carrito actual
    const isProductInCart = cart.some(item => item.cod_producto === product.cod_producto);
    if (isProductInCart) {
      toast.error(`El producto ${product.nombre}, cod:${product.cod_producto} ya se encuentra en el carrito.`);
      return false;
    }
    setCart((currItems) => {
      return [...currItems, { ...product, precio: parsePrecio(product.precio), quantity: 1 }];
    });
    const precioNum = parsePrecio(product.precio);
    trackEvent('add_to_cart', {
      currency: product.usd ? 'USD' : 'ARS',
      value: precioNum,
      items: [itemGA4({ ...product, precio: precioNum }, 1)],
    });
    toast.success(`Agregando ${product.nombre}, cod:${product.cod_producto} al carrito.`);
    return true;
};

export default addToCart;
