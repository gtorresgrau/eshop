'use client'
import React, { useContext, useState } from 'react';
import { CartContext } from '@/components/Context/ShoopingCartContext';
import addToCart from '@/Utils/addToCart';
import Link from 'next/link';
import userData from '@/app/constants/userData';

const Modals = ({ selectedProduct, closeModal }) => {
  const [cart, setCart] = useContext(CartContext);
  const [mainImage, setMainImage] = useState(selectedProduct.foto_1_1);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleAddToCart = (e, selectedProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(selectedProduct, cart, setCart);
  };

  const texto = `Hola, queria consultar por ${selectedProduct.nombre} (${selectedProduct.cod_producto}), `;
  const enviar = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent(texto || userData.textoPredefinido)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden">
      <div className="bg-white p-2 md:p-6 rounded-none lg:rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
        <div className="flex justify-end">
          <button type="button" onClick={closeModal} className="text-gray-400 bg-gray-200 hover:bg-gray-300 hover:text-gray-500 rounded-lg text-sm w-10 h-10 ms-auto inline-flex justify-center items-center" aria-label='cerrar la ventana'>
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
        <section className=" py-0 bg-white md:py-16 antialiased">
          <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div id='imagenes' className="shrink-0 max-w-md lg:max-w-lg mx-auto flex flex-col justify-center">
                <div className="flex justify-center">
                  <img className="rounded-lg md:w-96 md:h-96" src={mainImage?mainImage:'/images/sinFoto.webp'} alt={selectedProduct.nombre} width={220} height={220} loading='lazy'/>
                </div>
                <div className="flex mt-2 justify-center">
                  {selectedProduct.foto_1_1 && <img className="w-16 h-16 cursor-pointer rounded-lg mr-2 border border-gray-200" src={selectedProduct.foto_1_1} alt={`${selectedProduct.nombre}-thumbnail-1`} onClick={() => handleThumbnailClick(selectedProduct.foto_1_1)} loading='lazy' title={`${selectedProduct.nombre}-thumbnail-1`}/>}
                  {selectedProduct.foto_1_2 && <img className="w-16 h-16 cursor-pointer rounded-lg mr-2 border border-gray-200" src={selectedProduct.foto_1_2} alt={`${selectedProduct.nombre}-thumbnail-2`} onClick={() => handleThumbnailClick(selectedProduct.foto_1_2)} loading='lazy' title={`${selectedProduct.nombre}-thumbnail-2`}/>}
                  {selectedProduct.foto_1_3 && <img className="w-16 h-16 cursor-pointer rounded-lg mr-2 border border-gray-200" src={selectedProduct.foto_1_3} alt={`${selectedProduct.nombre}-thumbnail-3`} onClick={() => handleThumbnailClick(selectedProduct.foto_1_3)} loading='lazy' title={`${selectedProduct.nombre}-thumbnail-3`} />}
                  {selectedProduct.foto_1_4 && <img className="w-16 h-16 cursor-pointer rounded-lg border border-gray-200" src={selectedProduct.foto_1_4} alt={`${selectedProduct.nombre}-thumbnail-4`} onClick={() => handleThumbnailClick(selectedProduct.foto_1_4)} loading='lazy' title={`${selectedProduct.nombre}-thumbnail-4`}/>}
                </div>
              </div>

              <div className="flex flex-col mt-2 md:mt-6 lg:mt-0">
                <h2 className="text-xl font-semibold text-gray-600 sm:text-2xl">{selectedProduct.titulo_de_producto?.toUpperCase()}</h2>
                <hr className="my-6 md:my-8 border-gray-200" />
                <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Nombre: </strong>{selectedProduct.nombre}</p>
                <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Vehiculo: </strong>{selectedProduct.vehiculo}</p>
                <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Marca: </strong>{selectedProduct.marca}</p>
                <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Modelo: </strong>{selectedProduct.modelo}</p>
                <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>N° de Serie: </strong>{selectedProduct.n_serie}</p>
                <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Codigo: </strong>{selectedProduct.cod_producto}</p>
                <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Descripcion: </strong>{selectedProduct.descripcion}</p>
                <div className="mt-1 md:mt-4 gap-2 items-center flex flex-col md:flex-row justify-center md:items-start">
                  <button onClick={(e) => handleAddToCart(e, selectedProduct)} title="Agregar al carrito" className="text-gray-500 mt-2 md:mt-4 py-2  hover:bg-boton-secondary-hover font-medium rounded-lg text-sm px-10 flex items-center justify-center" role="button" aria-label='agregar al carrito'>
                    <svg className="w-5 h-5 -ms-2 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6" />
                    </svg>
                    AGREGAR
                  </button>
                  <Link href={enviar} title="consultar" className="text-gray-500 mt-2 md:mt-4 py-2 hover:bg-boton-secondary-hover active:bg-boton-secondary-active font-medium rounded-lg text-sm px-10  flex items-center justify-center" role="button" target="_blank">
                    CONSULTAR
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Modals;
