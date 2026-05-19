import { client } from './sanityClient.server';

export async function getAllProducts(): Promise<any[]> {
  return client.fetch(`*[_type == "simpleProduct"] | order(title asc) {
    _id, title, slug, sku, brand, manufacturer, color, pattern,
    images[] { _key, asset->{ url }, alt },
    "imageUrl": images[0].asset->url,
    "collections": collections[]->{_id, title, slug},
    price, compareAtPrice, features, specifications, stock, tags, quoteSettings
  }`);
}

export async function getProductBySlug(slug: string) {
  return client.fetch(`
    *[_type == "simpleProduct" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      sku,
      brand,
      manufacturer,
      color,
      pattern,
      description,
      features,
      stock,
      tags,
      quoteSettings,
      "images": images[] {
        _key,
        "alt": alt,
        asset->{ url }
      },
      "imageUrl": images[0].asset->url,
      "collections": collections[]->{
        _id,
        title,
        slug
      },
      specifications {
        brand,
        manufacturer,
        color,
        pattern,
        composition,
        fabricType,
        apparelType,
        productionType,
        use
      }
    }
  `, { slug });
}

// ⚡ FIXED: Image projection ko hataya taake original ref object builder ko mile
// ⚡ EXTRA: products array ko fetch kiya taake page par card ke neeche count breakdown theek ho sake
export async function getAllCollections(): Promise<any[]> {
  return client.fetch(`*[_type == "simpleCollection"] | order(title asc) {
    _id, 
    title, 
    slug, 
    description, 
    image, // 👈 Pura sanity image reference pass karein, direct url projection nahi!
    "imageUrl": image.asset->url,
    "productCount": count(*[_type == "simpleProduct" && references(^._id)]),
    "products": *[_type == "simpleProduct" && references(^._id)] { _id } // 👈 Frontend array lengths fallback ke liye zaroori hai
  }`);
}

export async function getCollectionBySlug(slug: string): Promise<any> {
  return client.fetch(`*[_type == "simpleCollection" && slug.current == $slug][0] {
    _id, title, slug, description, 
    image, // 👈 Cleaned up
    "imageUrl": image.asset->url,
    "products": *[_type == "simpleProduct" && references(^._id)] | order(title asc) {
      _id, title, slug, price, compareAtPrice, brand, manufacturer, color, pattern,
      "images": images[] { _key, asset->{ url }, alt },
      "imageUrl": images[0].asset->url,
      "image": images[0] { asset->{ url } },
      features, specifications, stock, tags, quoteSettings
    }
  }`, { slug });
}

export async function getFeaturedProducts(limit: number = 8): Promise<any[]> {
  return client.fetch(`*[_type == "simpleProduct"][0..${limit - 1}] {
    _id, title, slug, brand, manufacturer, color, pattern,
    "image": images[0] { asset->{ url } },
    "imageUrl": images[0].asset->url,
    "collections": collections[]->{_id, title, slug},
    price, compareAtPrice, stock, quoteSettings
  }`);
}

export async function getRelatedProducts(collectionId: string, currentSlug: string) {
  if (!collectionId) return [];
  
  return client.fetch(`
    *[_type == "simpleProduct" && 
      $collectionId in collections[]._ref && 
      slug.current != $currentSlug
    ] | order(title asc) [0...8] {
      _id,
      title,
      slug,
      "image": images[0] { asset->{ url } },
      "imageUrl": images[0].asset->url,
      features,
      stock,
      tags,
      quoteSettings,
      "collections": collections[]->{
        _id,
        title,
        slug
      }
    }
  `, { collectionId, currentSlug });
}

// Get all pages (Fixed Image Fetching for urlFor Builder)
export async function getAllPages(): Promise<any[]> {
  return client.fetch(`
    *[_type == "page"] | order(title asc) {
      _id,
      title,
      slug,
      showHero,
      hero {
        backgroundImage, // 👈 FIXED: Pura image reference pass karein, direct url projection hata di
        overlayOpacity,
        title,
        subtitle,
        showButton,
        buttonText,
        buttonLink,
        textAlignment,
        height
      },
      "seoImage": seo.image // 👈 Object query match structure
    }
  `);
}