'use client' // Necesario porque estamos usando hooks en Next.js 14 con App Router

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import useProductModal from '@/Hooks/useProductModal';


const Modal = dynamic(() => import('@/components/Tienda/Modal/Modals'));
const Loading = dynamic(() => import('@/components/Loading/Loading'));
const ClientLayout = dynamic(() => import('@/app/ClientLayout'));



const ProductoPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { nombre } = useParams();
  const slug = nombre; // Asigna el valor correcto

  const { closeModal } =  useProductModal();

  useEffect(() => {
    if (!slug) return;
  
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setSelectedProduct(data);
      } catch (error) {
        console.error(error.message);
      }
    };
  
    fetchProduct();
  }, [slug]);
  
  if (!selectedProduct) {
    return <Loading/>;
  }

  return (
    <ClientLayout className="flex flex-col h-screen" title={selectedProduct.name}>
      <main className="flex-1 flex items-center justify-center bg-white">
        <Modal selectedProduct={selectedProduct} closeModal={() => closeModal} isDialog = {false}  />
      </main>
    </ClientLayout>
  );
};

export default ProductoPage;
