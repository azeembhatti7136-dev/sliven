// src/app/api/menu/route.ts
import { NextResponse } from 'next/server';
import { fetchClient } from '@/lib/sanityFetch.server';

export async function GET() {
  try {
    const data = await fetchClient.fetch(`{
      "settings": *[_type == "settings"][0] {
        menu {
          logo, logoText, logoWidth,
          megaMenu {
            enabled, title, showImages, viewAllText, viewAllUrl,
            columns[] {
              _key, title,
              links[] { label, url, image }
            }
          },
          links[] { label, url },
          headerStyle { backgroundColor, sticky, showSearch, showCTA, ctaText, ctaUrl }
        }
      },
      "collections": *[_type == "simpleCollection"] | order(title asc) { _id, title, slug, image }
    }`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}