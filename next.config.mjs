/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
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
