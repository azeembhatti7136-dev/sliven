// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  // 👇 Client-side ke liye token undefined rakhein
  token: undefined,
  ignoreBrowserTokenWarning: true,
});

const builder = createImageUrlBuilder({
  projectId,
  dataset,
});

export function urlFor(source: any) {
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