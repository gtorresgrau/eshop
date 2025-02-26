'use client';
import { useState, useCallback, useEffect } from 'react';

const useFetchProducts = (searchParams) => {
  // Inicializar basándonos en el ancho de la ventana (si window está disponible)
  const initialPageSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 9;
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [products, setProducts] = useState([]);
  const [allDestacados, setAllDestacados] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Actualiza el pageSize según el tamaño de pantalla
  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(window.innerWidth < 768 ? 8 : 9);
    };

    updatePageSize(); // Ejecuta al cargar, aunque ya se inicializó
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', pageSize);
  
      // Llamadas a los nuevos endpoints
      const [productsRes, metadataRes] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch(`/api/products/metadata`)
      ]);
  
      if (!productsRes.ok || !metadataRes.ok) throw new Error('Error al cargar los datos');
  
      const productsData = await productsRes.json();
      const metadataData = await metadataRes.json();
  
      // Actualizar estados
      setProducts(productsData.products || []);
      setTotalPages(productsData.totalPage || 1);
      setAllDestacados(productsData.allproductosDestacados || []);
      setCategories(metadataData.totalCategories || []);
      setBrands(metadataData.totalBrands || []);
  
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, pageSize]);
  

  return { products, allDestacados, categories, brands, totalPages, fetchProducts, isLoading, error };
};

export default useFetchProducts;
