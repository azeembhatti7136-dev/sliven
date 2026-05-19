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
    // ⚡ GROQ Query Updated: 'navItems' array fetch kar rahe hain jo simple links aur mega menus dono ko order mein layega
    const data = await fetchClient.fetch(`{
      "settings": *[_type == "settings"][0] {
        menu {
          logo, logoText, logoWidth,
          navItems[] {
            _type,
            _key,
            // Simple Link fields
            label, url,
            // Mega Menu fields
            title, showImages, viewAllText, viewAllUrl,
            columns[] {
              _key, title,
              links[] { label, url, image }
            }
          },
          headerStyle { backgroundColor, sticky, showSearch, showCTA, ctaText, ctaUrl }
        }
      },
      "collections": *[_type == "simpleCollection"] | order(title asc) { _id, title, slug, image }
    }`);
    
    const menu = data?.settings?.menu;

    if (menu) {
      // 1. Process logo URL (Same as before)
      if (menu.logo) {
        const logoBuilder = urlFor(menu.logo);
        if (logoBuilder) {
          menu.logoUrl = logoBuilder.width(menu.logoWidth || 200).url();
        }
      }
      
      // 2. Process Multi Mega Menu Image URLs inside 'navItems' array
      if (menu.navItems && Array.isArray(menu.navItems)) {
        menu.navItems = menu.navItems.map((item: any) => {
          // Agar yeh item megaMenu hai, toh iske columns ke andar ki saari images resolve karein
          if (item._type === 'megaMenu' && item.columns) {
            return {
              ...item,
              columns: item.columns.map((col: any) => ({
                ...col,
                links: (col.links || []).map((link: any) => ({
                  ...link,
                  imageUrl: link.image ? urlFor(link.image)?.width(64).height(64).url() : null,
                })),
              })),
            };
          }
          // Agar simple link hai, toh bina ched-chad ke return kar dein
          return item;
        });
      }
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Menu API error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}