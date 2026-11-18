// Sin barra final: si la env var la trae, el sitemap saldría como "https://dominio//sitemap.xml".
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eshopdevices.com').replace(/\/+$/, '');

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/Admin', '/api/', '/user/', '/Shopcart', '/Dashboard', '/mp/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/Admin', '/user/'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
