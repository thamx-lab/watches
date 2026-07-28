import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  turbopack: {
    // Point turbopack to this directory (front/) as the workspace root
    // to avoid workspace root confusion from pnpm-lock.yaml in parent dir
    root: __dirname,
  },
};

export default nextConfig;
