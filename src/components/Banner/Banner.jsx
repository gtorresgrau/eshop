import infoWeb from '@/app/constants/infoWeb';
import React from 'react';

const Banner = () => {
  return (
    <section id='home' className="relative w-full min-h-96 flex items-center justify-center overflow-hidden">
      <article className="text-center z-10 m-6 p-2 max-w-[600px]">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-transparent font-bold mb-4 bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
          TIENDA DE <br/> DISPOSITIVOS INFORMATICOS
        </h2>
        <h1 className="text-xl sm:text-xl text-blue-600 font-semibold"> {infoWeb.title} </h1>
        <h2 className="text-lg md:text-xl text-blue-600 font-semibold"> {infoWeb.subtitle} </h2>
      </article>
    </section>
  );
};

export default Banner;
