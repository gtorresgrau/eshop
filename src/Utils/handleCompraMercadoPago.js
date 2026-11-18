import { trackEvent, itemGA4 } from "./analytics";
import { parsePrecio } from "./parsePrecio";

const handleComprarMercadoPago = async ( cart, userCompleto ) => {
  trackEvent('begin_checkout', {
    currency: 'ARS',
    value: (cart || []).reduce((acc, it) => acc + parsePrecio(it.precio) * (Number(it.quantity) || 1), 0),
    items: (cart || []).map((it) => itemGA4(it)),
  });

  //console.log('handleComprarMercadoPago called with:', { cart, userCompleto });
  
    const compraResponse = await fetch("/api/pedidos/crear-preferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        cart, 
        uid: userCompleto.uid,
        shippingInfo: { 
          ...userCompleto.direccion,
          nombreCompleto: userCompleto.nombreCompleto,
          telefono: userCompleto.telefono
        }
      }),
    });
    return compraResponse
}

export default handleComprarMercadoPago;

