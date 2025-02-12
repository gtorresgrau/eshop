'use client'
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const useProducts = () => {
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determina si la ruta actual es la de administración
  const isAdminPage = path === '/Admin';

  // Estados
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

  // Función auxiliar para actualizar la URL según la página actual
  const pushUpdatedParams = useCallback((params, hash = '') => {
    const url = isAdminPage
      ? `/Admin?${params.toString()}`
      : `/?${params.toString()}${hash}`;
    router.push(url);
  }, [router, isAdminPage]);

  // Función para obtener los productos desde la API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) {
        console.error('Error al obtener los productos:', res.statusText);
        return;
      }
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPage || 1);
      setCategories(data.totalCategories || []);
      setBrands(data.totalBrands || []);
      setAllDestacados(data.allproductosDestacados || []);
    } catch (error) {
      console.error('Error en fetchProducts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  // Ejecuta la búsqueda de productos cuando cambian los parámetros de búsqueda
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Actualiza el estado de la página actual según el parámetro "page"
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    setCurrentPage(page);
  }, [searchParams]);

  // Actualiza los filtros seleccionados (categorías y marcas) cuando cambia la URL
  useEffect(() => {
    setSelectedCategories(searchParams.getAll('category'));
    setSelectedBrands(searchParams.getAll('brand'));
  }, [searchParams]);

  // Manejo del modal de producto
  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    // Restablece la URL eliminando el hash
    window.history.pushState(null, '', window.location.pathname + window.location.search);
  }, []);

  const handleProductSelect = useCallback((product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    window.location.hash = 'producto';
  }, []);

  // Cierra el modal si se navega hacia atrás y el hash no es "#update"
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

  // Actualiza los parámetros de búsqueda para la paginación
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value);
    pushUpdatedParams(params, isAdminPage ? '' : '#productos');
  };

  // Actualiza los parámetros de búsqueda según los filtros seleccionados
  const updateSearchParams = useCallback((key, values) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set('page', 1);
    if (values.length > 0) {
      values.forEach((value) => params.append(key, value));
    }
    pushUpdatedParams(params, isAdminPage ? '' : '#productos');
  }, [searchParams, pushUpdatedParams, isAdminPage]);

  // Maneja el cambio en los checkboxes de filtros
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

  // Limpia todos los filtros de búsqueda
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

  // Alterna la visualización completa de las categorías y marcas
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
    handlePageChange,
    handleCheckboxChange,
    handleClearFilters,
    handleShowAllCategories,
    handleShowAllBrands,
    closeModal,
    handleProductSelect,
    fetchProducts,
  };
};

export default useProducts;
