// useFetchProducts.js
import { useState, useRef, useCallback } from 'react';

const DEBOUNCE_DELAY = 2000; // 2000 ms = 2 segundos; cámbialo a 2 minutos (120000 ms) si es realmente lo que necesitas

export const useFetchProducts = (searchParams) => {
  const [data, setData] = useState({
    products: [],
    totalPage: 1,
    totalCategories: [],
    totalBrands: [],
    allproductosDestacados: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Utilizamos una referencia para almacenar el timeout
  const debounceTimeout = useRef(null);

  const fetchProducts = useCallback(() => {
    // Si hay un timeout pendiente, lo limpiamos
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) {
          console.error('Error al obtener los productos:', res.statusText);
          return;
        }
        const json = await res.json();
        setData({
          products: json.products || [],
          totalPage: json.totalPage || 1,
          totalCategories: json.totalCategories || [],
          totalBrands: json.totalBrands || [],
          allproductosDestacados: json.allproductosDestacados || [],
        });
      } catch (error) {
        console.error('Error en fetchProducts:', error);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);
  }, [searchParams]);

  return { data, isLoading, fetchProducts };
};
