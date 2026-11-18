'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdStore } from 'react-icons/md';
import { RiShareFill, RiShoppingCart2Line } from 'react-icons/ri';
import { useAuth } from '../../../Hooks/useAuth';
import { parsePrecio } from '../../../Utils/parsePrecio';
import { estaAgotado } from '../../../Utils/estadoProducto';
import { formatearTitulo } from '../../../Utils/formatoTitulo';
import { categoriaUrl, marcaUrl } from '../../../Utils/catalogSlug';

const ENVIO_GRATIS_DESDE = 100000; // mismo umbral que el checkout

/**
 * Ficha de producto (modal y página). Foto grande sobre campo liso, título y precio como lo más grande,
 * una sola acción principal. Sin bordes, sombras ni degradados.
 */
const ProductoDetalle = ({
  selectedProduct,
  mainImage,
  handleThumbnailClick,
  thumbnails,
  handleShare,
  handleAddToCart,
}) => {
  const path = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const p = selectedProduct;
  const agotado = estaAgotado(p);
  const precio = parsePrecio(p.precio);
  const titulo = formatearTitulo(p.titulo_de_producto || p.nombre);
  const envioGratis = !p.usd && precio > ENVIO_GRATIS_DESDE && !agotado;
  const quedan = typeof p.cantidad === 'number' && p.cantidad > 0 && p.cantidad <= 5 ? p.cantidad : null;
  const isPdp = path?.startsWith('/productos/');
  const Titulo = isPdp ? 'h1' : 'h2';

  // En los productos importados la descripción repite el título: no se muestra dos veces
  const descripcion = String(p.descripcion || '').trim();
  const mostrarDescripcion = descripcion && descripcion.toLowerCase() !== String(p.titulo_de_producto || p.nombre || '').trim().toLowerCase();

  const onComprar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(e);
    router.push(user ? '/Shopcart' : '/user/Login');
  };

  const ficha = [
    ['Marca', p.marca ? <Link key="m" href={marcaUrl(p.marca)} className="underline-offset-2 hover:underline">{p.marca}</Link> : null],
    ['Categoría', p.categoria ? <Link key="c" href={categoriaUrl(p.categoria)} className="underline-offset-2 hover:underline">{formatearTitulo(p.categoria)}</Link> : null],
    ['Modelo', p.modelo && p.modelo !== p.cod_producto ? p.modelo : null],
    ['Código', p.cod_producto],
    ['N° de serie', p.n_serie],
    ['Condición', p.usado ? 'Usado' : 'Nuevo'],
  ].filter(([, v]) => v);

  const botonSecundario =
    'inline-flex h-12 items-center justify-center gap-2 bg-gray-100 px-4 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <article className="bg-white antialiased">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        {/* Galería: una foto grande y miniaturas */}
        <div id="imagenes">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={mainImage || '/images/sinFoto.webp'}
              alt={`Imagen principal de ${p.nombre}`}
              fill
              priority={isPdp}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={`object-contain p-6 mix-blend-multiply sm:p-10${agotado ? ' opacity-50 grayscale' : ''}`}
            />
            {agotado && (
              <span className="absolute bottom-0 left-0 bg-red-700 px-4 py-1.5 text-base font-semibold text-white">
                {p.vendido ? 'Vendido' : 'Sin stock'}
              </span>
            )}
            {p.usado && !agotado && (
              <span className="absolute bottom-0 left-0 bg-gray-900 px-4 py-1.5 text-base font-semibold text-white">Usado</span>
            )}
          </div>

          {thumbnails.length > 1 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {thumbnails.map((thumb, index) => {
                const activa = thumb.src === mainImage;
                return (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => handleThumbnailClick(thumb.src)}
                      aria-label={`Mostrar imagen ${index + 1} de ${p.nombre}`}
                      aria-current={activa ? 'true' : undefined}
                      className={`relative block h-20 w-20 bg-gray-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 ${
                        activa ? 'ring-2 ring-gray-900' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={thumb.src} alt="" fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Información y compra */}
        <div className="flex min-w-0 flex-col">
          {p.marca ? (
            <p className="text-base text-gray-700">
              <Link href={marcaUrl(p.marca)} className="underline-offset-2 hover:underline">{p.marca}</Link>
            </p>
          ) : null}

          <Titulo id="modal-title" className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            {titulo}
          </Titulo>

          <p className="mt-6 text-4xl font-extrabold tabular-nums text-gray-900">
            {precio > 0 ? (
              <>
                {precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
                {p.usd ? <span className="ml-2 text-lg font-semibold">USD</span> : null}
              </>
            ) : (
              <span className="text-xl font-medium text-gray-700">Precio a confirmar</span>
            )}
          </p>

          <div className="mt-1 space-y-0.5 text-base">
            {envioGratis && <p className="font-semibold text-green-800">Envío gratis a todo el país</p>}
            {!agotado && quedan ? <p className="font-semibold text-red-700">{quedan === 1 ? 'Queda 1 unidad' : `Quedan ${quedan} unidades`}</p> : null}
            {!agotado && !quedan ? <p className="text-gray-800">Disponible</p> : null}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={onComprar}
              disabled={agotado}
              title="Comprar ahora"
              aria-label="Comprar ahora"
              className={`inline-flex h-14 w-full items-center justify-center gap-2 px-4 text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 ${
                agotado ? 'cursor-not-allowed bg-gray-200 text-gray-600' : 'bg-orange-700 text-white hover:bg-orange-800'
              }`}
            >
              <MdStore size={22} aria-hidden="true" />
              Comprar
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={handleAddToCart} disabled={agotado} title="Agregar al carrito" aria-label="Agregar producto al carrito" className={botonSecundario}>
                <RiShoppingCart2Line size={20} aria-hidden="true" />
                Agregar
              </button>
              <button type="button" onClick={handleShare} title="Compartir producto" aria-label="Compartir producto" className={botonSecundario}>
                <RiShareFill size={18} aria-hidden="true" />
                Compartir
              </button>
            </div>
          </div>

          <ul className="mt-6 space-y-1.5 text-base text-gray-800">
            <li>Envíos a todo el país</li>
            <li>Pagás con Mercado Pago o con transferencia bancaria</li>
          </ul>

          {mostrarDescripcion && (
            <section className="mt-10">
              <h3 className="text-xl font-bold text-gray-900">Descripción</h3>
              <p className="mt-2 max-w-[60ch] whitespace-pre-line text-base leading-relaxed text-gray-800">{descripcion}</p>
            </section>
          )}

          <section className="mt-10">
            <h3 className="text-xl font-bold text-gray-900">Ficha del producto</h3>
            <dl className="mt-3 grid grid-cols-[8rem_minmax(0,1fr)] gap-y-2 text-base">
              {ficha.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-gray-700">{k}</dt>
                  <dd className="break-words font-medium text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </article>
  );
};

export default ProductoDetalle;
