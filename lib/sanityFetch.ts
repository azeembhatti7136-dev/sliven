// src/lib/sanityFetch.ts - READ ONLY, NO TOKEN
import { createClient } from '@sanity/client';

export const fetchClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: true,
  perspective: 'published',
  // 👇 Yeh line add karein - auth issue fix karne ke liye
  token: undefined,
  // 👇 Agar ab bhi error aaye toh yeh bhi add karein
  ignoreBrowserTokenWarning: true,
});