/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // CHANGE: 'export' allows static HTML deployment to Hostinger Shared Hosting.
  // If you move to a VPS later, change this back to 'standalone'.
  output: 'export',

  // CHANGE: Default Image Optimization API is not compatible with static export.
  images: {
    unoptimized: true,
  },

  // CHANGE: Helps with routing on static hosts (creates /about/index.html instead of /about.html)
  trailingSlash: true,

  // CHANGE: Rewrites are not supported in static export.
  // API calls must be direct URLs in the client code.
  /*
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` : 'http://tabdeel-backend:3001/api/:path*',
      },
    ];
  },
  */
}

module.exports = nextConfig