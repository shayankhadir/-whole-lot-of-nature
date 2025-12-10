/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Treat build errors as warnings to allow Vercel deployment
  experimental: {
    missingSuspenseWithCSRBailout: false,
    optimizeCss: true, // Enable CSS optimization
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wholelotofnature.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.wholelotofnature.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Required for WooCommerce REST API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, stale-while-revalidate=600' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/learn-gardening',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/learn-gardening/:path*',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig