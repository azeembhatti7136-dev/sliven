// src/lib/queries.ts
import { client } from './sanity';

export async function getAllProducts(): Promise<any[]> {
  return client.fetch(`*[_type == "simpleProduct"] | order(title asc) {
    _id, title, slug, sku, brand, manufacturer, color, pattern,
    images[] { _key, asset->, alt },
    "collections": collections[]->{_id, title, slug},  // ✅ CHANGED: plural + all collections
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
        asset->
      },
      "collections": collections[]->{  // ✅ CHANGED: plural + all collections
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

export async function getAllCollections(): Promise<any[]> {
  return client.fetch(`*[_type == "simpleCollection"] | order(title asc) {
    _id, title, slug, description, image,
    "productCount": count(*[_type == "simpleProduct" && references(^._id)])
  }`);  // ✅ CHANGED: using references() for multi-collection support
}

export async function getCollectionBySlug(slug: string): Promise<any> {
  return client.fetch(`*[_type == "simpleCollection" && slug.current == $slug][0] {
    _id, title, slug, description, image,
    "products": *[_type == "simpleProduct" && references(^._id)] | order(title asc) {  // ✅ CHANGED
      _id, title, slug, price, compareAtPrice, brand, manufacturer, color, pattern,
      "images": images[] { _key, asset->, alt },
      "image": images[0],
      features, specifications, stock, tags, quoteSettings
    }
  }`, { slug });
}

export async function getFeaturedProducts(limit: number = 8): Promise<any[]> {
  return client.fetch(`*[_type == "simpleProduct"][0..${limit - 1}] {
    _id, title, slug, brand, manufacturer, color, pattern,
    "image": images[0],
    "collections": collections[]->{_id, title, slug},  // ✅ CHANGED: plural + all collections
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
      "image": images[0],
      features,
      stock,
      tags,
      quoteSettings,
      "collections": collections[]->{  // ✅ CHANGED: plural + all collections
        _id,
        title,
        slug
      }
    }
  `, { collectionId, currentSlug });
}
// Get all pages
export async function getAllPages(): Promise<any[]> {
  return client.fetch(`
    *[_type == "page"] | order(title asc) {
      _id,
      title,
      slug,
      showHero,
      hero {
        backgroundImage,
        overlayOpacity,
        title,
        subtitle,
        showButton,
        buttonText,
        buttonLink,
        textAlignment,
        height
      },
      "seoImage": seo.image
    }
  `);
}