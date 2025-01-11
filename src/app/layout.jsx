import React from 'react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ShoppingCartProvider } from '@/components/Context/ShoopingCartContext';

export const metadata = {
  title: 'eshop | Venta de insumos de informatica para tus dispositivos electronicos',
  description: "Central CAM es tu proveedor confiable de repuestos de alta calidad para camiones y vehículos pesados. Ofrecemos una amplia gama de repuestos y accesorios para mantener tus vehículos en óptimas condiciones, con envío rápido, atención personalizada y presupuestos gratuitos.",
  keywords: 'repuestos para camiones, vehículos pesados, mecánica, piezas de camiones, accesorios, envíos rápidos, ecommerce, Central CAM',
  charSet: 'UTF-8',
  icons: '/favicon.ico',
  manifest: '/manifest.json',
  robots: '/robots.txt',
  authors: [{ name: 'Programundo', url: 'https://programundo.dev' }],
  publisher: 'CENTRAL CAM | Venta de Repuestos para Camiones y Vehículos Pesados',
  openGraph: {
    title: 'CENTRAL CAM | Venta de Repuestos para Camiones y Vehículos Pesados',
    description: "Encuentra en Central CAM una amplia gama de repuestos y accesorios para camiones y vehículos pesados. Calidad garantizada y envíos a todo el país.",
    type: 'website',
    url: 'https://centralcamshop.com/',
    image: 'https://centralcamshop.com/logos/LogoCentral.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet={metadata.charSet} />
        <meta name="viewport" content="minimum-scale=1, width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.authors[0].name} />
        <meta name="robots" content="index, follow" />
        <meta name="publisher" content={metadata.publisher} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.image} />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.openGraph.title} />
        <meta name="twitter:description" content={metadata.openGraph.description} />
        <meta name="twitter:image" content={metadata.openGraph.image} />

        {/* Icons */}
        <link rel="icon" href={metadata.icons} sizes="any" type="image/x-icon" />
        <link rel="shortcut icon" href={metadata.icons} />

        {/* Manifest */}
        <link rel="manifest" href={metadata.manifest} />

        {/* Fonts and External Resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="canonical" href={metadata.openGraph.url} />

        {/* Preload Critical Resources */}
        <link rel="preload" href="/bg/bg-banner.webp" as="image" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" as="style" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": metadata.title,
              "description": metadata.description,
              "image": metadata.openGraph.image,
              "url": metadata.openGraph.url,
              "telephone": "+541162574919",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av Champagnat 1167",
                "addressLocality": "Mar del Plata",
                "addressRegion": "Mar del Plata",
                "postalCode": "B7604",
                "addressCountry": "Argentina",
              },
              "sameAs": [
                "https://www.instagram.com/centralcamshop/",
              ],
            }),
          }}
        />
      </head>
      <body>
        <ShoppingCartProvider>
          {children}
          <Toaster />
        </ShoppingCartProvider>
      </body>
    </html>
  );
}
