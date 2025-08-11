// next.config.mjs
import withBundleAnalyzer from '@next/bundle-analyzer';

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
        source: '/user/Login',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
      {
        source: '/user/Register',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'unsafe-none' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
