// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url'; // 👈 Named export use kiya

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN, 
});

// 👈 client ko as an argument pass karne ke bajay config object pass karein
const builder = createImageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

export function urlFor(source: any) {
  // If source is invalid, return builder with a valid dummy image
  if (!source?.asset?._ref && !source?._ref) {
    return builder.image({
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: 'image-0000000000000000000000000000000000000000-1x1-png',
      },
    });
  }
  return builder.image(source);
}