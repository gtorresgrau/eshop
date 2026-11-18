import NextDynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { defaultMetadata } from '../../../lib/metadata';
import fetchProduct from '../../../Utils/fetchProduct';
import { getProductPath } from '../../../Utils/productSlug';
import { categoriaUrl } from '../../../Utils/catalogSlug';
import { parsePrecio } from '../../../Utils/parsePrecio';
import { estaAgotado } from '../../../Utils/estadoProducto';
import Link from 'next/link';
import CatalogoGrid from '../../../components/Catalogo/CatalogoGrid';
import { listarProductos } from '../../../lib/catalogo';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const Modal = NextDynamic(() => import('../../../components/Tienda/Modal/Modals'));
const ClientLayout = NextDynamic(() => import('../../ClientLayout'));

// Sin barra final: según el entorno la env var viene con o sin ella y rompería las URLs.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

const clean = (s = '') => String(s).replace(/\s+/g, ' ').trim();
const truncate = (s = '', n = 160) => {
  if (!s || s.length <= n) return s;
  const cut = s.slice(0, n);
  const i = cut.lastIndexOf(' ');
  return (i > 50 ? cut.slice(0, i) : cut).trim() + '…';
};
const toAbs = (u = '') => {
  if (!u || typeof u !== 'string') return null;
  try { return new URL(u, SITE).toString(); } catch { return null; }
};
const safeDecode = (s = '') => {
  try { return decodeURIComponent(s); } catch { return s; }
};

export async function generateMetadata({ params }) {
  const { nombre: rawSlug = '' } = await params;
  const product = await fetchProduct(safeDecode(rawSlug));
  const metadataBase = new URL(SITE);

  if (!product) {
    return {
      ...defaultMetadata,
      metadataBase,
      title: 'Producto no encontrado | Eshop Devices',
      description: 'No se encontró el producto solicitado.',
      robots: { index: false, follow: false },
    };
  }

  // Canónica construida con la MISMA función que usa el botón compartir y el sitemap.
  const canonical = `${SITE}${getProductPath(product)}`;
  const nombre = clean(product.nombre);
  const marca = clean(product.marca);
  const categoria = clean(product.categoria);
  const modelo = clean(product.modelo);

  const title = [nombre, marca && !nombre.toLowerCase().includes(marca.toLowerCase()) ? marca : '']
    .filter(Boolean).join(' - ') + ' | Eshop Devices';
  const description = truncate([
    nombre,
    categoria,
    estaAgotado(product) ? 'Consultá disponibilidad' : 'En stock',
    'Envíos a todo el país',
    clean(product.descripcion),
  ].filter(Boolean).join('. '), 160);

  const defaultOg = defaultMetadata.openGraph?.images?.[0];
  const defaultOgUrl = (typeof defaultOg === 'string' ? defaultOg : defaultOg?.url) || `${SITE}/logos/logoEshop.webp`;
  const ogImages = [product.foto_1_1, product.foto_1_2, product.foto_1_3, product.foto_1_4]
    .map(toAbs)
    .filter(Boolean)
    .map((url) => ({ url, alt: `${nombre} - ${marca}` }));
  if (ogImages.length === 0) ogImages.push({ url: defaultOgUrl, alt: nombre });

  const keywords = Array.from(new Set([
    nombre, modelo, categoria, marca, 'Eshop Devices', 'insumos informáticos', 'Wilde', 'Argentina',
  ])).filter(Boolean).join(', ');

  return {
    ...defaultMetadata,
    metadataBase,
    title,
    description,
    keywords,
    icons: undefined, // evita pisar el favicon del sitio con la foto del producto
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'Eshop Devices',
      locale: 'es_AR',
      images: ogImages,
    },
    twitter: {
      ...defaultMetadata.twitter,
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((i) => ({ url: i.url, alt: i.alt })),
    },
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  };
}

export default async function ProductoPage({ params }) {
  const { nombre: rawSlug } = await params;
  if (!rawSlug) return notFound();
  const product = await fetchProduct(safeDecode(rawSlug));
  if (!product) return notFound(); // 404 real si el producto no existe

  const nombre = clean(product.nombre);
  const categoria = clean(product.categoria);
  const marca = clean(product.marca);
  const url = `${SITE}${getProductPath(product)}`;
  const precio = parsePrecio(product.precio);

  // Más productos de la misma categoría (reemplaza al catálogo completo que se cargaba debajo)
  let relacionados = [];
  if (categoria) {
    try {
      const { productos } = await listarProductos({ filtro: { categoria }, porPagina: 9 });
      relacionados = productos.filter((p) => p.cod_producto !== product.cod_producto).slice(0, 8);
    } catch (e) {
      console.error('[PDP] relacionados:', e);
    }
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: nombre,
    image: [product.foto_1_1, product.foto_1_2, product.foto_1_3, product.foto_1_4].map(toAbs).filter(Boolean),
    description: clean(product.descripcion) || nombre,
    sku: product.cod_producto || String(product._id || ''),
    mpn: product.cod_producto || undefined,
    brand: marca ? { '@type': 'Brand', name: marca } : undefined,
    category: categoria || undefined,
    model: clean(product.modelo) || undefined,
    offers: precio > 0
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: product.usd ? 'USD' : 'ARS',
          price: precio.toFixed(2),
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          availability: estaAgotado(product) ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          itemCondition: product.usado ? 'https://schema.org/UsedCondition' : 'https://schema.org/NewCondition',
          seller: { '@type': 'Organization', name: 'Eshop Devices', url: SITE },
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Productos', item: `${SITE}/productos` },
      { '@type': 'ListItem', position: 3, name: categoria || 'Categoría', item: `${SITE}${categoria ? categoriaUrl(categoria) : '/productos'}` },
      { '@type': 'ListItem', position: 4, name: nombre, item: url },
    ],
  };

  return (
    <ClientLayout className="flex flex-col h-screen" title={product.name}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="flex-1 bg-white">
        <nav aria-label="Migas de pan" className="mx-auto w-full max-w-screen-xl px-4 pt-6 text-sm text-gray-700 lg:px-8">
          <Link href="/" className="hover:underline">Inicio</Link> <span aria-hidden="true">/</span>{' '}
          <Link href="/productos" className="hover:underline">Productos</Link>
          {categoria ? (
            <>
              {' '}<span aria-hidden="true">/</span>{' '}
              <Link href={categoriaUrl(categoria)} className="hover:underline">{categoria}</Link>
            </>
          ) : null}
        </nav>

        <Modal selectedProduct={product} isDialog={false} />

        {relacionados.length > 0 && (
          <section className="mx-auto w-full max-w-screen-xl px-4 pb-16 pt-4 lg:px-8" aria-labelledby="relacionados-h2">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 id="relacionados-h2" className="text-2xl font-extrabold tracking-tight text-gray-900">Más de {categoria}</h2>
              <Link href={categoriaUrl(categoria)} className="text-base font-semibold text-orange-800 hover:underline">Ver todos</Link>
            </div>
            <CatalogoGrid productos={relacionados} />
          </section>
        )}
      </main>
    </ClientLayout>
  );
}
