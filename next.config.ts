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
  
  // 👇 ALL Sanity packages ko client bundle se exclude karein
  serverExternalPackages: [
    '@sanity/client',
    '@sanity/image-url',
    'next-sanity',
    'sanity',
    '@sanity/visual-editing',
    '@sanity/preview-url-secret',
  ],
};

export default nextConfig;