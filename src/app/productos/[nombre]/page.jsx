'use client' // Necesario porque estamos usando hooks en Next.js 14 con App Router

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import useProducts from '@/Hooks/useProducts';


const HeaderSection = dynamic(() => import('@/app/home/HeaderSection'));
const FooterSection = dynamic(() => import('@/app/home/FooterSection'));
const Modal = dynamic(() => import('@/components/Tienda/Modal/Modals'));
const Loading = dynamic(() => import('@/components/Loading/Loading'));


const ProductoPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { nombre } = useParams();
  const slug = nombre; // Asigna el valor correcto

  const { closeModal } = useProducts();

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
    <div className="flex flex-col h-screen">
      <HeaderSection />
      <main className="flex-1 flex items-center justify-center bg-white">
        <Modal selectedProduct={selectedProduct} closeModal={() => closeModal} isDialog = {false}  />
      </main>
      <FooterSection />
    </div>
  );
};

export default ProductoPage;
