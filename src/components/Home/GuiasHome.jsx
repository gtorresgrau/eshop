import Link from 'next/link';
import Reveal from './Reveal';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

const GUIAS = [
  { href: '/comparativas/almacenamiento', titulo: 'Almacenamiento', texto: 'HDD, SSD SATA y M.2 NVMe Gen3/4/5: velocidades, precios y usos recomendados.' },
  { href: '/comparativas/memoria', titulo: 'Memoria RAM', texto: 'DDR3, DDR4, DDR5 y ECC: frecuencias, latencias y cuánta RAM necesitás.' },
  { href: '/comparativas/fuente', titulo: 'Fuentes de alimentación', texto: 'Bronze, Gold, Platinum y Titanium: qué certificación y qué potencia elegir.' },
  { href: '/comparativas/mothers', titulo: 'Motherboards', texto: 'Intel vs AMD, chipsets, sockets y formatos ATX, MicroATX y Mini-ITX.' },
  { href: '/comparativas/procesadores', titulo: 'Procesadores', texto: 'Intel Core i3 a i9 vs AMD Ryzen 3 a 9: núcleos, GHz, TDP y usos.' },
  { href: '/comparativas/tecnologias', titulo: 'Tecnologías y conectividad', texto: 'USB, PCIe, HDMI, DisplayPort, Wi-Fi 6/7 y Thunderbolt: guía completa.' },
];

/** Seis guías como una lista grande de enlaces en dos columnas: sin tarjetas ni íconos. */
export default function GuiasHome() {
  return (
    <section id="comparaciones" aria-labelledby="guias-h2" className="bg-white py-20 lg:py-32">
      <div className={CONT}>
        <Reveal>
          <h2 id="guias-h2" className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Guías para elegir bien
          </h2>
        </Reveal>
        <ul className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2 lg:mt-16">
          {GUIAS.map((g, i) => (
            <li key={g.href}>
              <Reveal delay={(i % 2) * 70}>
                <Link href={g.href} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:underline sm:text-3xl">{g.titulo}</span>
                    <span aria-hidden="true" className="text-2xl font-bold text-orange-800 transition-transform group-hover:translate-x-1 motion-reduce:transition-none">→</span>
                  </span>
                  <span className="mt-3 block max-w-[48ch] text-lg leading-snug text-gray-900">{g.texto}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
