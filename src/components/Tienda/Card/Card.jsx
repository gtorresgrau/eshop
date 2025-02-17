'use client';

import React, { useContext } from 'react';
import { MdStore } from 'react-icons/md';
import { RiWhatsappLine } from 'react-icons/ri';
import IconShoopingCart from '../ShoopingCart/IconShoopingCart';
import userData from '@/app/constants/userData';
import addToCart from '@/Utils/addToCart';
import { CartContext } from '@/components/Context/ShoopingCartContext';
import Link from 'next/link';
import Image from 'next/image';

const Card = ({ product, handleProductSelect }) => {
  const [cart, setCart] = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, cart, setCart);
  };

  const handleConsult = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(enviar, '_blank');
  };

  const consultMessage = `Hola, quería consultar por ${product.nombre} (${product.cod_producto})`;
  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(
    consultMessage || userData.textoPredefinido
  )}`;

  return (
    <li className="relative w-44 sm:w-48 md:w-64 lg:w-56 xl:w-72 lg:h-80 xl:h-96 min-h-[320px] md:min-h-[430px] lg:min-h-[420px] xl:min-h-[465px] cursor-pointer">
      <div
        className="relative flex flex-col justify-between w-full h-full bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
        onClick={() => handleProductSelect(product)}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => e.key === 'Enter' && handleProductSelect(product)}
      >
        <div>
          <div className="relative aspect-[4/3]">
            {product.vendido && (
              <p className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-red-400 bg-opacity-80 rounded-t-lg grayscale">
                VENDIDO
              </p>
            )}
            <button
              onClick={handleAddToCart}
              className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 bg-boton-primary hover:bg-boton-primary-hover rounded-full text-white z-10"
              disabled={!!product.vendido}
            >
              <IconShoopingCart ancho={20} alto={20} color="#ffffff" />
            </button>
            <Image
              className="rounded-t-lg w-full h-full object-cover aspect-[4/3]"
              src={product.foto_1_1 || '/images/sinFoto.webp'}
              alt={product.nombre}
              width={400}
              height={300}
              loading="lazy"
            />
            <Image
              className="absolute bottom-1 right-1 rounded-md z-10"
              src={product.usado ? '/images/USADO.webp' : '/images/NUEVO.webp'}
              alt={product.usado ? 'producto usado' : 'producto nuevo'}
              width={product.usado ? 112 : 64}
              height={32}
              loading="lazy"
            />
            <div className="absolute top-1 left-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg shadow-md">
              {Number(product.precio).toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS',
              })}
              {product.usd ? ' usd' : ''}
            </div>
          </div>
          <div className="px-4 py-1">
            <h2 className="text-sm font-semibold text-gray-900 md:text-base md:font-bold">{product.nombre}</h2>
            <p className="text-xs text-gray-700 md:text-base">
              <strong>Marca:</strong> {product.marca}
            </p>
            <p className="text-xs text-gray-700 md:text-base">
              <strong>Categoría:</strong> {product.categoria}
            </p>
          </div>
        </div>
        <div className="px-2 pb-1 flex justify-between gap-2">
          <Link
            href={product.n_electronica || '#'}
            passHref
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            <MdStore size={16} /> <span>Ver en Shop</span>
          </Link>
          <button
            onClick={handleConsult}
            className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow transition ${
              product.vendido ? 'bg-slate-500' : 'bg-primary-whats hover:bg-primary-whatsHover'
            }`}
            disabled={!!product.vendido}
          >
            <RiWhatsappLine size={16} /> <span>Consultar</span>
          </button>
        </div>
      </div>
    </li>
  );
};

export default Card;
