'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CADA_MS = 6000;

/**
 * Hero: el nombre de la tienda a todo el ancho y, encima, UN objeto real ampliado hasta que el borde de
 * la pantalla lo recorta. El objeto se cruza lentamente con el siguiente (productos reales del catálogo
 * y la fuente de Starlink). Con "reducir movimiento" se ve solo el primero.
 *
 * El campo del hero es gris liso y el contenedor del objeto usa mix-blend-multiply: el fondo blanco de la
 * foto desaparece y el objeto queda apoyado directamente sobre el campo.
 *
 * objetos: [{ key, href, nombre, marca, precio (texto ya formateado), src, alt }]
 */
export default function HeroObjeto({ objetos = [], total = 0 }) {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    if (objetos.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let id;
    const arrancar = () => { id = setInterval(() => setActivo((i) => (i + 1) % objetos.length), CADA_MS); };
    const onVis = () => { clearInterval(id); if (!document.hidden) arrancar(); }; // pausa con la pestaña oculta
    arrancar();
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [objetos.length]);

  const actual = objetos[activo] || objetos[0];
  const cuenta = new Intl.NumberFormat('es-AR').format(total);

  return (
    <section aria-labelledby="hero-h1" className="relative isolate overflow-hidden bg-gray-100 xl:h-[calc(100svh-6.5rem)] xl:min-h-[680px]">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8 xl:static xl:h-full xl:pb-0 xl:pt-0">
        {/* Nombre de la tienda: es el titular. El objeto lo cruza */}
        <h1
          id="hero-h1"
          className="select-none text-center text-[21vw] font-black leading-[0.82] tracking-[-0.045em] text-[#005FA3] md:whitespace-nowrap md:text-[12.4vw] md:leading-[0.9] xl:absolute xl:inset-x-0 xl:top-[1%]"
        >
          Eshop Devices
        </h1>

        {/* Objeto: más de la mitad de la altura, cruza el nombre y el borde inferior lo recorta */}
        <div className="pointer-events-none relative z-10 mx-auto -mt-[7vw] h-[76vw] w-[76vw] max-w-[620px] mix-blend-multiply md:-mt-[5vw] md:h-[52vw] md:w-[52vw] xl:absolute xl:bottom-[-10%] xl:left-1/2 xl:mt-0 xl:aspect-square xl:h-[104%] xl:w-auto xl:max-w-none xl:-translate-x-1/2">
          {objetos.map((o, i) => (
            <Image
              key={o.key}
              src={o.src}
              alt={i === activo ? o.alt : ''}
              fill
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              sizes="(min-width: 1280px) 760px, 76vw"
              className={`object-contain transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none ${
                i === activo ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Texto pequeño en las esquinas: lo que es y qué hacer */}
        <div className="relative z-20 mt-6 max-w-xl xl:absolute xl:bottom-12 xl:left-8 xl:mt-0 xl:w-[19rem]">
          <p className="text-xl font-medium leading-snug text-gray-900 sm:text-2xl xl:text-xl">
            {total > 0 ? `${cuenta} productos de ` : 'Productos de '}informática y dispositivos, con envío a todo el país.
          </p>
          <form action="/productos" method="get" role="search" className="mt-5 flex">
            <label htmlFor="hero-q" className="sr-only">Buscar productos</label>
            <input
              id="hero-q"
              name="q"
              type="search"
              maxLength={80}
              autoComplete="off"
              placeholder="Buscar productos"
              className="h-14 min-w-0 flex-1 bg-white px-4 text-base text-gray-900 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            />
            <button
              type="submit"
              className="h-14 shrink-0 bg-gray-900 px-5 text-base font-semibold text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              Buscar
            </button>
          </form>
          <Link
            href="#productos"
            className="mt-3 inline-flex h-14 items-center bg-orange-700 px-8 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
          >
            Ver el catálogo
          </Link>
        </div>

        {actual && (
          <Link
            href={actual.href}
            aria-label={`Ver ${actual.nombre}`}
            className="group relative z-20 mt-8 block text-left xl:absolute xl:right-8 xl:top-[52%] xl:mt-0 xl:w-[19rem] xl:-translate-y-1/2 xl:text-right"
          >
            {actual.marca ? <span className="block text-base text-gray-700">{actual.marca}</span> : null}
            <span className="mt-0.5 block text-xl font-bold leading-snug text-gray-900 group-hover:underline">{actual.nombre}</span>
            {actual.precio ? <span className="mt-1 block text-3xl font-extrabold tabular-nums text-gray-900">{actual.precio}</span> : null}
          </Link>
        )}
      </div>
    </section>
  );
}
