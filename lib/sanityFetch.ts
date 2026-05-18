// src/lib/sanityFetch.ts - READ ONLY, NO TOKEN
import { createClient } from '@sanity/client';

export const fetchClient = createClient({
  projectId: 'd2zeiu5j',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // 👈 Client side fetches ke liye useCdn: true rakhna behtar aur safe hai
  perspective: 'published', // 👈 explicit perspective add ki takay auth internal checks bypass hon
});