'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { urlFor } from '@/lib/sanity'; // 👈 Centralized super safe wrapper use kiya
import RichTextRenderer from './RichTextRenderer';

interface Collection {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  image?: any;
  products?: any[];
}

interface FeaturedCollectionsProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  collections: Collection[];
  layout?: 'grid' | 'featured' | 'masonry';
  backgroundColor?: string;
}

export default function FeaturedCollections({
  sectionLabel,
  title,
  subtitle,
  collections,
  layout = 'grid',
  backgroundColor = '#ffffff',
}: FeaturedCollectionsProps) {
  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  if (!collections || collections.length === 0) return null;

  // Grid Layout
  const GridLayout = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
      {collections.map((collection, index) => (
        <CollectionCard key={collection._id} collection={collection} index={index} compact />
      ))}
    </div>
  );

  // Featured Layout (1 large + rest small)
  const FeaturedLayout = () => {
    const firstCollection = collections[0];
    let firstCollectionImgUrl = '';
    
    if (firstCollection?.image) {
      try {
        firstCollectionImgUrl = typeof firstCollection.image === 'string' && firstCollection.image.startsWith('http')
          ? firstCollection.image
          : urlFor(firstCollection.image).width(800).height(600).url();
      } catch (err) {
        console.error("Error building first collection image:", err);
      }
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* First collection - Large */}
        {firstCollection && (
          <Link
            href={`/collections/${firstCollection.slug?.current || '#'}`}
            className="group relative overflow-hidden rounded-3xl bg-gray-100 min-h-[400px] lg:min-h-[500px] shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            {firstCollectionImgUrl ? (
              <Image
                src={firstCollectionImgUrl}
                alt={firstCollection.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-100 to-orange-200">
                <Package className="w-20 h-20 text-amber-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold text-white mb-2">{firstCollection.title}</h3>
              {firstCollection.description && (
                <p className="text-white/70 text-sm line-clamp-2">{firstCollection.description}</p>
              )}
              <span className="inline-flex items-center gap-2 text-white font-semibold mt-4 group-hover:gap-3 transition-all">
                Explore Collection <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        )}

        {/* Rest collections - Small grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {collections.slice(1, 5).map((collection, index) => (
            <CollectionCard
              key={collection._id}
              collection={collection}
              index={index + 1}
              compact
            />
          ))}
        </div>
      </div>
    );
  };

  // Collection Card Component
  const CollectionCard = ({
    collection,
    index,
    compact = true,
  }: {
    collection: Collection;
    index: number;
    compact?: boolean;
  }) => {
    const gradientOverlays = [
      'from-amber-500/20 to-orange-600/40',
      'from-blue-500/20 to-cyan-600/40',
      'from-green-500/20 to-emerald-600/40',
      'from-purple-500/20 to-pink-600/40',
      'from-rose-500/20 to-red-600/40',
      'from-indigo-500/20 to-blue-600/40',
    ];

    const gradientBg = gradientOverlays[index % gradientOverlays.length];
    
    let cardImageUrl = '';
    if (collection?.image) {
      try {
        cardImageUrl = typeof collection.image === 'string' && collection.image.startsWith('http')
          ? collection.image
          : urlFor(collection.image).width(600).height(400).url();
      } catch (err) {
        console.error("Error building card image URL:", err);
      }
    }

    return (
      <Link
        href={`/collections/${collection.slug?.current || '#'}`}
        className={`group relative overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
          compact ? 'min-h-[200px]' : 'min-h-[300px]'
        }`}
      >
        {cardImageUrl ? (
          <Image
            src={cardImageUrl}
            alt={collection.title || 'Collection Image'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {collection.title}
              </h3>
              {collection.products && (
                <p className="text-white/60 text-sm">
                  {collection.products.length} products
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-all duration-300 text-white">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Product Count Badge */}
        {collection.products && collection.products.length > 0 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {collection.products.length} items
          </div>
        )}
      </Link>
    );
  };

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {/* Decorative Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-30" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section Label */}
        {sectionLabel && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              {sectionLabel}
            </span>
          </div>
        )}

        {/* Title */}
        <div className={`text-center mb-4 ${textColor}`}>
          <RichTextRenderer content={title} />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className={`text-center ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed mb-12`}>
            {subtitle}
          </p>
        )}

        {/* Collections Layout */}
        {layout === 'featured' ? <FeaturedLayout /> : <GridLayout />}
      </div>
    </section>
  );
}