// Productos.js
import React from 'react';
import dynamic from 'next/dynamic';

import { Pagination } from "@mui/material";
import useProducts from "../../Hooks/useProducts";
import Cards from './Cards/Cards';

const Dropdown = dynamic(() => import('./Dropdown/Dropdown'));
const Modal = dynamic(() => import('./Modal/Modals'));


export default function Productos() {

  const {
    products,
    selectedProduct,
    isModalOpen,
    totalPages,
    currentPage,
    isLoading,
    handlePageChange,
    closeModal,
    handleProductSelect,
  } = useProducts();

  return (
      <article id="cardsTienda" className="col-span-1 md:col-start-4 md:col-span-9 grid grid-rows-[auto_1fr_auto] min-h-screen">
        {/* Paginación superior */}
        <nav aria-label="Paginación de productos" className="flex flex-col md:flex-row justify-center my-4 gap-4 items-center">
          <Dropdown />
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            siblingCount={1}
            boundaryCount={1}
            size="medium"
            variant="outlined"
            shape="rounded"
            aria-label="Paginación de productos"
            title="Paginación de productos"
          />
        </nav>

        {/* Cards (se mantienen en su lugar sin afectar la paginación) */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Cards handleProductSelect={handleProductSelect} products={products} isLoading={isLoading} />
        </div>

        {isModalOpen && selectedProduct && (
          <Modal closeModal={closeModal} selectedProduct={selectedProduct} />
        )}

        {/* Paginación inferior siempre abajo */}
        <nav aria-label="Paginación de productos" className="flex justify-center py-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            aria-label="Paginación de productos"
            title="Paginación de productos"
          />
        </nav>
      </article>


  );
}
