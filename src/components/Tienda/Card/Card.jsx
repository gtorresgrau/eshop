'use client'
import React, { useContext } from 'react';
import { MdStore } from 'react-icons/md';
import { RiWhatsappLine } from "react-icons/ri";
import IconShoopingCart from '../ShoopingCart/IconShoopingCart';
import userData from '@/app/constants/userData';
import addToCart from '@/Utils/addToCart';
import { CartContext } from '@/components/Context/ShoopingCartContext';
import Link from 'next/link';

const Card = ({ product, handleProductSelect }) => {
  
  const [ cart, setCart ] = useContext(CartContext);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, cart, setCart)
  };

  const handleConsult = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    window.open(enviar, '_blank');
  }
  
  const icon = {
    ancho: 20,
    alto: 20,
    color: '#ffffff'
  };

  const texto = `Hola, queria consultar por ${product.nombre} (${product.cod_producto}), `;
  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(texto || userData.textoPredefinido)}`;

  //console.log('producto:',product)
  return (
      <li className='relative w-36 xs:w-40 sm:w-48 md:w-64 lg:w-56 xl:w-72 lg:h-80 xl:h-96  sm:min-h-[320px]   md:min-h-[430px]  lg:min-h-[420px] xl:min-h-[465px] list-none cursor-pointer'>
        <div className="relative flex flex-col justify-between w-full h-full bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300" onClick={() => handleProductSelect(product)}>
          <div>
          <div>
            <div className="flex justify-center relative">
              <button onClick={(e)=>handleAddToCart(e,product)} className="absolute top-1 right-1 inline-flex items-center justify-center w-8 h-8 bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active rounded-full text-white z-10">
                <IconShoopingCart ancho={icon.ancho} alto={icon.alto} color={icon.color} aria-label="agregar al carrito" />
              </button>
              <img className="rounded-t-lg w-full xs:w-36 xs:h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 xl:w-64 xl:h-64 p-1 md:w-60 md:h-60 object-cover" src={product.foto_1_1 ? product.foto_1_1 : '/images/sinFoto.webp'} alt={product.nombre} title={product.nombre} loading="lazy" />
            </div>
            <p className="top-[-20px] text-end text-gray-700 px-2 font-extralight text-xs z-10"><strong>Cod: </strong>{product.cod_producto}</p>
          </div>
          <div className='px-4 py-1'>
            <h2 className="mb-1 text-lg font-bold tracking-tight text-gray-900">{product.nombre}</h2>
            <div className="pb-2 text-left">
              <p className="text-xs md:text-base text-gray-700"><strong>Marca:</strong> {product.marca}</p>
              <p className="hidden md:block text-xs md:text-base text-gray-700"><strong>Categoría:</strong>{product.categoria.length > 15 ? `${product.categoria.slice(0, 15)}...` : product.categoria}</p>
              <p className="block text-xs md:text-base text-gray-700"><strong>N° Serie:</strong>
              {String(product.n_serie).length > 6
                ? `${String(product.n_serie).slice(0, 6)}...`
                : product.n_serie}</p>
            </div>
          </div>
          </div>
          <div className="px-2 pb-2">
            {/* Si `product.n_electronica` está disponible */}
            {product.n_electronica ? (
              <>
                {/* Pantallas `md` o más grandes: Mostrar ambos botones */}
                <div className="hidden md:flex xl:hidden justify-between gap-2 text-xs xl:text-sm">
                  <Link href={product.n_electronica} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200">
                      <MdStore size={16} /> Shop..
                    </button>
                  </Link>
                  <button onClick={handleConsult} className="flex items-center gap-2 px-4 py-2 bg-primary-whats text-white rounded-lg shadow hover:bg-primary-whatsHover transition duration-300" target="_blank" >
                    <RiWhatsappLine size={16} /> Cons...
                  </button>
                </div>
                <div className="hidden xl:flex justify-between gap-2 text-xs xl:text-sm">
                  <Link href={product.n_electronica} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200">
                      <MdStore size={16} /> MercadoShop
                    </button>
                  </Link>
                  <button onClick={handleConsult} className="flex items-center gap-2 px-4 py-2 bg-primary-whats text-white rounded-lg shadow hover:bg-primary-whatsHover transition duration-300" target="_blank" >
                    <RiWhatsappLine size={16} /> Consultar
                  </button>
                </div>

                {/* Pantallas más pequeñas: Mostrar solo los íconos */}
                <div className="flex md:hidden justify-around gap-2">
                  <Link href={product.n_electronica} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition duration-200">
                      <MdStore size={16} />
                    </button>
                  </Link>
                  <button
                    onClick={handleConsult}
                    className="flex items-center justify-center w-10 h-10 bg-primary-whats text-white rounded-full shadow hover:bg-primary-whatsHover transition duration-300"
                    target="_blank"
                  >
                    <RiWhatsappLine size={16} />
                  </button>
                </div>
              </>
            ) : (
              // Si no tiene `product.n_electronica`, mostrar solo el botón "Consultar" ocupando todo el ancho
              <button
                onClick={handleConsult}
                className="flex items-center justify-center w-full px-4 py-2 bg-primary-whats text-white rounded-lg shadow hover:bg-primary-whatsHover transition duration-300"
                target="_blank"
              >
                <RiWhatsappLine size={16} /> Consultar
              </button>
            )}
          </div>
        </div>
      </li>
  );
}

export default Card;
