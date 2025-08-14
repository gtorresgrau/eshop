// next.config.mjs
import withBundleAnalyzer from '@next/bundle-analyzer';

const csp = `
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://sdk.mercadopago.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: blob: https://res.cloudinary.com https://*.mercadopago.com;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://api.mercadopago.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com;
frame-src https://www.youtube.com https://drive.google.com https://*.mercadopago.com;
`;

const nextConfig = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dnbrxpca3/',
    domains: ['localhost', 'res.cloudinary.com', 'eshopdevices.vercel.app', 'eshopdevices.com'],
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.mercadopago.com" },
    ],
  },
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
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
