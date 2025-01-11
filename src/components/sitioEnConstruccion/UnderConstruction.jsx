
import React from 'react';

const UnderConstruction = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">Sitio en Construcción</h1>
      <p className="text-2xl mb-8">Estamos trabajando duro para traerte algo increíble. ¡Vuelve pronto!</p>
        <img src="/images/construction.webp" alt="Sitio en Construcción" className="w-full md:w-[75%]  h-auto" title='Sitio en Construcción'/>
    </div>
  );
};

export default UnderConstruction;
