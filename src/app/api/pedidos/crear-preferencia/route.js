//app/api/pedidos/crear-preferencia/route.js
import { MercadoPagoConfig, Preference } from 'mercadopago';
import userData from '../../../../components/constants/userData';
import { calcularCheckout } from '../../../../lib/checkout';
import { getSesion } from '../../../../lib/sesion';


const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 5000 } // opcional
});

export async function POST(req) {
  try {
    //console.log("Iniciando creación de preferencia");
    const sesion = await getSesion();
    if (!sesion) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { headers: { "Content-Type": "application/json" }, status: 401 });
    }
    const uid = sesion.uid; // identidad de la sesión
    const { cart, envio, tipoEntrega } = await req.json();
    //console.log("cart:", cart);
    //console.log("uid:", uid);

    // Precios y envío recalculados en el servidor (no se confía en el navegador)
    const calc = await calcularCheckout({ cart, metodo: 'mercadopago', envio, tipoEntrega: tipoEntrega || 'envio' });
    if (calc.error) {
      return new Response(JSON.stringify({ error: calc.error }), {
        headers: { "Content-Type": "application/json" },
        status: calc.status || 400,
      });
    }

    const items = calc.items.map(item => ({
      id: item.cod_producto,
      title: item.nombre,
      unit_price: item.precioUnitario,
      quantity: item.quantity,
      currency_id: "ARS",
    }));
    if (calc.envio && calc.envio.costoCliente > 0) {
      items.push({
        id: `envio-${calc.envio.carrierId}`,
        title: `Envío (${calc.envio.nombre})`,
        unit_price: calc.envio.costoCliente,
        quantity: 1,
        currency_id: "ARS",
      });
    }

    //console.log("Items para preferencia:", items);

    const preference = new Preference(client);
    const external_reference = `order_${uid}_${new Date().getTime()}`; // Generar referencia externa única
    const response = await preference.create({
      body: {
        items,
        metadata: { uid, cart },
        notification_url: `${userData.urlHttps}/api/pedidos/webhook`,
        external_reference: external_reference,
        back_urls: {
          success: `${userData.urlHttps}/mp/success`,
          failure: `${userData.urlHttps}/mp/failure`,
          pending: `${userData.urlHttps}/mp/pending`,
        },
        auto_return: "approved",
      }
    });

    return new Response(
      JSON.stringify({ init_point: response.init_point, external_reference: response.external_reference }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al generar preferencia" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}