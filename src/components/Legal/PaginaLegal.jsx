import Link from 'next/link';
import ClientLayout from '../../app/ClientLayout';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

/** Envoltorio común de las páginas de políticas. El contenido sale en el HTML (server component). */
export default function PaginaLegal({ titulo, bajada, ruta, actualizado, children }) {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE },
      { '@type': 'ListItem', position: 2, name: titulo, item: `${SITE}${ruta}` },
    ],
  };

  return (
    <ClientLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="mx-auto w-full max-w-3xl bg-white px-4 py-8">
        <nav aria-label="Migas de pan" className="mb-3 text-xs text-gray-500">
          <Link href="/" className="hover:underline">Inicio</Link> <span aria-hidden="true">/</span> {titulo}
        </nav>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{titulo}</h1>
        {bajada && <p className="mt-2 text-sm text-gray-600">{bajada}</p>}
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">{children}</div>
        {actualizado && (
          <p className="mt-12 border-t border-gray-200 pt-4 text-xs text-gray-500">
            Última actualización: {actualizado}
          </p>
        )}
      </main>
    </ClientLayout>
  );
}

export function Seccion({ titulo, children }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-bold text-gray-900">{titulo}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
