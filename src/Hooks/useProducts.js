'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useFetchProducts from './useFetchProducts';
import useProductFilters from './useProductFilters';
import useProductModal from './useProductModal';
import useURLParams from './useURLParams';

const useProducts = () => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdminPage = path === '/Admin';

  const { products, allDestacados, categories, brands, totalPages, fetchProducts, isLoading, error } = useFetchProducts(searchParams);
  const { selectedCategories, selectedBrands, setSelectedCategories, setSelectedBrands, handleCheckboxChange, handleClearFilters } = useProductFilters(searchParams, router, isAdminPage);
  const { selectedProduct, isModalOpen, closeModal, handleProductSelect } = useProductModal();
  const { pushUpdatedParams, currentPage, setCurrentPage } = useURLParams(searchParams, router, isAdminPage);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, searchParams]);

  return {
    products,
    allDestacados,
    categories,
    brands,
    selectedCategories,
    selectedBrands,
    selectedProduct,
    isModalOpen,
    totalPages,
    currentPage,
    isLoading,
    error,
    setSelectedCategories,
    setSelectedBrands,
    pushUpdatedParams,
    fetchProducts,
    handleCheckboxChange,
    handleClearFilters,
    handleProductSelect,
    closeModal,
    handlePageChange: (event, value) => {
      setCurrentPage(value);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', value);
      pushUpdatedParams(params, isAdminPage ? '' : '#productos');
    },
  };
};

export default useProducts;
