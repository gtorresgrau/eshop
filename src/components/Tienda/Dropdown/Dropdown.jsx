'use client'
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import useProducts from "@/Hooks/useProducts";


const Dropdown = () => {
  const {
    categories,
    brands,
    selectedCategories,
    selectedBrands,
    showAllCategories,
    showAllBrands,
    handleCheckboxChange,
    handleClearFilters,
    handleShowAllCategories,
    handleShowAllBrands,
    setSelectedCategories,
    setSelectedBrands,
  } = useProducts();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const filterLimit = isMobile ? 5 : 15;

  // Función para cerrar todos los dropdowns
  const closeDropdowns = () => {
    setIsCategoriesOpen(true);
    setIsBrandsOpen(true);
  };

  // Función para toggle del drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    closeDropdowns();
  };

  
  return (
    <div>
      <button
        onClick={toggleDrawer}
        className="text-white bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active font-medium rounded-lg text-xs sm:text-sm px-5 py-2.5 text-center w-full justify-center inline-flex items-center h-10"
        type="button"
        aria-label="filtrar"
      >
        FILTROS
      </button>

      <div
        className={`fixed inset-0 flex z-50 transition-transform duration-300 ${
          isDrawerOpen ? "transform-none" : "transform -translate-x-full"
        }`}
      >
        {isDrawerOpen && (
          <div className="fixed inset-0" onClick={toggleDrawer}></div>
        )}
        <div className="relative bg-white w-64 h-full overflow-y-auto shadow-xl flex flex-col text-start">
          <div  className="text-white bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active font-medium text-sm px-4 py-4 w-full ">FILTROS</div>
          <button
            onClick={toggleDrawer}
            aria-label="menu navbar"
            type="button"
            aria-controls="drawer-navigation"
            className="bg-gray-300 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center "
          >
            <svg
              className="w-3 h-3"
              aria-hidden="flecha para cerrar"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
          <hr />
          <button
            onClick={handleClearFilters}
            className="text-white bg-boton-primary hover:bg-boton-primary-hover active:bg-boton-primary-active font-medium text-sm px-4 py-2 w-full "
            aria-label="limpiar filtros"
          >
            LIMPIAR FILTROS
          </button>

          <ul className="py-2 text-sm text-gray-700">
            <li>
              <button
                className="flex font-medium place-items-center w-full text-left px-4 py-2 hover:bg-gray-100 self-center"
                aria-label="filtrar por categoria"
              >
                Categorías
              </button>
              {isCategoriesOpen && (
                <div className="flex flex-col p-2">
                  {categories.slice(0, showAllCategories ? categories.length : filterLimit).map(({ category, count }) => (
                    <label key={category} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => handleCheckboxChange(e, 'category', selectedCategories, setSelectedCategories)}
                        aria-label={`Filtrar por ${category}`}
                      />
                      {category} ({count})
                    </label>
                  ))}
                  {categories.length > filterLimit && (
                    <button
                      onClick={handleShowAllCategories}
                      className="px-4 text-blue-700 hover:text-white hover:bg-blue-400 rounded border cursor-pointer my-2 w-full"
                      aria-label={showAllCategories ? 'Ver menos categorías' : 'Ver más categorías'}
                      title={showAllCategories ? 'Ver menos categorías' : 'Ver más categorías'}
                    >
                      {showAllCategories ? 'Ver menos...' : 'Ver más...'}
                    </button>
                  )}
                </div>
              )}
            </li>
            <li>
              <button className="flex font-medium place-items-center w-full text-left px-4 py-2 hover:bg-gray-100 self-center" aria-label="filtrar por marca">
                Marcas
              </button>
              {isBrandsOpen && (
                <div className="flex flex-col p-2">
                  {brands.slice(0, showAllBrands ? brands.length : filterLimit).map(({ brand, count }) => (
                    <label key={brand} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        value={brand}
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => handleCheckboxChange(e, 'brand', selectedBrands, setSelectedBrands)}
                        aria-label={`Filtrar por ${brand}`}
                      />
                      {brand} ({count})
                    </label>
                  ))}
                  {brands.length > filterLimit && (
                    <button
                      onClick={handleShowAllBrands}
                      className="px-4 text-blue-700 hover:text-white hover:bg-blue-400 rounded border cursor-pointer my-2 w-full"
                      aria-label={showAllBrands ? 'Ver menos marcas' : 'Ver más marcas'}
                      title={showAllBrands ? 'Ver menos marcas' : 'Ver más marcas'}
                    >
                      {showAllBrands ? 'Ver menos...' : 'Ver más...'}
                    </button>
                  )}
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
