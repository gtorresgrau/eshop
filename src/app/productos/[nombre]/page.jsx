'use client' // Necesario porque estamos usando hooks en Next.js 14 con App Router

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import useProductModal from '@/Hooks/useProductModal';
import { useMetadata, defaultMetadata } from '@/Hooks/useMetadata';
import Head from 'next/head';

const Modal = dynamic(() => import('@/components/Tienda/Modal/Modals'));
const Loading = dynamic(() => import('@/components/Loading/Loading'));
const ClientLayout = dynamic(() => import('@/app/ClientLayout'));

const ProductoPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { nombre = "" } = useParams(); // Evita valores undefined

  const { closeModal } = useProductModal();

  useEffect(() => {
    if (!nombre) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/productos/${nombre}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setSelectedProduct(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchProduct();
  }, [nombre]);

  // Si el producto no se ha cargado, muestra un loader
  if (!selectedProduct) {
    return <Loading />;
  }

// Mueve la llamada a useMetadata fuera de la condición
const metadata = useMetadata({
  title: selectedProduct?.name || defaultMetadata.title,
  description: selectedProduct ? `${selectedProduct.marca} ${selectedProduct.categoria}` : defaultMetadata.description,
  keywords: selectedProduct?.titulo_de_producto || defaultMetadata.keywords,
  image: selectedProduct?.foto_1_1 || defaultMetadata.openGraph.image,
});

  return (
    <ClientLayout className="flex flex-col h-screen" title={selectedProduct.name}>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={metadata.canonical} />
        {/* Otros metadatos que quieras agregar */}
      </Head>
      <main className="flex-1 flex items-center justify-center bg-white">
        <Modal selectedProduct={selectedProduct} closeModal={closeModal} isDialog={false} />
      </main>
    </ClientLayout>
  );
};

export default ProductoPage;
