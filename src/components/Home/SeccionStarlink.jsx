import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';
const FOTO = 'https://res.cloudinary.com/dnbrxpca3/image/upload/f_auto,q_auto,w_1200/v1739838346/FuenteStarlink4_zodve5.webp';

/** Lo que solo distribuye esta tienda: el objeto ampliado hasta que el borde de la pantalla lo recorta. */
export default function SeccionStarlink() {
  return (
    <section aria-labelledby="starlink-h2" className="overflow-hidden bg-gray-100 py-20 lg:py-0">
      <div className={`${CONT} grid items-center gap-10 lg:min-h-[78vh] lg:grid-cols-2`}>
        <Reveal>
          <h2 id="starlink-h2" className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Fuente para Starlink Mini
          </h2>
          <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-gray-900">
            Distribuidor autorizado del elevador de tensión Trifix SL1230: potencia y estabilidad para tu conexión satelital, también en ruta.
          </p>
          <Link
            href="/productos/StarLinkmini"
            className="mt-8 inline-flex h-14 items-center bg-orange-700 px-8 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
          >
            Ver la fuente
          </Link>
        </Reveal>

        <Reveal delay={120} className="relative h-[420px] lg:h-[78vh]">
          <Image
            src={FOTO}
            alt="Fuente adaptador con cable para antena Starlink Mini, Trifix SL1230"
            width={1200}
            height={984}
            sizes="(min-width: 1024px) 60vw, 130vw"
            loading="lazy"
            className="absolute -right-[18%] top-1/2 h-auto w-[130%] max-w-none -translate-y-1/2 mix-blend-multiply lg:-right-[22%] lg:w-[125%]"
          />
        </Reveal>
      </div>
    </section>
  );
}
