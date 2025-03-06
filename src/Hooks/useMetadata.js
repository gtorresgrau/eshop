import { usePathname } from "next/navigation";

export const defaultMetadata = {
    title: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
    description: "Eshop Devices es tu aliado tecnológico en Wilde, especializado en la venta de insumos informáticos y dispositivos electrónicos.",
    keywords: 'repuestos para computadoras, ecommerce, eshop devices, dispositivos informaticos, insumos de informatica, memorias, ssd, disco solido, mvne, Starlink Mini, cable adaptador, elevador de tension para Starlink Mini - Trifix SL1230, mejora conexión satelital, conexion en ruta, elevador de tension 12V a 35V, fuente para starlink mini, fuente adaptador para conexion satelital',
    charSet: 'UTF-8',
    icons: '/favicon.ico',
    manifest: '/manifest.json',
    robots: '/robots.txt',
    authors: [{ name: 'Gonzalo Torres Grau', url: 'https://gonzalotorresgrau.com' }],
    publisher: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
    openGraph: {
      title: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
      site_name: 'E-Shop Devices',
      description: "Eshop Devices es tu aliado tecnológico en Wilde, especializado en la venta de insumos informáticos y dispositivos electrónicos.",
      type: 'website',
      url: 'https://eshopdevices.com/',
      image: 'https://eshopdevices.com/logos/logoEshop.webp',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@eshopdevices',
      title: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
      description: "Eshop Devices es tu aliado tecnológico en Wilde, especializado en la venta de insumos informáticos y dispositivos electrónicos.",
      image: 'https://eshopdevices.com/logos/logoEshop.webp',
    },
    canonical: 'https://eshopdevices.com/'
};

export function useMetadata({ title, description, keywords, image }) {
    const pathname = usePathname();

    // Establecer valores predeterminados para los metadatos, por si falta alguno
    const effectiveTitle = `Eshop Devices Wilde - ${title}` || defaultMetadata.title;
    const effectiveDescription =`Eshop Devices es tu aliado tecnológico especializado en Wilde - ${description}`  || defaultMetadata.description;
    const effectiveKeywords = `Eshop Devices Wilde - ${keywords}`  || defaultMetadata.keywords;
    const effectiveImage = image || defaultMetadata.openGraph.image;

    return {
        title: `${effectiveTitle} | ${defaultMetadata.title}`,
        description: effectiveDescription,
        keywords: effectiveKeywords,
        charSet: defaultMetadata.charSet,
        icons: defaultMetadata.icons,
        manifest: defaultMetadata.manifest,
        robots: defaultMetadata.robots,
        authors: defaultMetadata.authors,
        publisher: defaultMetadata.publisher,
        openGraph: {
            title: effectiveTitle,
            description: effectiveDescription,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`,
            images: [
                {
                    url: effectiveImage,
                    width: 1200,
                    height: 630,
                    alt: effectiveTitle,
                },
            ],
        },
        twitter: {
            card: defaultMetadata.twitter.card,
            site: defaultMetadata.twitter.site,
            title: effectiveTitle,
            description: effectiveDescription,
            image: effectiveImage,
        },
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`,
    };
}
