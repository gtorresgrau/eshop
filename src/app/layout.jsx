import React from 'react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ShoppingCartProvider } from '../components/Context/ShoopingCartContext';
import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-K7JJH3KT';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#007BC7" />
        
        {/* ✅ Solo mantenemos los íconos y manifest */}
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        {/* Google Tag Manager (contenedor GTM-K7JJH3KT). La etiqueta de Google dentro del contenedor
            mide G-7LRLRDC81W; no cargar gtag.js aparte o se duplican las vistas de página.
            `gtag` queda definido como atajo que empuja al dataLayer: lo usan Utils/analytics.js
            y mp/success para los eventos de embudo (add_to_cart, begin_checkout, purchase...). */}
        <Script id="gtm-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}/>
      </head>
      <body>
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="Google Tag Manager" />
        </noscript>
        <ShoppingCartProvider>
          {children}
          <Toaster />
        </ShoppingCartProvider>
      </body>
    </html>
  );
}
