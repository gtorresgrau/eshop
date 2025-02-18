// Tienda.js
import React from 'react';
import useProducts from "@/Hooks/useProducts";
import Header from './Header';
import Aside from './Aside';
import Productos from './Productos';

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
    <main id="productos" className="bg-primary-background min-h-screen">
      <Header />
      <section className="grid grid-cols-1 md:grid-cols-12 md:gap-4 max-w-7xl mx-auto md:p-5 font-sans">
        <Aside
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
        <Productos
          products={products}
          isModalOpen={isModalOpen}
          selectedProduct={selectedProduct}
          isLoading={isLoading}
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handleProductSelect={handleProductSelect}
          closeModal={closeModal}
        />
      </section>
    </main>
  );
}
