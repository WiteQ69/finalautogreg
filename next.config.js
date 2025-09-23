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

  // ⬇️ DODAJ TO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // UWAŻNIE: jeśli masz już CSP gdzie indziej, scal wartości.
            // Poniżej minimalny CSP zezwalający na iframe FB.
            value: [
              "default-src 'self' https: data: blob:",
              "img-src 'self' https: data: blob:",
              "style-src 'self' 'unsafe-inline' https:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              // najważniejsze — pozwól na ramki z FB
              "frame-src https://www.facebook.com https://staticxx.facebook.com",
              "connect-src 'self' https:",
              "media-src 'self' https: data:",
              "frame-ancestors 'self'"
            ].join('; ')
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;
