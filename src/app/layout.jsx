import React from 'react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ShoppingCartProvider } from '@/components/Context/ShoopingCartContext';

export const metadata = {
  title: 'eshopDevices | Venta de insumos de informatica para tus dispositivos electronicos',
  description: "Eshop devices es una emprendimiento de venta de insumos informaticos, orientado a la atencion personalizada y dispositivos electronicos. nos encontras en wilde. ",
  keywords: 'repuestos para computadoras, ecommerce, eshop devices, dispositivos informaticos, insumos de informatica, memorias, ssd, disco solido, mvne',
  charSet: 'UTF-8',
  icons: '/favicon.ico',
  manifest: '/manifest.json',
  robots: '/robots.txt',
  authors: [{ name: 'Gonzalo Torres Grau', url: 'https://gonzalotorresgrau.com' }],
  publisher: 'eshopDevices | Venta de insumos de informatica para tus dispositivos electronicos',
  openGraph: {
    title: 'eshopDevices | Venta de insumos de informatica para tus dispositivos electronicos',
    description: "Eshop devices es una emprendimiento de venta de insumos informaticos, orientado a la atencion personalizada y dispositivos electronicos. nos encontras en wilde.",
    type: 'website',
    url: 'https://eshopdevices.com/',
    image: 'https://eshopdevices.com/logos/logoEshop.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta charSet={metadata.charSet} />
        <meta name="viewport" content="minimum-scale=1, width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#007BC7" />
        <meta name="description" content={metadata.description} />
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="canonical" href={metadata.openGraph.url} />

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
                "addressRegion": "Avellaneda",
                "postalCode": "1875",
                "addressCountry": "Argentina",
              },
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
