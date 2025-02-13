"use client";
import React, { Suspense } from 'react';
import { Pagination } from "@mui/material";
import Cards from '@/components/Tienda/Cards/Cards.jsx';
import Modals from "./Modal/Modals";
import Dropdown from "./Dropdown/Dropdown";
import Filtros from "./Filtros/Filtros";
import useProducts from "@/Hooks/useProducts";
import Loading from '../Loading/Loading';

export default function Tienda() {
  const {
    products,
    categories,
    brands,
    selectedCategories,
    selectedBrands,
    showAllCategories,
    showAllBrands,
    selectedProduct,
    isModalOpen,
    totalPages,
    currentPage,
    isLoading,
    handlePageChange,
    handleCheckboxChange,
    handleClearFilters,
    handleShowAllCategories,
    handleShowAllBrands,
    closeModal,
    handleProductSelect,
    setSelectedCategories,
    setSelectedBrands,
  } = useProducts();

  return (
    <Suspense fallback={<Loading />}>
      <main id="productos" className="bg-primary-background min-h-screen">
        <div className="text-center py-4">
          <h2 title="Tienda de Productos" className="mb-8 text-3xl md:text-4xl text-center font-extrabold text-primary uppercase ">Tienda</h2>
          <p className="text-lg max-w-6xl mx-auto">
            Encuentra los mejores productos y servicios informáticos aquí: PC Gamers, PC mini para oficinas, PC profesionales y muchos accesorios para informática.
            Ademas contamos con Servicio de Mantenimiento de Consolas, y armado de computadoras segun tu necesidad. 
          </p>
        </div>

        {/* Paginación superior */}
        <nav aria-label="Paginación de productos" className="flex justify-center my-6">
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

        <section className="grid grid-cols-1 md:grid-cols-12 md:gap-4 max-w-7xl mx-auto md:p-5 font-sans">
          {/* Filtros */}
          <aside id="filtrosTienda" className="col-span-2 md:col-span-3 text-center md:text-start gap-4 m-2" aria-label="Filtros de productos">
            {/* Filtros en móvil */}
            <div className="block w-3/5 mx-auto md:hidden">
              <Dropdown
                handleClearFilters={handleClearFilters}
                handleCheckboxChange={handleCheckboxChange}
                categories={categories}
                showAllCategories={showAllCategories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                handleShowAllCategories={handleShowAllCategories}
                brands={brands}
                showAllBrands={showAllBrands}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                handleShowAllBrands={handleShowAllBrands}
              />
            </div>
            {/* Filtros en escritorio */}
            <div className="hidden md:block">
              <h2 title="Filtros de productos" className="text-center m-2 text-xl font-semibold">FILTROS</h2>
              <Filtros
                handleClearFilters={handleClearFilters}
                handleCheckboxChange={handleCheckboxChange}
                categories={categories}
                showAllCategories={showAllCategories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                handleShowAllCategories={handleShowAllCategories}
                brands={brands}
                showAllBrands={showAllBrands}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                handleShowAllBrands={handleShowAllBrands}
                isLoading={isLoading}
              />
            </div>
          </aside>

          {/* Tarjetas de productos y modal */}
          <article id="cardsTienda" className="col-span-1 md:col-start-4 md:col-span-9 flex justify-around">
            <div>
              <Cards handleProductSelect={handleProductSelect} products={products} isLoading={isLoading} />
              {isModalOpen && selectedProduct && (
                <Modals closeModal={closeModal} selectedProduct={selectedProduct} />
              )}
            </div>
          </article>
        </section>

        {/* Paginación inferior */}
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
      </main>
    </Suspense>
  );
}
