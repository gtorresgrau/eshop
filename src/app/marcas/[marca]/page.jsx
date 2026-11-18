import { notFound } from 'next/navigation';
import LandingCatalogo from '../../../components/Catalogo/LandingCatalogo';
import { listarProductos, listarMarcas } from '../../../lib/catalogo';
import { toKebab, resolveFromSlug, marcaUrl } from '../../../Utils/catalogSlug';
import { defaultMetadata } from '../../../lib/metadata';

export const revalidate = 21600; // 6 horas
export const dynamicParams = true;

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

export async function generateStaticParams() {
  try {
    const marcas = await listarMarcas();
    return marcas.map((m) => ({ marca: toKebab(m.valor) }));
  } catch (e) {
    console.error('[marcas/generateStaticParams]', e);
    return [];
  }
}

async function resolver(slug) {
  const marcas = await listarMarcas();
  return { nombre: resolveFromSlug(slug, marcas.map((m) => m.valor)), marcas };
}

const parsePagina = (sp) => Math.max(1, Number(sp?.page) || 1);

export async function generateMetadata({ params, searchParams }) {
  const [{ marca }, sp] = await Promise.all([params, searchParams]);
  const { nombre } = await resolver(marca || '');
  if (!nombre) return { title: 'Marca no encontrada | Eshop Devices', robots: { index: false, follow: false } };
  const pagina = parsePagina(sp);
  const sufijo = pagina > 1 ? ` - Página ${pagina}` : '';
  const base = `${SITE}${marcaUrl(nombre)}`;
  const canonical = pagina > 1 ? `${base}?page=${pagina}` : base;
  const title = `Productos ${nombre}${sufijo} | Eshop Devices`;
  const description = `Productos ${nombre} en Eshop Devices, Wilde. Consultá precio y disponibilidad. Envíos a todo el país.`;
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

export default async function MarcaPage({ params, searchParams }) {
  const [{ marca: slug }, sp] = await Promise.all([params, searchParams]);
  const { nombre, marcas } = await resolver(slug || '');
  if (!nombre) return notFound();

  const pagina = parsePagina(sp);
  const { productos, total, totalPaginas } = await listarProductos({ filtro: { marca: nombre }, pagina });

  const relacionados = marcas
    .filter((m) => m.valor !== nombre)
    .slice(0, 24)
    .map((m) => ({ href: marcaUrl(m.valor), label: m.valor, total: m.total }));

  return (
    <LandingCatalogo
      h1={`Productos ${nombre}`}
      intro={`${total} productos de la marca ${nombre}. Mirá el detalle, el precio y la disponibilidad de cada uno y comprá con envío a todo el país.`}
      productos={productos}
      total={total}
      totalPaginas={totalPaginas}
      pagina={pagina}
      basePath={marcaUrl(nombre)}
      migaNombre={nombre}
      migaPadreUrl="/productos"
      migaPadreNombre="Productos"
      relacionados={relacionados}
      relacionadosTitulo="Otras marcas"
    />
  );
}
