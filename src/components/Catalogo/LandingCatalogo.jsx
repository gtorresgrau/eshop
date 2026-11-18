import Link from 'next/link';
import ClientLayout from '../../app/ClientLayout';
import CatalogoGrid from './CatalogoGrid';
import Paginacion from './Paginacion';
import SidebarFiltros from './SidebarFiltros';
import BuscadorCatalogo from './BuscadorCatalogo';
import { getProductPath } from '../../Utils/productSlug';
import { POR_PAGINA } from '../../lib/catalogo';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

const nf = new Intl.NumberFormat('es-AR');

/**
 * Layout compartido por /categorias/[x], /marcas/[x] y /productos.
 * Server component: la grilla y los enlaces del menú salen enteros en el HTML.
 * A la izquierda, todas las categorías y marcas; a la derecha, buscador y productos.
 */
export default function LandingCatalogo({
  h1, intro, productos, total, totalPaginas, pagina, basePath, migaNombre, migaPadreUrl, migaPadreNombre,
  categorias = [], marcas = [], categoriaActiva, marcaActiva, q = '',
}) {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: h1,
    numberOfItems: total,
    itemListElement: productos.map((p, i) => ({
      '@type': 'ListItem',
      position: (pagina - 1) * POR_PAGINA + i + 1,
      url: `${SITE}${getProductPath(p)}`,
      name: p.titulo_de_producto || p.nombre,
    })),
  };

  const items = [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE }];
  if (migaPadreNombre) items.push({ '@type': 'ListItem', position: items.length + 1, name: migaPadreNombre, item: `${SITE}${migaPadreUrl}` });
  items.push({ '@type': 'ListItem', position: items.length + 1, name: migaNombre, item: `${SITE}${basePath}` });
  const breadcrumbJsonLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };

  const hayFiltro = Boolean(categoriaActiva || marcaActiva);

  return (
    <ClientLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="mx-auto w-full max-w-screen-2xl bg-white px-4 py-8 lg:px-8">
        <nav aria-label="Migas de pan" className="mb-4 text-sm text-gray-700">
          <Link href="/" className="hover:underline">Inicio</Link> <span aria-hidden="true">/</span>{' '}
          {migaPadreNombre && (
            <>
              <Link href={migaPadreUrl} className="hover:underline">{migaPadreNombre}</Link>{' '}
              <span aria-hidden="true">/</span>{' '}
            </>
          )}
          {migaNombre}
        </nav>

        <div className="grid gap-x-10 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <SidebarFiltros
            categorias={categorias}
            marcas={marcas}
            categoriaActiva={categoriaActiva}
            marcaActiva={marcaActiva}
            hayFiltro={hayFiltro}
          />

          <div className="min-w-0">
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">{h1}</h1>
            <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-gray-800">{intro}</p>

            <div className="mt-6">
              <BuscadorCatalogo action={basePath} q={q} />
            </div>

            <p className="mt-6 text-base text-gray-800" aria-live="polite">
              <strong className="font-bold text-gray-900">{nf.format(total)}</strong> {total === 1 ? 'producto' : 'productos'}
              {q ? (
                <>
                  {' '}para “{q}”.{' '}
                  <Link href={basePath} className="font-semibold text-orange-800 hover:underline">Borrar búsqueda</Link>
                </>
              ) : null}
            </p>

            <section className="mt-6">
              <h2 className="sr-only">Listado de productos</h2>
              <CatalogoGrid productos={productos} />
              <Paginacion pagina={pagina} totalPaginas={totalPaginas} basePath={basePath} q={q} />
            </section>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
