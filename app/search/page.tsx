// src/app/search/page.tsx
import { client } from '@/lib/sanityClient.server';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

async function searchProducts(query: string) {
  if (!query) return [];
  return client.fetch(
    `*[_type == "simpleProduct" && (title match $query || tags[] match $query || features[] match $query)] {
      _id, title, slug, sku,
      "images": images[] { _key, asset->, alt },
      "collection": collection->{_id, title, slug},
      price, compareAtPrice, features, stock, tags, quoteSettings
    }`,
    { query: `*${query}*` } as any
  );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = params?.q || '';
  const products = q ? await searchProducts(q) : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-500 mb-8">{q ? `Showing results for "${q}"` : 'Enter a search term'}</p>
        {products.length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-400">No products found.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}