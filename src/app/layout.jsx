
import React from 'react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ShoppingCartProvider } from '@/components/Context/ShoopingCartContext';
import Script from 'next/script';

export const metadata = {
  title: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
  description: "Eshop Devices es tu aliado tecnológico en Wilde, especializado en la venta de insumos informáticos y dispositivos electrónicos. Con atención personalizada y asesoramiento experto, la solución ideal para el hogar y negocio.Componentes, accesorios y gadgets de última generación como la fuente adaptador para Starlink Mini",
  keywords: 'repuestos para computadoras, ecommerce, eshop devices, dispositivos informaticos, insumos de informatica, memorias, ssd, disco solido, mvne, Starlink Mini, cable adaptador, elevador de tension para Starlink Mini - Trifix SL1230, mejora conexión satelital, conexion en ruta, elevador de tension 12V a 35V, fuente para starlink mini, fuente adaptador para conexion satelital',
  charSet: 'UTF-8',
  icons: '/favicon.ico',
  manifest: '/manifest.json',
  robots: '/robots.txt',
  authors: [{ name: 'Gonzalo Torres Grau', url: 'https://gonzalotorresgrau.com' }],
  publisher: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
  canonical: 'https://eshopdevices.com/',
  openGraph: {
    title: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
    site_name:'E-Shop Devices',
    description: "Eshop Devices es tu aliado tecnológico en Wilde, especializado en la venta de insumos informáticos y dispositivos electrónicos. Con atención personalizada y asesoramiento experto, la solución ideal para el hogar y negocio.Componentes, accesorios y gadgets de última generación como la fuente adaptador para Starlink Mini",
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
};

export default function RootLayout({ children }) {
    

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#007BC7" />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.authors[0].name} />
        <meta name="robots" content="index, follow" />
        <meta name="publisher" content={metadata.publisher} />
        <meta name="rating" content="General" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.image} />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:site_name" content={metadata.openGraph.site_name} />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.image} />

        {/* Icons */}
        <link rel="icon" href={metadata.icons} sizes="any" type="image/x-icon" />
        <link rel="shortcut icon" href={metadata.icons} />

        {/* Manifest */}
        <link rel="manifest" href={metadata.manifest} />

        {/* Fonts and External Resources */}
        <link rel="canonical" href={metadata.canonical} />
        <link rel="preconnect" href="https://eshop-34a07.firebaseapp.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://apis.google.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        
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
              "telephone": "+541136317470",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Las Flores 1600",
                "addressLocality": "Wilde",
                "addressRegion": "Buenos Aires",
                "postalCode": "1875",
                "addressCountry": "AR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -34.698322,
                "longitude": -58.313978
              },
              "openingHours": "Mo-Fr 09:00-18:00, Sa 10:00-14:00",
              "priceRange": "$$",
              "sameAs": [
                "https://www.instagram.com/gonzalotorresgrau"
              ],
              "hasMap": "https://www.google.com/maps/place/Las+Flores+1600,+Wilde,+Buenos+Aires"
            }),
          }}
        />
        {/* <!-- Google tag (gtag.js) --> */}
        <Script id="google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7LRLRDC81W', {
                page_path: window.location.pathname,
                });
                `,
              }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7LRLRDC81W" strategy="afterInteractive"/>

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
