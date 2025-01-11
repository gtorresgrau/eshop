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
    vehiculos,
    selectedCategories,
    selectedBrands,
    selectedVehiculos,
    showAllCategories,
    showAllBrands,
    selectedProduct,
    showAllVehiculos,
    isModalOpen,
    totalPages,
    currentPage,
    isLoading,
    handlePageChange,
    handleCheckboxChange,
    handleClearFilters,
    handleShowAllCategories,
    handleShowAllBrands,
    handleShowAllVehiculos,
    closeModal,
    handleProductSelect,
    setSelectedCategories,
    setSelectedBrands,
    setSelectedVehiculos,
  } = useProducts();

  return (
      <Suspense fallback={<Loading/>}>
        <section className="text-center flex flex-col gap-2 bg-primary-background m-w-[1600px] " id="productos">
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            siblingCount={1} 
            boundaryCount={1} 
            size="medium" 
            variant="outlined" 
            shape="rounded" 
            className="flex justify-center my-6" 
          />
          <div className="grid grid-cols-1  md:grid-cols-12 md:gap-4 max-w-7xl mx-auto md:p-5 font-sans" style={{width: '-webkit-fill-available'}}>
            <article id="filtrosTienda" className="col-span-2 md:col-span-3 text-center md:text-start gap-4 m-2">
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
                  vehiculos={vehiculos}
                  handleShowAllVehiculos={handleShowAllVehiculos}
                  showAllVehiculos={showAllVehiculos}
                  selectedVehiculos={selectedVehiculos}
                  setSelectedVehiculos={setSelectedVehiculos}
                />
              </div>
              <div className="hidden md:block">
                <h3 className="text-center m-2">FILTROS</h3>
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
                  vehiculos={vehiculos}
                  handleShowAllVehiculos={handleShowAllVehiculos}
                  showAllVehiculos={showAllVehiculos}
                  selectedVehiculos={selectedVehiculos}
                  setSelectedVehiculos={setSelectedVehiculos}
                />
              </div>
            </article>
            <article id="cardsTienda" className="col-span-1 md:col-start-4 md:col-span-9 flex justify-around">
              <div>
                <Cards handleProductSelect={handleProductSelect} products={products} isLoading={isLoading} />
                {isModalOpen && selectedProduct && (
                  <Modals closeModal={closeModal} selectedProduct={selectedProduct} />
                )}
              </div>
            </article>
          </div>
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={handlePageChange} 
            siblingCount={1} 
            boundaryCount={1} 
            variant="outlined" 
            shape="rounded" 
            className="flex justify-center my-6"
          />
        </section>
      </Suspense>
  );
}
