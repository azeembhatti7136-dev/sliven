// src/app/api/menu/route.ts
import { NextResponse } from 'next/server';
import { fetchClient } from '@/lib/sanityFetch.server';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

function urlFor(source: any) {
  if (!source?.asset?._ref) return null;
  return builder.image(source);
}

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
    
    // 👇 Process logo URL
    if (data?.settings?.menu?.logo) {
      const logoBuilder = urlFor(data.settings.menu.logo);
      if (logoBuilder) {
        data.settings.menu.logoUrl = logoBuilder.width(data.settings.menu.logoWidth || 200).url();
      }
    }
    
    // 👇 Process mega menu image URLs
    if (data?.settings?.menu?.megaMenu?.columns) {
      data.settings.menu.megaMenu.columns = data.settings.menu.megaMenu.columns.map((col: any) => ({
        ...col,
        links: (col.links || []).map((link: any) => ({
          ...link,
          imageUrl: link.image ? urlFor(link.image)?.width(64).height(64).url() : null,
        })),
      }));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}