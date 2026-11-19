'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Hooks/useAuth';
import { MdStore } from 'react-icons/md';
import { RiShareFill } from 'react-icons/ri';
import IconShoopingCart from '../ShoopingCart/IconShoopingCart';
import addToCart from '../../../Utils/addToCart';
import { CartContext } from '../../../components/Context/ShoopingCartContext';
import Image from 'next/image';
import handleShare from '../../../Utils/handleShare';
import { getProductPath } from '../../../Utils/productSlug';
import { parsePrecio } from '../../../Utils/parsePrecio';
import { estaAgotado } from '../../../Utils/estadoProducto';
import { formatearTitulo } from '../../../Utils/formatoTitulo';
import { fotoLiviana } from '../../../Utils/fotoNB';
import BotonFavorito from '../BotonFavorito';

const ENVIO_GRATIS_DESDE = 100000; // mismo umbral que el checkout

const Card = ({ product, handleProductSelect }) => {
  const [cart, setCart] = useContext(CartContext);
  const router = useRouter();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, cart, setCart);
  };

  // URL real de la ficha: la necesita Google para rastrear e indexar el producto.
  // El <a> es para el crawler; en el navegador interceptamos y abrimos el modal.
  // Ctrl/Cmd/Shift/click medio siguen abriendo la ficha en otra pestaña.
  const productPath = getProductPath(product);
  const handleNavigate = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
      e.stopPropagation();
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    handleProductSelect(product);
  };

  const handleComprar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, cart, setCart);
    if (user) {
      router.push('/Shopcart');
    } else {
      router.push('/user/Login');
    }
  };

  const agotado = estaAgotado(product);
  const precio = parsePrecio(product.precio);
  const envioGratis = !product.usd && precio > ENVIO_GRATIS_DESDE && !agotado;

  // Botones cuadrados sobre la foto: fondo blanco liso, sin sombra
  const botonFoto =
    'absolute right-2 z-10 inline-flex h-10 w-10 items-center justify-center bg-white text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 disabled:opacity-40';

  return (
    <div className={`${product.hide ? 'hidden' : ''} relative w-full list-none`}>
      <div
        className="group relative flex h-full cursor-pointer flex-col bg-white"
        onClick={() => handleProductSelect(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleProductSelect(product)}
      >
        {/* Foto grande sobre un campo liso; las fotos de producto (fondo blanco) se funden con él */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            className={`object-contain p-5 mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100${
              agotado ? ' opacity-50 grayscale' : ''
            }`}
            src={fotoLiviana(product.foto_1_1) || '/images/sinFoto.webp'}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            loading="lazy"
          />

          {product.destacados && !agotado && (
            <span className="absolute left-0 top-0 z-10 bg-orange-700 px-3 py-1 text-sm font-semibold text-white">Destacado</span>
          )}
          {product.usado && (
            <span className="absolute bottom-0 left-0 z-10 bg-gray-900 px-3 py-1 text-sm font-semibold text-white">Usado</span>
          )}
          {agotado && (
            <span className="absolute bottom-0 left-0 z-10 bg-red-700 px-3 py-1 text-sm font-semibold text-white">
              {product.vendido ? 'Vendido' : 'Sin stock'}
            </span>
          )}

          <BotonFavorito product={product} className="absolute right-2 top-2 z-10 h-10 w-10" />
          <button
            type="button"
            onClick={handleAddToCart}
            className={`${botonFoto} top-14`}
            disabled={agotado}
            aria-label="Agregar al carrito"
            title="Agregar al carrito"
          >
            <IconShoopingCart ancho={20} alto={20} color="#111827" />
          </button>
          <button
            type="button"
            onClick={(e) => handleShare(e, product)}
            className={`${botonFoto} top-[6.5rem]`}
            disabled={agotado}
            aria-label="Compartir producto"
            title="Compartir"
          >
            <RiShareFill size={18} />
          </button>
        </div>

        <div className="mt-3 flex flex-1 flex-col">
          {product.marca ? <p className="text-sm text-gray-600">{product.marca}</p> : null}
          <h2 className="mt-0.5 min-h-[2.75rem] text-base font-medium leading-snug text-gray-900 line-clamp-2">
            <a href={productPath} onClick={handleNavigate} className="group-hover:underline focus:outline-none focus:underline">
              {formatearTitulo(product.nombre)}
            </a>
          </h2>

          <p className="pt-2 text-xl font-extrabold tabular-nums text-gray-900">
            {precio > 0 ? (
              <>
                {precio.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })}
                {product.usd ? <span className="ml-1 text-sm font-semibold">USD</span> : null}
              </>
            ) : (
              <span className="text-base font-medium text-gray-700">Consultar precio</span>
            )}
          </p>
          <p className="min-h-5 text-sm font-semibold text-green-800">{envioGratis ? 'Envío gratis' : ''}</p>
        </div>

        <button
          type="button"
          onClick={handleComprar}
          className={`mt-3 inline-flex h-11 w-full items-center justify-center gap-2 px-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 ${
            agotado ? 'cursor-not-allowed bg-gray-200 text-gray-600' : 'bg-orange-700 text-white hover:bg-orange-800'
          }`}
          title="Comprar ahora"
          aria-label="Comprar ahora"
          disabled={agotado}
        >
          <MdStore size={18} />
          Comprar
        </button>
      </div>
    </div>
  );
};

export default Card;
