import Image from 'next/image';
import Reveal from './Reveal';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

const HACE = [
  'Elimina archivos temporales y vacía la papelera de reciclaje.',
  'Ejecuta la herramienta de limpieza de disco de Windows.',
  'Borra las cachés de los navegadores.',
  'Te muestra en la consola lo que va haciendo, en el idioma de tu sistema.',
];

/** CleanTool: el script de limpieza de PC. Imagen del programa, qué hace y descarga. */
export default function HerramientaHome() {
  return (
    <section aria-labelledby="clean-h2" className="bg-gray-100 py-20 lg:py-32">
      <div className={`${CONT} grid items-center gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20`}>
        <Reveal className="flex justify-start lg:justify-center">
          <Image
            src="/icons/CleanTool.webp"
            alt="Ícono de CleanTool"
            width={256}
            height={256}
            loading="lazy"
            className="h-40 w-40 lg:h-64 lg:w-64"
          />
        </Reveal>

        <div>
          <Reveal>
            <h2 id="clean-h2" className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              CleanTool, sistema de limpieza de PC
            </h2>
            <p className="mt-5 max-w-[56ch] text-xl leading-relaxed text-gray-900">
              Un script de PowerShell que automatiza la limpieza de tu computadora. Lo creó Gonzalo Torres Grau.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <ul className="mt-8 max-w-[60ch] space-y-3 text-lg leading-snug text-gray-900">
              {HACE.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-2.5 w-2.5 shrink-0 bg-orange-700" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="/docs/CleanTool_v2.1.exe"
                download
                className="inline-flex h-14 items-center bg-orange-700 px-8 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
              >
                Descargar CleanTool
              </a>
              <a
                href="https://gonzalotorresgrau.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center bg-white px-8 text-lg font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
              >
                Visitar gonzalotorresgrau.com
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
