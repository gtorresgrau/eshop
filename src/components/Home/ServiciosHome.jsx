import Reveal from './Reveal';
import userData from '../constants/userData';
import { consoles } from '../constants/infoWeb';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

/**
 * Servicio técnico. Los precios son el dato principal: se leen grandes, en una lista sin tarjetas.
 * Campo oscuro para cortar el ritmo de la página.
 */
export default function ServiciosHome() {
  const lista = Object.values(consoles);
  const wa = `https://wa.me/+${userData.codigoPais}${userData.contact}?text=${encodeURIComponent('Hola, quiero reservar un servicio de limpieza.')}`;

  return (
    <section id="servicios" aria-labelledby="servicios-h2" className="bg-[#2C2F33] py-20 text-white lg:py-32">
      <div className={`${CONT} grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20`}>
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <h2 id="servicios-h2" className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Limpieza de consolas y PC
          </h2>
          <p className="mt-6 max-w-[44ch] text-xl leading-relaxed text-gray-100">
            Menos ruido del ventilador, menos temperatura y más vida útil. Lo hacemos en 1 día y tiene 30 días de garantía.
          </p>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-14 items-center bg-orange-700 px-8 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2C2F33]"
          >
            Reservar por WhatsApp
          </a>
        </Reveal>

        <ul className="space-y-10">
          {lista.map((s, i) => (
            <li key={s.name}>
              <Reveal delay={i * 70}>
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="text-2xl font-bold sm:text-3xl">{s.name}</h3>
                  <p className="shrink-0 text-2xl font-extrabold tabular-nums sm:text-3xl">{s.price}</p>
                </div>
                <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-gray-100">{s.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
