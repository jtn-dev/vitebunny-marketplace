/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https', // Assuming source.unsplash.com uses https
        hostname: 'source.unsplash.com',
      },
    ],
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
