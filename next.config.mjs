/** @type {import('next').NextConfig} */

// The product applications live on their own hosts. Keeping the destinations in
// env means a staging build points at staging without a code change.
const PORTAL_URL = process.env.PORTAL_URL ?? 'https://portal.one.algoryq.com';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This app is self-contained; pin the root so Next doesn't walk up into the
  // monorepo (or the home directory) looking for a lockfile.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Legacy marketing URLs keep working (website/docs/03 §4).
      { source: '/features', destination: '/product/revenue', permanent: true },
      { source: '/about', destination: '/company/about', permanent: true },
      { source: '/contact', destination: '/company/contact', permanent: true },
      { source: '/blog', destination: '/resources/blog', permanent: true },
      { source: '/changelog', destination: '/resources/changelog', permanent: true },

      // Sign-in and sign-up belong to the product, not the marketing site.
      { source: '/signup', destination: `${PORTAL_URL}/register`, permanent: false },
      { source: '/login', destination: `${PORTAL_URL}/login`, permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
