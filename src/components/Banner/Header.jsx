'use client'
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Loading from '../Loading/Loading';

// Cargar StarlinkMiniBanner de forma dinámica para evitar bloquear el render del H1
const StarlinkMiniBanner = dynamic(() => import('../Productos/Starlink/bannerStarLink'), {
  ssr: false, // Solo en cliente para evitar retrasos en el servidor
  loading: () => <Loading />, // Placeholder
});

export default function Header() {
  return (
    <>
      <div className="text-center py-4 max-w-6xl mx-auto">
        <h1 className="text-lg text-gray-600 px-2 md:text-center">
          Encuentra los mejores productos y servicios informáticos aquí: <strong>PC Gamers, PC mini para oficinas, PC profesionales</strong> y muchos accesorios para informática como la <strong>fuente adaptador de STARLINK mini.</strong> Además contamos con Servicio de Mantenimiento de Consolas, y armado de computadoras según tu necesidad.
        </h1>
      </div>
      
      {/* Suspense envuelve el banner para que el H1 se renderice primero */}
      <Suspense fallback={<Loading/> }>
        <StarlinkMiniBanner />
      </Suspense>
    </>
  );
}
