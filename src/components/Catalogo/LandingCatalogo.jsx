import Link from 'next/link';
import ClientLayout from '../../app/ClientLayout';
import CatalogoGrid from './CatalogoGrid';
import Paginacion from './Paginacion';
import { getProductPath } from '../../Utils/productSlug';
import { POR_PAGINA } from '../../lib/catalogo';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

/**
 * Layout compartido por /categorias/[x], /marcas/[x] y /productos.
 * Server component: la grilla sale entera en el HTML.
 */
export default function LandingCatalogo({
  h1, intro, productos, total, totalPaginas, pagina, basePath, migaNombre, migaPadreUrl, migaPadreNombre, relacionados = [], relacionadosTitulo, children,
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

  return (
    <ClientLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="mx-auto w-full max-w-screen-xl bg-white px-3 py-6">
        <nav aria-label="Migas de pan" className="mb-3 text-xs text-gray-500">
          <Link href="/" className="hover:underline">Inicio</Link> <span aria-hidden="true">/</span>{' '}
          {migaPadreNombre && (
            <>
              <Link href={migaPadreUrl} className="hover:underline">{migaPadreNombre}</Link>{' '}
              <span aria-hidden="true">/</span>{' '}
            </>
          )}
          {migaNombre}
        </nav>

        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{h1}</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">{intro}</p>

        {children}

        <section className="mt-8">
          <h2 className="sr-only">Listado de productos</h2>
          <CatalogoGrid productos={productos} />
          <Paginacion pagina={pagina} totalPaginas={totalPaginas} basePath={basePath} />
        </section>

        {relacionados.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-700">{relacionadosTitulo}</h2>
            <ul className="flex flex-wrap gap-2">
              {relacionados.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-orange-500 hover:text-orange-600"
                  >
                    {r.label} <span className="text-gray-400">({r.total})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </ClientLayout>
  );
}
