'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from "next/navigation";
import Cards from './Cards/Cards';
import newFetchProductos from '@/Hooks/useNewFetchProducts';
import useProductModal from '@/Hooks/useProductModal';

const Modal = dynamic(() => import('./Modal/Modals'));

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedProduct, isModalOpen, closeModal, handleProductSelect } = useProductModal();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const UPDATE_INTERVAL = 3 * 60 * 1000; // Actualizar cada 3 minutos (ajusta el tiempo según necesidad)

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      const res = await newFetchProductos();

      // Filtrar productos según la búsqueda
      const filteredProducts = searchQuery
        ? res.filter(producto =>
            producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : res;

      setProductos(filteredProducts);
      setIsLoading(false);
    };

    fetchProductos(); // Llamada inicial

    // Configurar el intervalo para actualizar localStorage periódicamente
    const interval = setInterval(async () => {
      //console.log("Actualizando productos en localStorage...");
      const updatedProductos = await newFetchProductos();
      setInLocalStorage('productos', updatedProductos); // Actualiza el localStorage con los nuevos datos
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <article id="productos" className="col-span-1 md:col-start-4 md:col-span-9 grid grid-rows-[auto_1fr_auto] min-h-screen">

      {/* Cards con productos paginados */}
      <div className='md:justify-self-center'>
        <Cards productos={productos} isLoading={isLoading} currentPage={currentPage} handlePageChange={handlePageChange} handleProductSelect={handleProductSelect}/>
      </div>

      {isModalOpen && selectedProduct && (
        <Modal closeModal={closeModal} selectedProduct={selectedProduct} />
      )}
    </article>
  );
}
