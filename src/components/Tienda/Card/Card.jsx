'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../Hooks/useAuth'; 
import { MdStore } from 'react-icons/md';
import { RiWhatsappLine, RiShareFill } from 'react-icons/ri';
import IconShoopingCart from '../ShoopingCart/IconShoopingCart';
import userData from '../../../components/constants/userData';
import addToCart from '../../../Utils/addToCart';
import { CartContext } from '../../../components/Context/ShoopingCartContext';
import Image from 'next/image';
import handleShare from '../../../Utils/handleShare';

const Card = ({ product, handleProductSelect }) => {
  const [cart, setCart] = useContext(CartContext);
  const router = useRouter();
  const { user } = useAuth(); // si no usas este hook, reemplaza por tu fuente de auth

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, cart, setCart);
  };

  const getProductLink = (p) => {
    const nombreURL = p.nombre.replace(/\s+/g, '_');
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/productos/${nombreURL}`;
  };

  const linkProducto = getProductLink(product);

  const consultMessage = `Hola, quería consultar por ${product.nombre} (${product.cod_producto}). Link: ${linkProducto}`;
  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(
    consultMessage || userData.textoPredefinido
  )}`;

  const handleConsult = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(enviar, '_blank');
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

  const agotado = product.vendido || product.stock;

  return (
    <div className={`${product.hide ? 'hidden' : ''} relative sm:w-48 md:w-64 lg:w-56 xl:w-72 lg:h-80 xl:h-96 md:min-h-[320px] min-w-[150px] lg:min-h-[360px] xl:min-h-[420px] list-none cursor-pointer`}>
      <div
        className="relative flex flex-col justify-between w-full h-full bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
        onClick={() => handleProductSelect(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleProductSelect(product)}
      >
        <div>
          <div className="relative aspect-square">
            {product.vendido && (
              <p className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-red-400 bg-opacity-80 rounded-t-lg grayscale">
                VENDIDO
              </p>
            )}
            {product.stock && (
              <p className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-red-400 bg-opacity-80 rounded-t-lg grayscale">
                Sin Stock
              </p>
            )}

            <button
              onClick={handleAddToCart}
              className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 bg-boton-primary hover:bg-green-600 rounded-full text-white z-10"
              disabled={agotado}
            >
              <IconShoopingCart ancho={20} alto={20} color="#ffffff" />
            </button>

            <button
              onClick={(e) => handleShare(e, product)}
              className="absolute top-10 right-1 inline-flex items-center justify-center w-8 h-8 bg-orange-400 hover:bg-boton-primary-hover rounded-full text-white z-10"
              disabled={agotado}
            >
              <RiShareFill />
            </button>

            <Image
              className="rounded-t-lg object-cover"
              src={product.foto_1_1 || '/images/sinFoto.webp'}
              alt={product.nombre}
              width={300}
              height={300}
              loading="lazy"
              title="Imagen del producto"
            />

            <Image
              className="absolute bottom-1 right-1 shadow-md rounded z-10"
              src={product.usado ? '/images/USADO.webp' : '/images/NUEVO.webp'}
              alt={product.usado ? 'producto usado' : 'producto nuevo'}
              width={product.usado ? 112 : 64}
              height={32}
              loading="lazy"
              title="Estado del producto"
            />

            <div className="absolute top-1 left-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
              {Number(product.precio).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
              {product.usd ? ' usd' : ''}
            </div>
          </div>

          <div className="px-4 py-1">
            <h2 className="text-sm font-semibold text-gray-900 md:text-base md:font-bold text-center h-10 md:h-5">
              {product.nombre}
            </h2>
            <p className="text-xs text-gray-700 md:text-base"><strong>Marca:</strong> {product.marca}</p>
            <p className="text-xs text-gray-700 md:text-base h-8">
              <strong>Categoría:</strong> {product.categoria.length > 10 ? `${product.categoria.slice(0, 10)}...` : product.categoria}
            </p>
          </div>
        </div>

        <div className="px-2 pb-1 flex gap-2 justify-center">
          <div className="flex flex-col md:flex-row gap-1 w-full">
            <button
              onClick={handleConsult}
              className="flex items-center justify-center w-full md:w-1/2 px-2 py-1 gap-1 text-white rounded-md shadow bg-primary-whats hover:bg-primary-whatsHover transition duration-300"
              title="Consultar por WhatsApp"
              aria-label="Consultar por WhatsApp"
              type="button"
              disabled={product.vendido}
            >
              <RiWhatsappLine size={14} />
              <span className="md:inline text-base">Consultar</span>
            </button>

            <button
              onClick={handleComprar}
              className={`flex items-center justify-center w-full md:w-1/2 px-2 py-1 gap-1 text-white rounded-md shadow transition duration-300 ${
                agotado ? 'bg-slate-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'
              }`}
              title="Comprar ahora"
              aria-label="Comprar ahora"
              type="button"
              disabled={agotado}
            >
              <MdStore size={16} />
              <span className="md:inline text-base">Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
