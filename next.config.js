/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { dev }) => {
    if (dev) config.cache = false;
    return config;
  },
  async redirects() {
    return [
      { source: '/ogloszenie/:slug*', destination: '/auta', permanent: true },
      { source: '/sprzedane', destination: '/auta', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https: data: blob:",
              "style-src 'self' 'unsafe-inline' https:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              // ⚠️ tu dopuszczamy ramki z FB i z Google Maps
              "frame-src https://www.facebook.com https://staticxx.facebook.com https://www.google.com https://maps.google.com;",
              // obrazy do map (markery/tiles/avatars)
              "img-src 'self' https: data: blob: https://maps.gstatic.com https://*.googleusercontent.com https://*.ggpht.com;",
              "connect-src 'self' https:",
              "media-src 'self' https: data:",
              "frame-ancestors 'self'",
            ].join(' ')
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
