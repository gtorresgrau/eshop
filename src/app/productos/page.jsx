import Link from 'next/link';
import LandingCatalogo from '../../components/Catalogo/LandingCatalogo';
import { listarProductos, listarCategorias, listarMarcas } from '../../lib/catalogo';
import { categoriaUrl, marcaUrl } from '../../Utils/catalogSlug';
import { defaultMetadata } from '../../lib/metadata';

export const revalidate = 21600; // 6 horas

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

const parsePagina = (sp) => Math.max(1, Number(sp?.page) || 1);

export async function generateMetadata({ searchParams }) {
  const pagina = parsePagina(await searchParams);
  const sufijo = pagina > 1 ? ` - Página ${pagina}` : '';
  const canonical = pagina > 1 ? `${SITE}/productos?page=${pagina}` : `${SITE}/productos`;
  const title = `Catálogo de insumos informáticos y dispositivos${sufijo} | Eshop Devices`;
  const description =
    'Catálogo completo de Eshop Devices en Wilde: memorias, discos SSD, placas, fuentes, accesorios y dispositivos electrónicos. Buscá por categoría o marca. Envíos a todo el país.';
  return {
    ...defaultMetadata,
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: { canonical },
    openGraph: { ...defaultMetadata.openGraph, title, description, url: canonical },
    twitter: { ...defaultMetadata.twitter, title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

const Chips = ({ titulo, id, items, urlFn }) =>
  items.length > 0 && (
    <section className="mt-6" aria-labelledby={id}>
      <h2 id={id} className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-700">{titulo}</h2>
      <ul className="flex flex-wrap gap-2">
        {items.map((c) => (
          <li key={c.valor}>
            <Link
              href={urlFn(c.valor)}
              className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:border-orange-500 hover:text-orange-600"
            >
              {c.valor} <span className="text-gray-400">({c.total})</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );

export default async function CatalogoPage({ searchParams }) {
  const pagina = parsePagina(await searchParams);
  const [{ productos, total, totalPaginas }, categorias, marcas] = await Promise.all([
    listarProductos({ pagina }),
    listarCategorias(),
    listarMarcas(),
  ]);

  return (
    <LandingCatalogo
      h1="Catálogo de insumos informáticos y dispositivos"
      intro={`${total} productos entre insumos informáticos, componentes, accesorios y dispositivos electrónicos. Elegí una categoría o una marca, o recorré el catálogo completo.`}
      productos={productos}
      total={total}
      totalPaginas={totalPaginas}
      pagina={pagina}
      basePath="/productos"
      migaNombre="Productos"
    >
      <Chips titulo="Por categoría" id="cat-h2" items={categorias} urlFn={categoriaUrl} />
      <Chips titulo="Por marca" id="marca-h2" items={marcas} urlFn={marcaUrl} />
    </LandingCatalogo>
  );
}
