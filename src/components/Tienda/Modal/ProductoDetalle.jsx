'use client';

import Image from "next/image";
import { useAuth } from '../../../Hooks/useAuth';
import { usePathname, useRouter } from "next/navigation";
import { MdStore } from "react-icons/md";
import { RiShareFill } from "react-icons/ri";
import { getInLocalStorage } from "@/Hooks/localStorage"; // ajustá si difiere

const ProductoDetalle = ({
  selectedProduct,
  mainImage,
  handleThumbnailClick,
  thumbnails,
  handleShare,
  handleAddToCart, 
  handleConsult,    
}) => {
  const path = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isClient } = useAuth();
  const agotado = selectedProduct.vendido || !selectedProduct.stock;
  const precioNum = Number(
    typeof selectedProduct.precio === "string"
      ? selectedProduct.precio.replace(/[^\d.,-]/g, "").replace(".", "").replace(",", ".")
      : selectedProduct.precio ?? 0
  );
  const precioFmt = isNaN(precioNum)
    ? ""
    : precioNum.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

  const onComprar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(e);
    router.push(user ? "/Shopcart" : "/user/Login");
  };

  const isPdp = path?.startsWith("/productos/");

  return (
    <article className="py-0 bg-white md:py-4 antialiased">
      <div className="max-w-screen-xl px-2 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-12">
          {/* Imágenes */}
          <div id="imagenes" className="relative shrink-0 max-w-md lg:max-w-lg mx-auto flex flex-col justify-center">
            {selectedProduct.vendido && (
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold shadow-lg bg-red-400 px-2 rounded-md">
                VENDIDO
              </p>
            )}
            <div className="flex justify-center relative">
              <Image
                src={mainImage || "/images/sinFoto.webp"}
                alt={`Imagen principal de ${selectedProduct.nombre}`}
                title={`Imagen principal de ${selectedProduct.nombre}`}
                width={220}
                height={220}
                className="rounded-lg md:w-96 md:h-96 object-cover"
                loading="lazy"
              />
              {precioFmt && (
                <div className="absolute top-1 left-1 text-sm md:text-base bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-3 py-1 rounded-tr-lg rounded-bl-lg shadow-md shadow-orange-300">
                  {precioFmt}
                </div>
              )}
              <button
                onClick={handleShare}
                className="absolute top-1 right-1 inline-flex items-center justify-center w-10 h-10 bg-orange-400 hover:bg-green-600 rounded-full text-white z-10"
                aria-label="Compartir producto"
                title="Compartir producto"
                type="button"
              >
                <RiShareFill />
              </button>
            </div>

            {/* Miniaturas */}
            <div className="flex mt-2 justify-center">
              {thumbnails.map((thumb, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleThumbnailClick(thumb.src)}
                  className="mr-2 border border-gray-200 rounded-lg p-0"
                  aria-label={`Mostrar imagen ${index + 1} de ${selectedProduct.nombre}`}
                  title={`Mostrar imagen ${index + 1} de ${selectedProduct.nombre}`}
                >
                  <Image
                    src={thumb.src}
                    alt={thumb.alt}
                    title={thumb.alt}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Detalles */}
          <div className="flex flex-col mt-2 md:mt-6 lg:mt-0">
            {isPdp ? (
              <h1 id="modal-title" className="text-xl font-semibold text-gray-600 sm:text-2xl">
                {selectedProduct.titulo_de_producto?.toUpperCase()}
              </h1>
            ) : (
              <h2 id="modal-title" className="text-xl font-semibold text-gray-600 sm:text-2xl">
                {selectedProduct.titulo_de_producto?.toUpperCase()}
              </h2>
            )}

            <hr className="my-6 md:my-8 border-gray-200" />

            <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Nombre: </strong>{selectedProduct.nombre}</p>
            <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Marca: </strong>{selectedProduct.marca}</p>
            <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Modelo: </strong>{selectedProduct.modelo}</p>
            <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>N° de Serie: </strong>{selectedProduct.n_serie}</p>
            <p className="mb-1 md:mb-4 text-gray-500 text-start"><strong>Código: </strong>{selectedProduct.cod_producto}</p>
            <p className="mb-1 md:mb-4 text-gray-500 text-start whitespace-pre-line">
              <strong>Descripción: </strong>{selectedProduct.descripcion}
            </p>

            <div className="mt-4 flex flex-col md:flex-row md:items-start md:justify-center gap-2 flex-wrap">
              {/* Comprar */}
              <button
                onClick={onComprar}
                className={`flex items-center justify-center w-full md:w-1/2 px-4 py-2 gap-2 text-white rounded-md shadow transition duration-300 ${
                  agotado ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-hover"
                }`}
                title="Comprar ahora"
                aria-label="Comprar ahora"
                type="button"
                disabled={agotado}
              >
                <MdStore size={18} aria-label="botón para comprar" />
                <span className="text-base">Comprar</span>
              </button>

              {/* Agregar al Carrito */}
              <button
                onClick={handleAddToCart}
                disabled={agotado}
                type="button"
                title="Agregar al carrito"
                aria-label="Agregar producto al carrito"
                className={`flex items-center justify-center w-full md:w-auto px-4 py-2 gap-2 text-gray-700 bg-white border border-gray-300 hover:bg-boton-secondary-hover rounded-lg text-sm font-medium transition ${
                  agotado ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"/>
                </svg>
                <span>Agregar</span>
              </button>

              {/* Consultar WhatsApp */}
              <button
                onClick={handleConsult}   // <-- FIX AQUÍ
                disabled={agotado}
                type="button"
                title="Consultar producto por WhatsApp"
                aria-label="Consultar producto por WhatsApp"
                className={`flex items-center justify-center w-full md:w-auto px-4 py-2 gap-2 text-gray-700 bg-white border border-gray-300 hover:bg-boton-secondary-hover active:bg-boton-secondary-active rounded-lg text-sm font-medium transition ${
                  agotado ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              >
                CONSULTAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductoDetalle;
