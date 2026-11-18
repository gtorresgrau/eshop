'use client';
import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import Cards from './Cards/Cards';
import SidebarProductos from './SidebarProductos';
import newFetchProductos, { startAutoUpdateProductos } from '../../Hooks/useNewFetchProducts';
import useProductModal from '../../Hooks/useProductModal';
import { parsePrecio } from '../../Utils/parsePrecio';

const Modal = dynamic(() => import('./Modal/Modals'));

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
    <section id="productos" className="mx-auto min-h-screen w-full max-w-screen-2xl px-3 py-8 sm:px-6 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-x-10 lg:px-8">
      {/* Menú lateral con los filtros: orden, condición, categorías y marcas */}
      <SidebarProductos productos={productos} isLoading={isLoading} />

      <div className="min-w-0">
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
    </section>
  );
}
