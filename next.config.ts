import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  
  // 👇 Sanity packages ko client bundle se exclude karein
  serverExternalPackages: ['@sanity/client', '@sanity/image-url'],
};

export default nextConfig;