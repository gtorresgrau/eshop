
import React from 'react';
import Dropdown from './Dropdown/Dropdown';
import Filtros from './Filtros/Filtros';

export default function Aside({
  handleClearFilters,
  handleCheckboxChange,
  categories,
  showAllCategories,
  selectedCategories,
  setSelectedCategories,
  handleShowAllCategories,
  brands,
  showAllBrands,
  selectedBrands,
  setSelectedBrands,
  handleShowAllBrands,
  isLoading,
}) {

  return (
    <aside id="filtrosTienda" className="col-span-2 md:col-span-3 text-center md:text-start gap-4 m-2" aria-label="Filtros de productos" >
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
        <h2 title="Filtros de productos" className="text-center m-2 text-xl font-semibold">
          FILTROS
        </h2>
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
  );
}
