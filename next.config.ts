import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'baz-car-server.online',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'baz-car.online',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'baz-car-server.online',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
