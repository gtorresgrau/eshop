import { createRoot } from 'react-dom/client';
import FormularioEntrega from '../components/DashboardCliente/Perfil/FormularioEntrega';
import Swal from 'sweetalert2';

/** Los productos importados de New Bytes tienen cod_producto "NB-<id>". */
export const esProductoNB = (item) => String(item?.cod_producto || '').startsWith('NB-');

/**
 * Muestra un modal SweetAlert con el selector de tipo de entrega y teléfono.
 * Si el carrito tiene productos de New Bytes pide dirección y cotiza el envío.
 * @param {string} telefonoInicial - Teléfono pre-cargado desde los datos de facturación.
 * @param {{cart?: object[]}} [opts]
 * @returns {Promise<{ tipoEntrega: 'retiro'|'envio', telefono: string, direccion?: object, envio?: object } | null>}
 */
export const solicitarEntrega = (telefonoInicial = '', { cart = [] } = {}) => {
  return new Promise((resolve) => {
    let rootReact = null;
    const requiereEnvio = cart.some(esProductoNB);

    Swal.fire({
      html: '<div id="form-entrega" style="margin-top: 0.5rem;"></div>',
      showConfirmButton: false,
      padding: '0',
      width: requiereEnvio ? 520 : undefined,
      customClass: {
        popup: 'rounded-xl overflow-hidden',
      },
      willClose: () => {
        if (rootReact) rootReact.unmount();
      },
      didOpen: () => {
        const container = document.getElementById('form-entrega');
        if (!container) return;
        rootReact = createRoot(container);
        rootReact.render(
          <FormularioEntrega
            telefonoInicial={telefonoInicial}
            cart={cart}
            requiereEnvio={requiereEnvio}
            onSubmit={(data) => {
              resolve(data);
              Swal.close();
            }}
            onCancel={() => {
              resolve(null);
              Swal.close();
            }}
          />
        );
      },
    });
  });
};
