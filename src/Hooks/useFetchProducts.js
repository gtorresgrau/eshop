'use client'
import { useState, useCallback } from 'react';

const useFetchProducts = (searchParams) => {
  const [products, setProducts] = useState([]);
  const [allDestacados, setAllDestacados] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();

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
  }, [searchParams]);

  return { products, allDestacados, categories, brands, totalPages, fetchProducts, isLoading, error };
};

export default useFetchProducts;
