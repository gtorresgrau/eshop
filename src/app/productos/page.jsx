import LandingCatalogo from '../../components/Catalogo/LandingCatalogo';
import { listarProductos, listarCategorias, listarMarcas, filtroBusqueda } from '../../lib/catalogo';
import { defaultMetadata } from '../../lib/metadata';

export const revalidate = 21600; // 6 horas

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

const parsePagina = (sp) => Math.max(1, Number(sp?.page) || 1);
const parseQ = (sp) => String(sp?.q ?? '').trim().slice(0, 80);

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const pagina = parsePagina(sp);
  const q = parseQ(sp);
  const sufijo = pagina > 1 ? ` - Página ${pagina}` : '';
  const canonical = pagina > 1 && !q ? `${SITE}/productos?page=${pagina}` : `${SITE}/productos`;
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
    // Las búsquedas no se indexan: se indexan las categorías y marcas
    robots: q
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function CatalogoPage({ searchParams }) {
  const sp = await searchParams;
  const pagina = parsePagina(sp);
  const q = parseQ(sp);
  const [{ productos, total, totalPaginas }, categorias, marcas] = await Promise.all([
    listarProductos({ filtro: filtroBusqueda(q), pagina }),
    listarCategorias(),
    listarMarcas(),
  ]);

  return (
    <LandingCatalogo
      h1="Insumos informáticos y dispositivos"
      intro="Componentes, accesorios y dispositivos electrónicos con envío a todo el país. Elegí una categoría o una marca en el menú, o buscá lo que necesitás."
      productos={productos}
      total={total}
      totalPaginas={totalPaginas}
      pagina={pagina}
      basePath="/productos"
      migaNombre="Productos"
      categorias={categorias}
      marcas={marcas}
      q={q}
    />
  );
}
