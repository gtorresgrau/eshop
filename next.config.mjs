// next.config.mjs
import withBundleAnalyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';

const directives = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  isProd ? "upgrade-insecure-requests" : null,
  `script-src 'self'${isProd ? '' : " 'unsafe-eval'"} 'unsafe-inline' https://www.googletagmanager.com https://sdk.mercadopago.com https://apis.google.com https://www.gstatic.com`,
  // Explicit element-level script policy (fallback otherwise uses script-src)
  `script-src-elem 'self'${isProd ? '' : " 'unsafe-eval'"} 'unsafe-inline' https://www.googletagmanager.com https://sdk.mercadopago.com https://apis.google.com https://www.gstatic.com`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.mercadopago.com https://www.google-analytics.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://api.mercadopago.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.google-analytics.com https://stats.g.doubleclick.net https://www.googleapis.com",
  "frame-src https://www.youtube.com https://drive.google.com https://*.mercadopago.com https://eshop-34a07.firebaseapp.com https://*.firebaseapp.com https://*.web.app",
  "frame-ancestors 'self'",
  "worker-src 'self' blob:",
].filter(Boolean);

const csp = directives.join('; ');

const nextConfig = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dnbrxpca3/',
    domains: ['localhost', 'res.cloudinary.com', 'eshopdevices.vercel.app', 'eshopdevices.com'],
    unoptimized: true,
  },
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Content-Security-Policy", value: csp.replace(/\s{2,}/g, " ").trim() },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
