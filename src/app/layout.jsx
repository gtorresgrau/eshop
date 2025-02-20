"use client";
import React from 'react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ShoppingCartProvider } from '@/components/Context/ShoopingCartContext';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/components/Loading";

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
  openGraph: {
    title: 'Eshop Devices Wilde Insumos Informáticos profesionales y standard',
    description: "Eshop Devices es tu aliado tecnológico en Wilde, especializado en la venta de insumos informáticos y dispositivos electrónicos. Con atención personalizada y asesoramiento experto, la solución ideal para el hogar y negocio.Componentes, accesorios y gadgets de última generación como la fuente adaptador para Starlink Mini",
    type: 'website',
    url: 'https://eshopdevices.com/',
    image: 'https://eshopdevices.com/logos/logoEshop.webp',
  },
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Simula una carga rápida
    return () => clearTimeout(timeout);
  }, [pathname]);

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
        <link rel="canonical" href={metadata.openGraph.url} />
        <link rel="preconnect" href="https://res.cloudinary.com" />


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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7LRLRDC81W"></script>
        <script dangerouslySetInnerHTML={{
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

      </head>
      <body>
        <ShoppingCartProvider>
          {loading && <Loading />}
          {children}
          <Toaster />
        </ShoppingCartProvider>
      </body>
    </html>
  );
}
