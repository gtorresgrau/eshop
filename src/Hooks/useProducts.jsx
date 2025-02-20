'use client'
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const useProducts = () => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAdminPage = path === '/Admin';

  const [products, setProducts] = useState([]);
  const [allDestacados, setAllDestacados] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pushUpdatedParams = useCallback((params, hash = '') => {
    const url = isAdminPage
      ? `/Admin?${params.toString()}`
      : `/?${params.toString()}${hash}`;
    router.push(url);
  }, [router, isAdminPage]);

  const fetchData = useCallback(async (params) => {
    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || res.statusText);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error en fetchData:', error);
      throw error;
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const data = await fetchData(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPage || 1);
      setCategories(data.totalCategories || []);
      setBrands(data.totalBrands || []);
      setAllDestacados(data.allproductosDestacados || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    setSelectedCategories(searchParams.getAll('category'));
    setSelectedBrands(searchParams.getAll('brand'));
  }, [searchParams]);

  const openModal = useCallback((product = null, hashValue = '#producto') => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    // Unificar hash para agregar o actualizar
    window.location.hash = hashValue;
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    // Limpiar hash sin recargar página
    window.history.pushState(null, '', window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#update' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isModalOpen, closeModal]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value);
    pushUpdatedParams(params, isAdminPage ? '' : '#productos');
  };

  const updateSearchParams = useCallback((key, values) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set('page', 1);
    if (values.length > 0) {
      values.forEach((value) => params.append(key, value));
    }
    pushUpdatedParams(params, isAdminPage ? '' : '#productos');
  }, [searchParams, pushUpdatedParams, isAdminPage]);

  const handleCheckboxChange = (e, key, selectedValues, setSelectedValues) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    setSelectedValues((prevSelected) => {
      const newSelected = isChecked
        ? [...prevSelected, value]
        : prevSelected.filter((item) => item !== value);
      // Actualizar parámetros en la URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      params.set('page', 1);
      if (newSelected.length > 0) {
        newSelected.forEach((val) => params.append(key, val));
      }
      pushUpdatedParams(params, isAdminPage ? '' : '#productos');
      return newSelected;
    });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('category');
    params.delete('brand');
    params.set('page', 1);
    setSelectedCategories([]);
    setSelectedBrands([]);
    pushUpdatedParams(params, isAdminPage ? '' : '#productos');
  };

  const handleShowAllCategories = () => setShowAllCategories((prev) => !prev);
  const handleShowAllBrands = () => setShowAllBrands((prev) => !prev);

  return {
    products,
    allDestacados,
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
    error,
    fetchProducts,
    openModal, // para abrir modal (se puede pasar el producto y tipo de hash)
    closeModal, // para cerrar modal
    handlePageChange,
    updateSearchParams,
    handleCheckboxChange,
    handleClearFilters,
    handleShowAllCategories,
    handleShowAllBrands,
  };
};

export default useProducts;
