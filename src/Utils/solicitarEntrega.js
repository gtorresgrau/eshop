import { createRoot } from 'react-dom/client';
import FormularioEntrega from '../components/DashboardCliente/Perfil/FormularioEntrega';
import Swal from 'sweetalert2';

/**
 * Muestra un modal SweetAlert con el selector de tipo de entrega y teléfono.
 * @param {string} telefonoInicial - Teléfono pre-cargado desde los datos de facturación.
 * @returns {Promise<{ tipoEntrega: 'retiro'|'envio', telefono: string } | null>}
 */
export const solicitarEntrega = (telefonoInicial = '') => {
  return new Promise((resolve) => {
    let rootReact = null;

    Swal.fire({
      html: '<div id="form-entrega" style="margin-top: 0.5rem;"></div>',
      showConfirmButton: false,
      padding: '0',
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
