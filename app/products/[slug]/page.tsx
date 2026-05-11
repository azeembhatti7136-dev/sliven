// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import ProductPageClient from './ProductPageClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  
  // ✅ FIXED: Use first collection from the plural array
  const collectionId = product.collections?.[0]?._id;
  const relatedProducts = collectionId 
    ? await getRelatedProducts(collectionId, slug) 
    : [];
  
  // Key prop forces complete re-mount on slug change
  return <ProductPageClient key={slug} product={product} relatedProducts={relatedProducts} />;
}

export async function generateStaticParams() {
  const { getAllProducts } = await import('@/lib/queries');
  const products = await getAllProducts();
  return products.map((p: any) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return { title: product.title };
}