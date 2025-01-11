import React from 'react';

const Banner = () => {
  return (
    <section id='home' className="relative w-full min-h-96 flex items-center justify-center mt-[-65px] overflow-hidden">
      <img 
        src="/bg/bg-sm-banner.webp" 
        srcSet="/bg/bg-sm-banner.webp 600w, /bg/bg-banner.webp 1200w" 
        sizes="(max-width: 768px) 600px, 1200px" 
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        title="Banner"
      />
      <article className="text-center z-10 m-2 p-2 max-w-[600px]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent font-bold mb-4 bg-clip-text bg-gradient-to-r from-boton-primary via-boton-secondary to-boton-primary">
          CENTRAL CAM<br/>REPUESTOS
        </h2>
        <h1 className="text-lg sm:text-xl text-white font-semibold">La más amplia variedad de repuestos para camiones:</h1>
        <h2 className="text-md md:text-xl text-white font-semibold">calidad, durabilidad y confiabilidad en cada pieza.</h2>
      </article>
    </section>
  );
};

export default Banner;
