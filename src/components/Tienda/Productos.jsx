'use client';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import Cards from './Cards/Cards';
import newFetchProductos, { startAutoUpdateProductos } from '../../Hooks/useNewFetchProducts';
import useProductModal from '../../Hooks/useProductModal';

const Modal = dynamic(() => import('./Modal/Modals'));

// Normaliza precio a número para ordenar
const parsePrecio = (precio) => {
  if (!precio) return 0;
  const n = typeof precio === 'string'
    ? parseFloat(precio.replace(/[^\d.,-]/g, '').replace('.', '').replace(',', '.'))
    : Number(precio);
  return isNaN(n) ? 0 : n;
};

// Función de ordenamiento
const sortProductos = (lista, orden) => {
  const sorted = [...lista];
  switch (orden) {
    case 'precio_asc':
      return sorted.sort((a, b) => parsePrecio(a.precio) - parsePrecio(b.precio));
    case 'precio_desc':
      return sorted.sort((a, b) => parsePrecio(b.precio) - parsePrecio(a.precio));
    case 'dest':
      return sorted.sort((a, b) => {
        const aD = a.destacados ? 1 : 0;
        const bD = b.destacados ? 1 : 0;
        return bD - aD;
      });
    case 'rel':
    default:
      // Por defecto: disponibles primero, luego destacados dentro de disponibles
      return sorted.sort((a, b) => {
        const aAgotado = a.vendido || a.stock ? 1 : 0;
        const bAgotado = b.vendido || b.stock ? 1 : 0;
        if (aAgotado !== bAgotado) return aAgotado - bAgotado;
        return (b.destacados ? 1 : 0) - (a.destacados ? 1 : 0);
      });
  }
};

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { selectedProduct, isModalOpen, closeModal, handleProductSelect } = useProductModal();
  const searchParams = useSearchParams();

  // Leer todos los filtros desde URL params
  const searchQuery = searchParams.get('search') || '';
  const catFilter   = searchParams.get('cat')    || '';
  const marcaFilter = searchParams.get('marca')  || '';
  const condFilter  = searchParams.get('cond')   || '';
  const ordenFilter = searchParams.get('orden')  || 'rel';

  useEffect(() => {
    const fetchProductos = async () => {
      setIsLoading(true);
      const res = await newFetchProductos();
      setProductos(Array.isArray(res) ? res : []);
      setIsLoading(false);
    };

    fetchProductos();
    const intervalId = startAutoUpdateProductos();
    return () => clearInterval(intervalId);
  }, []);

  // Resetear página al cambiar cualquier filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, catFilter, marcaFilter, condFilter, ordenFilter]);

  // Filtrado y ordenamiento con useMemo para performance
  const filteredProducts = useMemo(() => {
    let resultado = [...productos];

    // Búsqueda de texto en múltiples campos
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      resultado = resultado.filter((p) =>
        p.nombre?.toLowerCase().includes(q) ||
        p.titulo_de_producto?.toLowerCase().includes(q) ||
        p.marca?.toLowerCase().includes(q) ||
        p.categoria?.toLowerCase().includes(q) ||
        p.modelo?.toLowerCase().includes(q) ||
        p.descripcion?.toLowerCase().includes(q) ||
        p.cod_producto?.toLowerCase().includes(q)
      );
    }

    // Filtro por categoría
    if (catFilter) {
      resultado = resultado.filter((p) =>
        p.categoria?.toLowerCase() === catFilter.toLowerCase()
      );
    }

    // Filtro por marca
    if (marcaFilter) {
      resultado = resultado.filter((p) =>
        p.marca?.toLowerCase() === marcaFilter.toLowerCase()
      );
    }

    // Filtro por condición
    if (condFilter === 'nuevo') {
      resultado = resultado.filter((p) => !p.usado);
    } else if (condFilter === 'usado') {
      resultado = resultado.filter((p) => p.usado);
    }

    // Ordenamiento
    return sortProductos(resultado, ordenFilter);
  }, [productos, searchQuery, catFilter, marcaFilter, condFilter, ordenFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll suave al inicio de los productos
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Información de contexto para mostrar en Cards
  const hasActiveFilters = !!(searchQuery || catFilter || marcaFilter || condFilter);
  const totalDisponibles = productos.filter(p => !p.vendido && !p.stock).length;

  return (
    <article id="productos" className="col-span-1 md:col-start-4 md:col-span-9 grid grid-rows-[auto_1fr_auto] min-h-screen">
      <div className="md:justify-self-center w-full">
        <Cards
          productos={filteredProducts}
          isLoading={isLoading}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handleProductSelect={handleProductSelect}
          hasActiveFilters={hasActiveFilters}
          totalDisponibles={totalDisponibles}
          searchQuery={searchQuery}
        />
      </div>

      {isModalOpen && selectedProduct && (
        <Modal closeModal={closeModal} selectedProduct={selectedProduct} />
      )}
    </article>
  );
}
