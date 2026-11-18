import { notFound } from 'next/navigation';
import LandingCatalogo from '../../../components/Catalogo/LandingCatalogo';
import { listarProductos, listarCategorias } from '../../../lib/catalogo';
import { toKebab, resolveFromSlug, categoriaUrl } from '../../../Utils/catalogSlug';
import { defaultMetadata } from '../../../lib/metadata';

export const revalidate = 21600; // 6 horas
export const dynamicParams = true;

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

export async function generateStaticParams() {
  try {
    const categorias = await listarCategorias();
    return categorias.map((c) => ({ categoria: toKebab(c.valor) }));
  } catch (e) {
    console.error('[categorias/generateStaticParams]', e);
    return [];
  }
}

async function resolver(slug) {
  const categorias = await listarCategorias();
  return { nombre: resolveFromSlug(slug, categorias.map((c) => c.valor)), categorias };
}

const parsePagina = (sp) => Math.max(1, Number(sp?.page) || 1);

export async function generateMetadata({ params, searchParams }) {
  const [{ categoria }, sp] = await Promise.all([params, searchParams]);
  const { nombre } = await resolver(categoria || '');
  if (!nombre) return { title: 'Categoría no encontrada | Eshop Devices', robots: { index: false, follow: false } };
  const pagina = parsePagina(sp);
  const sufijo = pagina > 1 ? ` - Página ${pagina}` : '';
  const base = `${SITE}${categoriaUrl(nombre)}`;
  const canonical = pagina > 1 ? `${base}?page=${pagina}` : base;
  const title = `${nombre}${sufijo} | Eshop Devices`;
  const description = `${nombre} en Eshop Devices, Wilde. Insumos informáticos y dispositivos electrónicos con atención personalizada y envíos a todo el país.`;
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

export default async function CategoriaPage({ params, searchParams }) {
  const [{ categoria: slug }, sp] = await Promise.all([params, searchParams]);
  const { nombre, categorias } = await resolver(slug || '');
  if (!nombre) return notFound();

  const pagina = parsePagina(sp);
  const { productos, total, totalPaginas } = await listarProductos({ filtro: { categoria: nombre }, pagina });

  const relacionados = categorias
    .filter((c) => c.valor !== nombre)
    .slice(0, 24)
    .map((c) => ({ href: categoriaUrl(c.valor), label: c.valor, total: c.total }));

  return (
    <LandingCatalogo
      h1={nombre}
      intro={`${total} productos de ${nombre.toLowerCase()}. Mirá el detalle, el precio y la disponibilidad de cada uno y comprá con envío a todo el país.`}
      productos={productos}
      total={total}
      totalPaginas={totalPaginas}
      pagina={pagina}
      basePath={categoriaUrl(nombre)}
      migaNombre={nombre}
      migaPadreUrl="/productos"
      migaPadreNombre="Productos"
      relacionados={relacionados}
      relacionadosTitulo="Otras categorías"
    />
  );
}
