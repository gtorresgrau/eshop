'use client';
import React, { useContext } from 'react';
import { MdStore } from 'react-icons/md';
import { RiWhatsappLine } from 'react-icons/ri';
import IconShoopingCart from '../ShoopingCart/IconShoopingCart';
import userData from '@/app/constants/userData';
import addToCart from '@/Utils/addToCart';
import { CartContext } from '@/components/Context/ShoopingCartContext';
import Link from 'next/link';

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

  const iconProps = { ancho: 20, alto: 20, color: '#ffffff' };

  const consultMessage = `Hola, quería consultar por ${product.nombre} (${product.cod_producto})`;
  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(
    consultMessage || userData.textoPredefinido
  )}`;

  return (
    <li className="relative xs:w-44 sm:w-48 md:w-64 lg:w-56 xl:w-72 lg:h-80 xl:h-96 sm:min-h-[320px] md:min-h-[430px] lg:min-h-[420px] xl:min-h-[465px] list-none cursor-pointer">
      <div
        className="relative flex flex-col justify-between w-full h-full bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
        onClick={() => handleProductSelect(product)}
        role="button"
        tabIndex="0"
        aria-label={`Ver detalles del producto ${product.nombre}`}
        title={`Ver detalles del producto ${product.nombre}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleProductSelect(product);
        }}
      >
        <div>
          <div className="relative">
            {/* Contenedor con relación de aspecto para reservar espacio */}
            <div className="relative aspect-w-4 aspect-h-3">
              {product.vendido && (
                <p className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-red-400 bg-opacity-80 rounded-t-lg grayscale">
                  VENDIDO
                </p>
              )}
              <button
                onClick={handleAddToCart}
                className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active rounded-full text-white z-10"
                aria-label="Agregar al carrito"
                title="Agregar al carrito"
                type="button"
                disabled={!!product.vendido}
              >
                <IconShoopingCart {...iconProps} />
              </button>
              <img
                className="rounded-t-lg w-full h-full object-cover"
                src={product.foto_1_1 || '/images/sinFoto.webp'}
                alt={product.nombre}
                title={product.nombre}
                // Se definen ancho y alto para reservar espacio en el layout
                width={400}
                height={300}
                loading="lazy"
              />
              <img
                className={`absolute bottom-1 right-1 rounded-md z-10 ${product.usado ? 'w-28' : 'w-16'}`}
                src={product.usado ? '/images/USADO.webp' : '/images/NUEVO.webp'}
                alt={product.usado ? 'producto usado' : 'producto nuevo'}
                title={product.usado ? 'producto usado' : 'producto nuevo'}
                width={product.usado ? 112 : 64} // valores en píxeles aproximados
                height={32}
                loading="lazy"
              />
              <div
                className="absolute top-1 left-1 text-sm md:text-base bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg shadow-md shadow-orange-300"
                aria-label={`Precio: ${Number(product.precio).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                })}${product.usd ? ' usd' : ''}`}
                title={`Precio: ${Number(product.precio).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                })}${product.usd ? ' usd' : ''}`}
              >
                {Number(product.precio).toLocaleString('es-AR', {
                  style: 'currency',
                  currency: 'ARS',
                })}
                {product.usd ? ' usd' : ''}
              </div>
            </div>
            <p
              className="mt-2 text-end text-gray-700 px-2 font-extralight text-xs z-10"
              aria-label={`Código: ${product.cod_producto}`}
              title={`Código: ${product.cod_producto}`}
            >
              <strong>Cod: </strong>
              {product.cod_producto}
            </p>
          </div>
          <div className="px-4 py-1">
            <div className="mb-1 min-h-[2.5rem]">
              <h2
                className="text-sm font-semibold tracking-tight text-gray-900 md:text-base md:font-bold"
                title={product.nombre}
              >
                {product.nombre}
              </h2>
            </div>
            <div className="pb-1 text-left">
              <p
                className="hidden text-xs text-gray-700 md:block md:text-base"
                title={`Marca: ${product.marca}`}
                aria-label={`Marca: ${product.marca}`}
              >
                <strong>Marca:</strong> {product.marca}
              </p>
              <p
                className="hidden text-xs text-gray-700 md:block md:text-base"
                title={`Categoría: ${product.categoria}`}
                aria-label={`Categoría: ${product.categoria}`}
              >
                <strong>Categoría:</strong>{' '}
                {product.categoria.length > 10 ? `${product.categoria.slice(0, 10)}...` : product.categoria}
              </p>
              {/* <p
                className="hidden text-xs text-gray-700 md:block md:text-base"
                title={`Producto: ${product.n_serie}`}
                aria-label={`Producto: ${product.n_serie}`}
              >
                <strong>Product:</strong>{' '}
                {String(product.n_serie).length > 6 ? `${String(product.n_serie).slice(0, 6)}...` : product.n_serie}
              </p> */}
            </div>
          </div>
        </div>
        <div className="px-2 pb-1">
          {product.n_electronica ? (
            <>
              {/* Version para pantallas md */}
              <div className="hidden md:flex xl:hidden justify-between gap-2 text-xs xl:text-sm">
                <Link
                  href={product.n_electronica}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver producto en Shop"
                  aria-label="Ver producto en Shop"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                  <MdStore size={16} /> <span>Shop..</span>
                </Link>
                <button
                  onClick={handleConsult}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow transition duration-300 ${
                    product.vendido ? 'bg-slate-500' : 'bg-primary-whats hover:bg-primary-whatsHover'
                  }`}
                  title="Consultar por WhatsApp"
                  aria-label="Consultar por WhatsApp"
                  type="button"
                  disabled={!!product.vendido}
                >
                  <RiWhatsappLine size={16} /> <span>Cons...</span>
                </button>
              </div>
              {/* Versión para pantallas xl */}
              <div className="hidden xl:flex justify-between gap-2 text-xs xl:text-sm">
                <Link
                  href={product.n_electronica}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver producto en MercadoShop"
                  aria-label="Ver producto en MercadoShop"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200"
                >
                  <MdStore size={16} /> <span>MercadoShop</span>
                </Link>
                <button
                  onClick={handleConsult}
                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow transition duration-300 ${
                    product.vendido ? 'bg-slate-500' : 'bg-primary-whats hover:bg-primary-whatsHover'
                  }`}
                  title="Consultar por WhatsApp"
                  aria-label="Consultar por WhatsApp"
                  type="button"
                  disabled={!!product.vendido}
                >
                  <RiWhatsappLine size={16} /> <span>Consultar</span>
                </button>
              </div>
              {/* Versión para pantallas pequeñas */}
              <div className="flex md:hidden justify-around gap-2">
                <Link
                  href={product.n_electronica}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver producto en Shop"
                  aria-label="Ver producto en Shop"
                  className="flex items-center justify-center w-16 h-10 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-200"
                >
                  <MdStore size={16} />
                </Link>
                <button
                  onClick={handleConsult}
                  className={`flex items-center justify-center w-16 h-10 text-white rounded-full shadow transition duration-300 ${
                    product.vendido ? 'bg-slate-500' : 'bg-primary-whats hover:bg-primary-whatsHover'
                  }`}
                  title="Consultar por WhatsApp"
                  aria-label="Consultar por WhatsApp"
                  type="button"
                  disabled={!!product.vendido}
                >
                  <RiWhatsappLine size={16} />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleConsult}
              className={`flex items-center justify-center w-full px-4 py-2 gap-2 text-white rounded-lg shadow transition duration-300 ${
                product.vendido ? 'bg-slate-500' : 'bg-primary-whats hover:bg-primary-whatsHover'
              }`}
              title="Consultar por WhatsApp"
              aria-label="Consultar por WhatsApp"
              type="button"
              disabled={!!product.vendido}
            >
              <RiWhatsappLine size={16} /> <span>Consultar</span>
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default Card;
