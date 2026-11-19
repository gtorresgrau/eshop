import Link from 'next/link';
import Reveal from './Reveal';
import { faqData } from '../constants/infoWeb';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

/**
 * Preguntas frecuentes: título ancho a la izquierda y las preguntas desde la quinta columna.
 * Usa <details>: funciona sin JavaScript y la respuesta ya está en el HTML para Google.
 * La pregunta abierta cambia de tono, no lleva bordes.
 */
export default function FaqHome() {
  return (
    <section id="faq" aria-labelledby="faq-h2" className="bg-white py-20 lg:py-32">
      <div className={CONT}>
        <Reveal>
          <h2 id="faq-h2" className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Preguntas frecuentes
          </h2>
        </Reveal>

        <div className="mt-12 lg:mt-20 lg:grid lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-8 lg:col-start-5">
            {faqData.map((faq) => (
              <details key={faq.id} className="group bg-white open:bg-gray-100">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-4 py-5 text-xl font-medium leading-snug text-gray-900 marker:hidden hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 sm:text-2xl lg:px-6 [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="shrink-0 text-3xl font-light leading-none text-orange-800 transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span>
                </summary>
                <div className="px-4 pb-6 text-lg leading-relaxed text-gray-900 lg:px-6">
                  <p className="max-w-[62ch]">
                    {faq.answer}
                    {faq.linkText && faq.linkUrl ? (
                      <>
                        {' '}
                        <Link href={faq.linkUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-800 underline-offset-2 hover:underline">
                          {faq.linkText}
                        </Link>
                      </>
                    ) : null}
                  </p>
                  {faq.additionalInfo?.length > 0 ? (
                    <div className="mt-3">
                      <p className="max-w-[62ch]">{faq.additionalInfo[0].text}</p>
                      <ul className="mt-2 space-y-1">
                        {faq.additionalInfo[0].links.map((l) => (
                          <li key={l.url}>
                            <Link href={l.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-orange-800 underline-offset-2 hover:underline">
                              {l.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
