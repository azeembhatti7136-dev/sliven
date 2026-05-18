// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// 1. Explicit Fallbacks define karein taake client-side initialization crash na ho
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Client bundle safe execution ke liye defaults useCdn true rakhein
});

// 2. Image Builder ko explicit object dein bina full client pass kiye
const builder = createImageUrlBuilder({
  projectId,
  dataset,
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