import Image from 'next/image';
import Reveal from './Reveal';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

/**
 * Tres pasos como tres campos de color lisos que crecen de izquierda a derecha: el orden lo marca el
 * tamaño, no un número. Cada uno lleva un producto real del catálogo.
 */
export default function ComoComprar({ total = 0, fotos = [] }) {
  const cuenta = new Intl.NumberFormat('es-AR').format(total);
  const pasos = [
    {
      titulo: 'Elegís',
      texto: `${total > 0 ? cuenta : 'Cientos de'} productos con precio final en pesos. Buscás por categoría, marca o nombre.`,
      campo: 'bg-[#EAF3FA]',
      alto: 'lg:h-[30vh] lg:min-h-[260px]',
      col: 'lg:col-span-3',
    },
    {
      titulo: 'Pagás',
      texto: 'Con Mercado Pago o con transferencia bancaria. Sin cuentas ni trámites extra.',
      campo: 'bg-[#D3E6F4]',
      alto: 'lg:h-[44vh] lg:min-h-[340px]',
      col: 'lg:col-span-4',
    },
    {
      titulo: 'Lo recibís',
      texto: 'Envío a todo el país por OCA, Andreani o Entregar, con plazo y costo a la vista antes de pagar. Gratis en compras de más de $100.000.',
      campo: 'bg-[#B7D5EC]',
      alto: 'lg:h-[60vh] lg:min-h-[440px]',
      col: 'lg:col-span-5',
    },
  ];

  return (
    <section aria-labelledby="como-h2" className="bg-white py-20 lg:py-32">
      <div className={CONT}>
        <Reveal>
          <h2 id="como-h2" className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Elegís, pagás y lo recibís
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-2.5 lg:mt-16 lg:grid-cols-12 lg:items-end">
          {pasos.map((p, i) => (
            <Reveal key={p.titulo} delay={i * 80} className={p.col}>
              <article className={`flex h-full flex-col justify-between ${p.campo} ${p.alto} p-6 lg:p-8`}>
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-gray-900">{p.titulo}</h3>
                  <p className="mt-3 max-w-[34ch] text-lg leading-snug text-gray-900">{p.texto}</p>
                </div>
                {fotos[i] ? (
                  <div className="relative mt-6 h-40 w-full lg:h-auto lg:min-h-[8rem] lg:flex-1">
                    <Image src={fotos[i]} alt="" fill sizes="(min-width: 1024px) 30vw, 90vw" loading="lazy" className="object-contain object-bottom mix-blend-multiply" />
                  </div>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
