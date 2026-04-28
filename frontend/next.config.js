/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // CHANGE: Changed to 'standalone' for VPS Docker deployment.
  output: 'standalone',

  // CHANGE: Default Image Optimization API works with standalone output.
  images: {
    unoptimized: true,
  },

  // CHANGE: Disable trailingSlash for VPS deployment, as it is mostly for static hosts.
  trailingSlash: false,

  // CHANGE: Enable rewrites for VPS Docker deployment to connect to the backend container.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` : 'http://tabdeel_backend:3001/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig