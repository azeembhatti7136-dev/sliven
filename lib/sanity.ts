// src/lib/sanity.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN || '';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: token || undefined,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  // 👇 Always return builder - even for invalid images
  if (!source?.asset?._ref) {
    // Return a dummy builder that won't crash
    return {
      ...builder.image({ _type: 'image', asset: { _ref: 'image-placeholder' } }),
      url: () => 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="%23f3f4f6"><rect width="800" height="600"/></svg>',
    } as any;
  }
  return builder.image(source);
}