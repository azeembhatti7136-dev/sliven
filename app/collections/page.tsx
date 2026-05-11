// src/app/collections/page.tsx
import { getAllCollections } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import Image from 'next/image';

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {collections.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No collections yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link
                key={collection._id}
                href={`/collections/${collection.slug.current}`}
                className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] hover:shadow-xl transition-all duration-300"
              >
                {collection.image ? (
                  <Image
                    src={urlFor(collection.image).width(600).height(450).url()}
                    alt={collection.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">{collection.title}</h3>
                  {collection.description && (
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <p className="text-white/60 text-xs mt-2">
                    {collection.products?.length || 0} products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}