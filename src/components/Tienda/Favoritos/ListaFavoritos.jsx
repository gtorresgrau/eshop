'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '../Card/Card';
import { useFavoritos } from '../../Context/FavoritosContext';
import { getProductPath } from '../../../Utils/productSlug';

const CONT = 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8';

/** Productos guardados con el corazón. Se guardan en este navegador. */
export default function ListaFavoritos() {
  const { favoritos } = useFavoritos();
  const router = useRouter();

  return (
    <div className={`${CONT} py-12 lg:py-20`}>
      <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl">Mis favoritos</h1>
      <p className="mt-4 max-w-[56ch] text-xl leading-relaxed text-gray-900">
        {favoritos.length > 0
          ? `${favoritos.length} ${favoritos.length === 1 ? 'producto guardado' : 'productos guardados'} en este dispositivo.`
          : 'Guardá productos con el corazón y los encontrás acá.'}
      </p>

      {favoritos.length > 0 ? (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {favoritos.map((p) => (
            <li key={p.cod_producto}>
              <Card product={p} handleProductSelect={(prod) => router.push(getProductPath(prod))} />
            </li>
          ))}
        </ul>
      ) : (
        <Link
          href="/productos"
          className="mt-10 inline-flex h-14 items-center bg-orange-700 px-8 text-lg font-semibold text-white transition-colors hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2"
        >
          Ver el catálogo
        </Link>
      )}
    </div>
  );
}
