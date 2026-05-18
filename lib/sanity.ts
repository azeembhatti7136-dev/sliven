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
  token: token || undefined, // 👈 Empty string → undefined
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source?.asset?._ref) {
    return {
      url: () => '/placeholder.png',
      width: () => 800,
      height: () => 800,
    };
  }
  return builder.image(source);
}