//next.config.mjs
/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  
const nextConfig = {
    images: {
        loader: 'cloudinary',
        path: 'https://res.cloudinary.com/dnbrxpca3/',
        domains: ['localhost', 'res.cloudinary.com', 'eshopdevices.vercel.app', 'eshopdevices.com'],  // Agrega dominios adicionales si es necesario
        unoptimized: true
    },
    compress: true,
};

export default withBundleAnalyzer(nextConfig);
