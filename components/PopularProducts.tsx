// src/components/PopularProducts.tsx
'use client';

import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
import ProductCard from './ProductCard';

interface Product {
  _id: string;
  title?: string;
  name?: string;
  slug: { current: string };
  price: number;
  compareAtPrice?: number;
  images?: Array<{ _key: string; asset: any; alt?: string }>;
  image?: any;
  features?: string[];
  stock?: number;
  quoteSettings?: {
    enableQuote: boolean;
    quoteButtonText?: string;
  };
}

interface PopularProductsProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  products: Product[];
  showViewAll?: boolean;
  viewAllText?: string;
  backgroundColor?: string;
}

export default function PopularProducts({
  sectionLabel,
  title,
  subtitle,
  products,
  showViewAll = true,
  viewAllText = 'View All Products',
  backgroundColor = '#f9fafb',
}: PopularProductsProps) {
  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  if (!products || products.length === 0) return null;

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {/* Decorative Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 left-10 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-32 right-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-30" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-14">
          {/* Label */}
          {sectionLabel && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {sectionLabel}
              </span>
            </div>
          )}

          {/* Title */}
          <div className={textColor}>
            <RichTextRenderer content={title} />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className={`mt-4 ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 hover:gap-3 shadow-lg hover:shadow-xl active:scale-95"
            >
              {viewAllText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}