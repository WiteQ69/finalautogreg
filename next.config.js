/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false; // 👈 wyłącza problematyczny cache
    }
    return config;
  },
  async redirects() {
    return [
      { source: '/ogloszenie/:slug*', destination: '/auta', permanent: true },
      { source: '/sprzedane', destination: '/auta', permanent: true },
    ];
  },
};

module.exports = nextConfig;
