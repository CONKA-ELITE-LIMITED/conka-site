import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 1024, 1280],
    minimumCacheTTL: 31536000,
  },

  // Redirects
  async redirects() {
    return [
      // Trial: route start/lander traffic to the B variants. Temporary (307) on
      // purpose — easy to reverse without browsers hard-caching the redirect.
      {
        source: '/start',
        destination: '/start-b',
        permanent: false,
      },
      {
        source: '/lander',
        destination: '/lander-b',
        permanent: false,
      },
      {
        source: '/startv2',
        destination: '/start',
        permanent: true,
      },
      {
        source: '/blogs/:path*',
        destination: 'https://www.conka.io/why-conka',
        permanent: true,
      },
      {
        source: '/products/:path*',
        destination: '/conka-both',
        permanent: true,
      },
      {
        source: '/shop',
        destination: '/conka-both',
        permanent: true,
      },
      {
        source: '/quiz/:path*',
        destination: '/funnel',
        permanent: true,
      },
      {
        source: '/shop/:path*',
        destination: '/conka-both',
        permanent: true,
      },
      {
        source: '/protocol/:path*',
        destination: '/conka-both',
        permanent: true,
      },
      {
        source: '/durhamuniversityresearch',
        destination: '/',
        permanent: true,
      },
      // Expired contest pages, deleted 2026-07-14 (SCRUM-1140). Both were live
      // and indexable long after their January 2026 deadlines, so Google could
      // serve a dead competition as a CONKA result.
      {
        source: '/win',
        destination: '/',
        permanent: true,
      },
      {
        source: '/barrys',
        destination: '/',
        permanent: true,
      },
      {
        source: '/welcome-to-conka',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pages/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/formula-01',
        destination: '/conka-flow',
        permanent: true,
      },
      {
        source: '/formula-02',
        destination: '/conka-clarity',
        permanent: true,
      },
      {
        source: '/help',
        destination: '/account/login',
        permanent: true,
      },
    ];
  },

  // Security headers for all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
