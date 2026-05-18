// src/lib/sanityFetch.ts - READ ONLY, NO TOKEN
import { createClient } from '@sanity/client';

export const fetchClient = createClient({
  projectId: 'd2zeiu5j',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  // NO TOKEN - read only safe for browser
});