import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { defaultMetadata } from '@/lib/metadata';

const Modal = dynamic(() => import('@/components/Tienda/Modal/Modals'));
const ClientLayout = dynamic(() => import('@/app/ClientLayout'));

async function fetchProduct(nombre) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/productos/${nombre}`, {
      cache: "no-store", // Evita caché y asegura datos frescos
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return null;
  }
}

// ✅ `generateMetadata` con mejor compatibilidad
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

  // 📌 Forzar imagen en JPG para Facebook y Twitter
  const imagenUrlJPG = product.foto_1_1
    ? product.foto_1_1.replace('.webp', '.jpg')
    : defaultMetadata.openGraph.images[0].url.replace('.webp', '.jpg');

  return {
    ...defaultMetadata,
    title: product.nombre
      ? `${product.nombre} - ${product.modelo} - ${product.categoria} - ${product.marca} - E-ShopDevices`
      : defaultMetadata.title,
    description: product.descripcion
      ? `${product.nombre} - ${product.modelo} - ${product.categoria} - ${product.marca} - E-Shop Devices ${product.descripcion.slice(0, 200)}`
      : defaultMetadata.description,
    keywords: product.titulo_de_producto
      ? `${product.titulo_de_producto} - E-Shop Devices ${product.descripcion.slice(0, 200)}`
      : defaultMetadata.keywords,
    icons: [{ url: imagenUrlJPG }],

    openGraph: {
      ...defaultMetadata.openGraph,
      title: product.nombre
        ? `${product.nombre} - ${product.modelo} - ${product.categoria} - ${product.marca} - E-ShopDevices`
        : defaultMetadata.openGraph.title,
      description: product.descripcion
        ? `${product.nombre} - ${product.modelo} - ${product.categoria} - ${product.marca} - E-Shop Devices ${product.descripcion.slice(0, 200)}`
        : defaultMetadata.description,
      images: [
        {
          url: imagenUrlJPG,
          width: 1200,
          height: 630,
          type: "image/jpeg", // Asegura compatibilidad con Open Graph
        },
      ],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/productos/${params.nombre}`,
      type: 'website',
    },

    twitter: {
      ...defaultMetadata.twitter,
      title: product.nombre || defaultMetadata.twitter.title,
      description: product.descripcion
        ? `${product.nombre} - ${product.modelo} - ${product.categoria} - ${product.marca} - E-Shop Devices ${product.descripcion.slice(0, 200)}`
        : defaultMetadata.description,
      images: [
        {
          url: imagenUrlJPG,
          width: 1200,
          height: 630,
          type: "image/jpeg",
        },
      ],
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/productos/${params.nombre}`,
    },
  };
}

// ✅ `ProductoPage` con mejor control de errores
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
