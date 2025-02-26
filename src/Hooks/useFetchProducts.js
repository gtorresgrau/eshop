'use client';
import { useState, useCallback, useEffect } from 'react';

const cache = new Map(); // Cache en memoria para evitar llamadas repetidas

const useFetchProducts = (searchParams) => {
  const initialPageSize = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 9;
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [products, setProducts] = useState([]);
  const [allDestacados, setAllDestacados] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(window.innerWidth < 768 ? 8 : 9);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('pageSize', pageSize);

      const cacheKey = params.toString();
      if (cache.has(cacheKey)) {
        const cachedData = cache.get(cacheKey);
        setProducts(cachedData.products);
        setTotalPages(cachedData.totalPage);
        setAllDestacados(cachedData.allproductosDestacados);
        setCategories(cachedData.totalCategories);
        setBrands(cachedData.totalBrands);
        setIsLoading(false);
        return;
      }

      const [productsRes, metadataRes] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch(`/api/products/metadata`),
      ]);

      if (!productsRes.ok || !metadataRes.ok) throw new Error('Error al cargar los datos');

      const productsData = await productsRes.json();
      const metadataData = await metadataRes.json();

      const newData = {
        products: productsData.products || [],
        totalPage: productsData.totalPage || 1,
        allproductosDestacados: productsData.allproductosDestacados || [],
        totalCategories: metadataData.totalCategories || [],
        totalBrands: metadataData.totalBrands || [],
      };

      cache.set(cacheKey, newData); // Guardamos en cache

      setProducts(newData.products);
      setTotalPages(newData.totalPage);
      setAllDestacados(newData.allproductosDestacados);
      setCategories(newData.totalCategories);
      setBrands(newData.totalBrands);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, pageSize]);

  return { products, allDestacados, categories, brands, totalPages, fetchProducts, isLoading, error };
};

export default useFetchProducts;
