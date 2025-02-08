import {infoWeb} from '@/app/constants/infoWeb';
import React from 'react';

const Banner = () => {
  const { title, subtitle } = infoWeb;

  return (
    <header id="home" role="banner" aria-label="Banner principal de Eshop Devices" className="relative w-full min-h-96 flex items-center justify-center overflow-hidden">
      <div className="text-center z-10 m-6 p-2 max-w-[600px]">
        {/* Tagline de la tienda */}
        <h2 title="Tienda de Dispositivos Informáticos" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent font-bold mb-4 bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary"> TIENDA DE <br /> DISPOSITIVOS INFORMATICOS</h2>
        {/* Encabezado principal: se asume que 'title' es la marca o el nombre principal */}
        <h1 title={title} className="ext-xl sm:text-xl text-blue-600 font-semibold">{title}</h1>
        {/* Subtítulo opcional */}
        {subtitle && (<h3 title={subtitle} className="text-lg md:text-xl text-blue-600 font-semibold" >{subtitle}</h3>)}
      </div>
    </header>
  );
};

export default Banner;
