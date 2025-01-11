import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <img src="/404.webp" alt="404 Not Found" loading='lazy' title='Pagina no encontrada'/>
        <h1 className="text-4xl font-bold text-gray-800 mt-6">Página No Encontrada</h1>
        <p className="text-gray-600 mt-2">Lo sentimos, pero la página que estás buscando no existe.</p>
        <Link href="/" className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition duration-300" title='Volver a inicio'>Volver al Inicio</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
