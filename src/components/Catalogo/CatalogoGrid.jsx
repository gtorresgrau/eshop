import Link from 'next/link';
import { getProductPath } from '../../Utils/productSlug';
import { parsePrecio } from '../../Utils/parsePrecio';
import { estaAgotado } from '../../Utils/estadoProducto';

const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

/**
 * Grilla de catálogo 100% server-side: solo <a> y <img>, sin JS de cliente.
 * Existe para que Google tenga enlaces rastreables hacia cada ficha.
 */
export default function CatalogoGrid({ productos = [] }) {
  if (!productos.length) {
    return (
      <p className="py-16 text-center text-gray-500">
        No hay productos publicados en esta sección por el momento.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {productos.map((p) => {
        const precio = parsePrecio(p.precio);
        const href = getProductPath(p);
        const titulo = p.titulo_de_producto || p.nombre;
        const agotado = estaAgotado(p);
        return (
          <li key={p.cod_producto || p._id} className="list-none">
            <article className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-shadow hover:shadow-lg">
              <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
                <img
                  className={`h-40 w-full object-cover sm:h-48${agotado ? ' grayscale opacity-80' : ''}`}
                  src={p.foto_1_1 || '/images/sinFoto.webp'}
                  alt={titulo}
                  width={320}
                  height={192}
                  loading="lazy"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <h2 className="text-sm font-semibold leading-tight text-gray-900 line-clamp-2">
                  <Link href={href} className="hover:underline">{titulo}</Link>
                </h2>
                {p.marca ? <p className="text-xs text-gray-500">{p.marca}</p> : null}
                {agotado ? <p className="text-xs font-semibold text-red-600">Sin stock</p> : null}
                <p className="mt-auto pt-1 text-right text-sm font-extrabold text-orange-600">
                  {precio > 0
                    ? `${fmt.format(precio)}${p.usd ? ' USD' : ''}`
                    : <span className="text-xs font-normal text-gray-500">Consultar</span>}
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
