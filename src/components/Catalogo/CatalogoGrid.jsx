import Link from 'next/link';
import { getProductPath } from '../../Utils/productSlug';
import { parsePrecio } from '../../Utils/parsePrecio';
import { estaAgotado } from '../../Utils/estadoProducto';
import { formatearTitulo } from '../../Utils/formatoTitulo';
import { fotoLiviana } from '../../Utils/fotoNB';
import BotonFavorito from '../Tienda/BotonFavorito';

// Solo datos simples hacia el componente de cliente (los documentos de Mongo traen ObjectId y fechas, que no se pueden pasar)
const paraFavorito = (p) => ({
  cod_producto: p.cod_producto, nombre: p.nombre, titulo_de_producto: p.titulo_de_producto, marca: p.marca,
  categoria: p.categoria, precio: p.precio, usd: p.usd, descuento: p.descuento, foto_1_1: p.foto_1_1,
  destacados: p.destacados, usado: p.usado, vendido: p.vendido, stock: p.stock, cantidad: p.cantidad, origen: p.origen,
});

const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// Mismo umbral que el checkout: el envío es gratis cuando el carrito supera este monto
const ENVIO_GRATIS_DESDE = Number(process.env.NB_ENVIO_GRATIS_DESDE) || 100000;

/**
 * Grilla de catálogo 100% server-side: solo <a> y <img>, sin JS de cliente.
 * Existe para que Google tenga enlaces rastreables hacia cada ficha.
 *
 * Cards: la foto va grande sobre un campo de color liso (las fotos de producto vienen sobre fondo
 * blanco, "multiply" las funde con el campo), sin bordes ni sombras. El precio es lo más grande.
 */
export default function CatalogoGrid({ productos = [] }) {
  if (!productos.length) {
    return (
      <p className="py-20 text-lg text-gray-700">
        No hay productos para mostrar en esta sección por el momento.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {productos.map((p, i) => {
        const precio = parsePrecio(p.precio);
        const href = getProductPath(p);
        const titulo = p.titulo_de_producto || p.nombre;
        const agotado = estaAgotado(p);
        const envioGratis = !p.usd && precio > ENVIO_GRATIS_DESDE;
        return (
          <li key={p.cod_producto || p._id} className="list-none">
            <article className="group relative flex h-full flex-col">
              {p.cod_producto ? <BotonFavorito product={paraFavorito(p)} className="absolute right-2 top-2 z-10 h-10 w-10" /> : null}
              <div className="flex aspect-square items-center justify-center overflow-hidden bg-gray-100">
                <img
                  className={`h-full w-full object-contain p-5 mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100${
                    agotado ? ' opacity-50 grayscale' : ''
                  }`}
                  src={fotoLiviana(p.foto_1_1) || '/images/sinFoto.webp'}
                  alt=""
                  width={400}
                  height={400}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>

              <div className="mt-3 flex flex-1 flex-col">
                {p.marca ? <p className="text-sm text-gray-600">{p.marca}</p> : null}
                <h2 className="mt-0.5 text-base font-medium leading-snug text-gray-900 line-clamp-2">
                  {/* Enlace extendido: toda la card es clicable pero el lector de pantalla lee un solo enlace */}
                  <Link href={href} className="after:absolute after:inset-0 after:content-[''] group-hover:underline">
                    {formatearTitulo(titulo)}
                  </Link>
                </h2>

                <p className="mt-auto pt-3 text-xl font-extrabold tabular-nums text-gray-900">
                  {precio > 0 ? (
                    <>
                      {fmt.format(precio)}
                      {p.usd ? <span className="ml-1 text-sm font-semibold">USD</span> : null}
                    </>
                  ) : (
                    <span className="text-base font-medium text-gray-700">Consultar precio</span>
                  )}
                </p>
                {agotado ? (
                  <p className="text-sm font-semibold text-red-700">Sin stock</p>
                ) : envioGratis ? (
                  <p className="text-sm font-semibold text-green-800">Envío gratis</p>
                ) : null}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
