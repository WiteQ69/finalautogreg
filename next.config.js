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
};

module.exports = nextConfig;
