
import React from 'react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ShoppingCartProvider } from '@/components/Context/ShoopingCartContext';
import metadata from './metadata';
import LoadingWrapper from '@/components/Loading/LoadingWrapper';
import Script from 'next/script';


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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7LRLRDC81W" strategy="afterInteractive"/>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
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
        <LoadingWrapper>{children}</LoadingWrapper>
          <Toaster />
        </ShoppingCartProvider>
      </body>
    </html>
  );
}
