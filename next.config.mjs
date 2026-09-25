/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
  async rewrites() {
    return [
      {
        source: '/Upload/:path*',
        destination: 'https://tak12.com/Upload/:path*',
      },
    ];
  },
};

export default nextConfig;
