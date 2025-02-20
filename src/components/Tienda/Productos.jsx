// Productos.js
import React from 'react';
import { Pagination } from "@mui/material";
import Cards from './Cards/Cards';
import Modal from './Modal/Modals';

export default function Productos({
  products,
  isModalOpen,
  selectedProduct,
  isLoading,
  totalPages,
  currentPage,
  handlePageChange,
  handleProductSelect,
  closeModal,
}) {

  return (
    <article id="cardsTienda" className="col-span-1 md:col-start-4 md:col-span-9 flex justify-around" >
      <div>
        {/* Paginación superior */}
        <nav aria-label="Paginación de productos" className="flex justify-center my-4">
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

        <Cards handleProductSelect={handleProductSelect} products={products} isLoading={isLoading} />

        {isModalOpen && selectedProduct && (
          <Modal closeModal={closeModal} selectedProduct={selectedProduct} />
        )}

        {/* Paginación inferior */}
        <nav aria-label="Paginación de productos" className="flex justify-center py-6" >
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
      </div>
    </article>
  );
}
