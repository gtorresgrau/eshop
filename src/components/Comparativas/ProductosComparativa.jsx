import Link from 'next/link';
import CatalogoGrid from '../Catalogo/CatalogoGrid';
import { productosParaComparativa } from '../../lib/catalogo';
import { categoriaUrl } from '../../Utils/catalogSlug';

/**
 * Productos del catálogo relacionados con la comparativa. Si la base no responde o no hay stock,
 * no muestra nada (la guía sigue funcionando sola).
 */
export default async function ProductosComparativa({ titulo, categorias, verTodos }) {
  let productos = [];
  try {
    productos = await productosParaComparativa(categorias, 8);
  } catch (e) {
    console.error('[ProductosComparativa]', e);
  }
  if (!productos.length) return null;

  const enlaces = verTodos ?? categorias.map((c) => ({ nombre: c, href: categoriaUrl(c) }));

  return (
    <section aria-labelledby="comparativa-productos" className="w-full border-t border-gray-300 bg-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="comparativa-productos" className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            {titulo}
          </h2>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {enlaces.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-lg font-semibold text-gray-900 underline underline-offset-4 hover:text-orange-800">
                  Ver todo en {l.nombre.toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <CatalogoGrid productos={productos} />
        </div>
      </div>
    </section>
  );
}
