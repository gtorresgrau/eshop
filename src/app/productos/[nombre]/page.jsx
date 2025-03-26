import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { defaultMetadata } from '@/lib/metadata';
import fetchProduct from './fetchProduct';

// Componentes dinámicos
const Modal = dynamic(() => import('@/components/Tienda/Modal/Modals'));
const ClientLayout = dynamic(() => import('@/app/ClientLayout'));

// ✅ `generateMetadata` optimizado
export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.nombre);

  if (!product) {
    return {
      ...defaultMetadata,
      title: 'Producto no encontrado',
      description: 'No se encontró el producto solicitado.',
      robots: 'noindex, nofollow',
    };
  }

  // ✅ Generar imagen de Open Graph en JPG
  const imagenUrlJPG = product.foto_1_1
    ? product.foto_1_1.replace('.webp', '.jpg')
    : defaultMetadata.openGraph.images[0].url.replace('.webp', '.jpg');

  const productTitle = `${product.nombre} - ${product.modelo} - ${product.categoria} - ${product.marca} - E-ShopDevices`;
  const productDescription = `${product.nombre} - ${product.modelo} - ${product.categoria} - ${product.marca} - E-Shop Devices ${product.descripcion?.slice(0, 200) || ''}`;
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/productos/${params.nombre}`;

  return {
    ...defaultMetadata,
    title: productTitle,
    description: productDescription,
    keywords: `${product.titulo_de_producto} - E-Shop Devices ${product.descripcion?.slice(0, 200) || ''}`,
    icons: [{ url: imagenUrlJPG }],

    openGraph: {
      ...defaultMetadata.openGraph,
      title: productTitle,
      description: productDescription,
      images: [
        {
          url: imagenUrlJPG,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
        },
      ],
      url: productUrl,
      type: 'product',
    },

    twitter: {
      ...defaultMetadata.twitter,
      title: productTitle,
      description: productDescription,
      images: [
        {
          url: imagenUrlJPG,
          width: 1200,
          height: 630,
          type: 'image/jpeg',
        },
      ],
    },

    alternates: {
      canonical: productUrl,
    },
  };
}

// ✅ `ProductoPage` optimizado
export default async function ProductoPage({ params }) {
  const product = await fetchProduct(params.nombre);

  if (!product) return notFound(); // Página 404 si el producto no existe

  return (
    <ClientLayout className="flex flex-col h-screen" title={product.nombre}>
      <main className="flex-1 flex items-center justify-center bg-white">
        <Modal selectedProduct={product} isDialog={false} />
      </main>
    </ClientLayout>
  );
}
