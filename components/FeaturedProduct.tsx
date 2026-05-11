// src/components/FeaturedProduct.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Star, ShoppingCart } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
import QuoteButton from './QuoteButton';
import { urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

interface Product {
  _id: string;
  title?: string;
  name?: string;
  slug: { current: string };
  sku?: string;
  price: number;
  compareAtPrice?: number;
  images?: any[];
  description?: any;
  features?: string[];
  stock?: number;
  tags?: string[];
  quoteSettings?: {
    enableQuote: boolean;
    quoteButtonText?: string;
  };
}

interface FeaturedProductProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  product: Product;
  layout?: 'imageLeft' | 'imageRight';
  showFeatures?: boolean;
  showFullDescription?: boolean;
  backgroundColor?: string;
}

export default function FeaturedProduct({
  sectionLabel,
  title,
  subtitle,
  product,
  layout = 'imageLeft',
  showFeatures = true,
  showFullDescription = false,
  backgroundColor = '#ffffff',
}: FeaturedProductProps) {
  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

  if (!product) return null;

  const productName = product.title || product.name || 'Product';
  const isQuoteProduct = product.quoteSettings?.enableQuote || false;
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const isReversed = layout === 'imageRight';

  const productDetails = (
    <div className="flex flex-col justify-center space-y-6 p-6 sm:p-8 lg:p-10">
      {/* Section Label */}
      {sectionLabel && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200 w-fit">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          {sectionLabel}
        </span>
      )}

      {/* Product Name */}
      <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textColor}`}>
        {productName}
      </h2>

      {/* SKU */}
      {product.sku && (
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
          SKU: {product.sku}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className={`text-3xl lg:text-4xl font-bold ${textColor}`}>
          ₹{product.price?.toLocaleString('en-IN')}
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <>
            <span className={`text-xl line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              ₹{product.compareAtPrice.toLocaleString('en-IN')}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {product.stock && product.stock > 0 ? (
          <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            In Stock ({product.stock} available)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Quote Alert */}
      {isQuoteProduct && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 font-semibold text-sm">📋 Custom Quote Required</p>
          <p className="text-amber-600 text-xs mt-1">Fill the form and we'll get back with pricing</p>
        </div>
      )}

      {/* Features */}
      {showFeatures && product.features && product.features.length > 0 && (
        <div className="space-y-2">
          <h4 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Key Features
          </h4>
          <ul className="space-y-2">
            {product.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-amber-600" />
                </div>
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Description */}
      {showFullDescription && product.description && (
        <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}>
          <PortableText value={product.description} />
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag, i) => (
            <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        {isQuoteProduct ? (
         <QuoteButton
  productId={product._id}
  productName={productName}
  productImage={product.images?.[0]}  // 👈 ADD
  productSku={product.sku}
  productCollection={product.collection?.title}
  buttonText={product.quoteSettings?.quoteButtonText || 'Get Quote'}
  className="px-8 py-3.5 text-base"
/>
        ) : (
          <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        )}
        <Link
          href={`/products/${product.slug?.current}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-900 hover:text-gray-900 transition-all duration-300"
        >
          View Details
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );

  const imageBlock = (
    <div className="relative group h-full min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        {product.images?.[0] ? (
          <Image
            src={urlFor(product.images[0]).width(800).height(800).url()}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ShoppingCart className="w-20 h-20 text-gray-300" />
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            {discount}% OFF
          </div>
        )}

        {/* Quote Badge */}
        {isQuoteProduct && (
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
            Quote Only
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl opacity-20 -z-10" />
      <div className="absolute -top-3 -left-3 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl opacity-10 -z-10" />
    </div>
  );

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {/* Decorative Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-50 rounded-full blur-3xl opacity-30" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={textColor}>
            <RichTextRenderer content={title} textColor={textColor} headingColor={textColor} />
          </div>
          {subtitle && (
            <p className={`mt-4 ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Product Card */}
        <div className={`${cardBg} rounded-3xl border ${borderColor} shadow-xl overflow-hidden`}>
          <div className="grid lg:grid-cols-2">
            {isReversed ? (
              <>
                {productDetails}
                {imageBlock}
              </>
            ) : (
              <>
                {imageBlock}
                {productDetails}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}