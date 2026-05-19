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
  
  serverExternalPackages: [
    '@sanity/client',
    '@sanity/image-url',
    '@sanity/eventsource',  // 👈 ADD
    'get-it',               // 👈 ADD
    'next-sanity',
    'sanity',
    '@sanity/visual-editing',
    '@sanity/preview-url-secret',
  ],
};

export default nextConfig;