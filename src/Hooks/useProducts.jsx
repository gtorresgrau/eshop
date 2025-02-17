'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
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
      console.error('Error in fetchProducts:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams(searchParams.toString());
        const data = await fetchData(params);

        setProducts(data.products || []);
        setTotalPages(data.totalPage || 1);
        // Direct assignment is enough here:
        setCategories(data.totalCategories || []);
        setBrands(data.totalBrands || []);
        setAllDestacados(data.allproductosDestacados || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [fetchData, searchParams]);

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    setSelectedCategories(searchParams.getAll('category'));
    setSelectedBrands(searchParams.getAll('brand'));
  }, [searchParams]);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    window.history.pushState(null, '', window.location.pathname + window.location.search);
  }, []);

  const handleProductSelect = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    window.location.hash = 'producto';
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
      updateSearchParams(key, newSelected);
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

  const handleShowAllCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

  const handleShowAllBrands = () => {
    setShowAllBrands((prev) => !prev);
  };

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
    setIsModalOpen,
    setSelectedCategories,
    setSelectedBrands,
    // functions
    pushUpdatedParams,
    handlePageChange: (event, value) => {
      setCurrentPage(value);
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', value);
      pushUpdatedParams(params, isAdminPage ? '' : '#productos');
    },
    handleCheckboxChange: (e, key, selectedValues, setSelectedValues) => {
      const value = e.target.value;
      const isChecked = e.target.checked;
      setSelectedValues((prevSelected) => {
        const newSelected = isChecked
          ? [...prevSelected, value]
          : prevSelected.filter((item) => item !== value);
        // Ensure updateSearchParams is memoized or inline if simple:
        const params = new URLSearchParams(searchParams.toString());
        params.delete(key);
        params.set('page', 1);
        if (newSelected.length > 0) {
          newSelected.forEach((val) => params.append(key, val));
        }
        pushUpdatedParams(params, isAdminPage ? '' : '#productos');
        return newSelected;
      });
    },
    handleClearFilters: () => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      params.delete('category');
      params.delete('brand');
      params.set('page', 1);
      setSelectedCategories([]);
      setSelectedBrands([]);
      pushUpdatedParams(params, isAdminPage ? '' : '#productos');
    },
    handleShowAllCategories: () => setShowAllCategories((prev) => !prev),
    handleShowAllBrands: () => setShowAllBrands((prev) => !prev),
    closeModal: useCallback(() => {
      setSelectedProduct(null);
      setIsModalOpen(false);
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }, []),
    handleProductSelect: useCallback((product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
      window.location.hash = 'producto';
    }, []),
    error,
  };
};

export default useProducts;