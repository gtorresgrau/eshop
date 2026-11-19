import Link from 'next/link';
import Reveal from './Reveal';
import { infoWeb } from '../constants/infoWeb';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

/** Quiénes somos y qué ofrecemos. Campo azul de la marca, a todo el ancho. */
export default function NosotrosHome() {
  return (
    <section id="nosotros" aria-labelledby="nos-h2" className="bg-[#005FA3] py-20 text-white lg:py-32">
      <div className={`${CONT} grid gap-12 lg:grid-cols-2 lg:gap-24`}>
        <div>
          <Reveal>
            <h2 id="nos-h2" className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Una startup joven de Wilde
            </h2>
            <p className="mt-6 max-w-[48ch] text-xl leading-relaxed">
              Vendemos insumos informáticos, productos nuevos y usados, y hacemos mantenimiento de PC y consolas. Coordinamos entregas en persona por WhatsApp y enviamos a todo el país.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <Link
              href="/nosotros"
              className="mt-8 inline-flex h-14 items-center bg-white px-8 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#005FA3]"
            >
              Conocé más
            </Link>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <h3 className="text-2xl font-bold sm:text-3xl">Qué ofrecemos</h3>
          <ul className="mt-6 grid gap-x-10 gap-y-3 text-xl sm:grid-cols-2">
            {infoWeb.ofrece.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-2.5 w-2.5 shrink-0 bg-white" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
