/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'res.cloudinary.com', 'eshopdevices.vercel.app'],  // Agrega dominios adicionales si es necesario
        unoptimized: true
    },
    compress: true,
};

export default nextConfig;
