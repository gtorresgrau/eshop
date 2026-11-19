'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CADA_MS = 6000;

/**
 * Hero: a la izquierda qué es la tienda y qué hacer (título, buscador, catálogo); a la derecha un panel liso
 * con UN producto real grande. Los productos se cruzan solos cada 6 s y también se eligen con las miniaturas.
 * Con "reducir movimiento" no hay rotación automática. Nada se superpone con el texto.
 *
 * objetos: [{ key, href, nombre, marca, precio (texto ya formateado), src, alt }]
 */
export default function HeroObjeto({ objetos = [], total = 0 }) {
  const [activo, setActivo] = useState(0);
  const [manual, setManual] = useState(false); // si el visitante eligió uno, no rotamos más

  useEffect(() => {
    if (manual || objetos.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let id;
    const arrancar = () => { id = setInterval(() => setActivo((i) => (i + 1) % objetos.length), CADA_MS); };
    const onVis = () => { clearInterval(id); if (!document.hidden) arrancar(); }; // pausa con la pestaña oculta
    arrancar();
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, [objetos.length, manual]);

  const actual = objetos[activo] || objetos[0];
  const cuenta = new Intl.NumberFormat('es-AR').format(total);

  return (
    <section aria-labelledby="hero-h1" className="bg-white">
      <div className="mx-auto grid w-full max-w-screen-2xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-8 lg:py-16">
        {/* Texto: qué es y qué hacer */}
        <div className="lg:col-span-5">
          <h1 id="hero-h1" className="text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-gray-900 sm:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Tecnología en todo el país
          </h1>
          <p className="mt-6 max-w-[44ch] text-xl leading-relaxed text-gray-900">
            {total > 0 ? `${cuenta} productos` : 'Productos'} de informática y dispositivos. Elegís, pagás y lo recibís en tu casa.
          </p>

          <form action="/productos" method="get" role="search" className="mt-8 flex max-w-xl">
            <label htmlFor="hero-q" className="sr-only">Buscar productos</label>
            <input
              id="hero-q"
              name="q"
              type="search"
              maxLength={80}
              autoComplete="off"
              placeholder="Buscar productos"
              className="h-14 min-w-0 flex-1 bg-gray-100 px-4 text-base text-gray-900 placeholder:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            />
            <button
              type="submit"
              className="h-14 shrink-0 bg-gray-900 px-6 text-base font-semibold text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
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

        {/* Producto: panel liso; la foto (fondo blanco) se funde con él */}
        <div className="lg:col-span-7">
          <div className="relative isolate aspect-square w-full overflow-hidden bg-gray-100 sm:aspect-[4/3] lg:aspect-[6/5]">
            {objetos.map((o, i) => (
              <Image
                key={o.key}
                src={o.src}
                alt={i === activo ? o.alt : ''}
                fill
                priority={i === 0}
                loading={i === 0 ? 'eager' : 'lazy'}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={`object-contain p-8 pb-24 mix-blend-multiply transition-opacity duration-[1200ms] ease-in-out sm:p-10 sm:pb-24 lg:p-12 lg:pb-24 motion-reduce:transition-none ${
                  i === activo ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            {actual && (
              <Link
                href={actual.href}
                aria-label={`Ver ${actual.nombre}`}
                className="group absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gray-100 px-5 py-4 sm:px-6"
              >
                <span className="min-w-0">
                  {actual.marca ? <span className="block text-sm text-gray-700">{actual.marca}</span> : null}
                  <span className="block truncate text-lg font-bold leading-snug text-gray-900 group-hover:underline">{actual.nombre}</span>
                </span>
                {actual.precio ? <span className="shrink-0 text-2xl font-extrabold tabular-nums text-gray-900">{actual.precio}</span> : null}
              </Link>
            )}
          </div>

          {objetos.length > 1 && (
            <div className="mt-3 flex gap-2" role="group" aria-label="Elegir producto destacado">
              {objetos.map((o, i) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => { setManual(true); setActivo(i); }}
                  aria-label={`Mostrar ${o.nombre}`}
                  aria-pressed={i === activo}
                  className={`relative h-16 w-16 overflow-hidden bg-gray-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 sm:h-20 sm:w-20 ${
                    i === activo ? 'opacity-100 ring-2 ring-gray-900' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={o.src} alt="" fill sizes="80px" className="object-contain p-1.5 mix-blend-multiply" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
