import { createRoot } from 'react-dom/client';
import FormularioDireccion from './FormularioDireccion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const solicitarNuevaDireccion = () => {
  return new Promise((resolve) => {
    let rootReact;

    MySwal.fire({
      html: '<div id="form-direccion-envio" style="margin-top: 1rem;"></div>',
      showConfirmButton: false,
      customClass: {
        popup: 'swal2-modal p-0' // elimina padding para mejor control del layout si usás Tailwind
      },
      willClose: () => {
        if (rootReact) {
          rootReact.unmount();
        }
      },
      didOpen: () => {
        const root = document.getElementById('form-direccion-envio');
        if (!root) return;

        rootReact = createRoot(root);
        rootReact.render(
          <FormularioDireccion  onSubmit={(data) => { resolve(data); Swal.close();}}  onCancel={() => { resolve(null); Swal.close(); }}/>
        );
      }
    });
  });
};
