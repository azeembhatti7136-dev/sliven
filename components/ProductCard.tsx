// src/components/ProductCard.tsx
'use client';  // 👈 ADD THIS!


import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import QuoteButton from './QuoteButton';
function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const match = image.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const id = match[1];
  const fmt = match[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}


export default function ProductCard({ product, compact = false }: { product: any; compact?: boolean }) {
  const isQuoteProduct = product.quoteSettings?.enableQuote || false;
  const imageUrl = product.imageUrl || product.image; // 👈 Use pre-processed URL or fallback

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col ${compact ? 'w-[380px] h-[450px]' : ''}`}>
      <Link href={`/products/${product.slug.current}`} className={`relative overflow-hidden bg-gray-50 ${compact ? 'aspect-square max-h-[380px]' : 'aspect-square'}`}>
        {imageUrl ? (
          <Image 
            src={imageUrl} // 👈 Direct URL
            alt={product.title} 
            fill 
            sizes={compact ? "200px" : "(max-width: 640px) 100vw, 25vw)"} 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <Package className={compact ? "w-8 h-8" : "w-12 h-12"} />
          </div>
        )}
        {product.stock === 0 && (
          <div className={`absolute top-2 left-2 bg-gray-900 text-white font-bold rounded-full ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}>Out of Stock</div>
        )}
        {isQuoteProduct && (
          <div className={`absolute top-2 right-2 bg-amber-500 text-white font-bold rounded-full shadow-lg ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'}`}>Quote</div>
        )}
      </Link>
      
      <div className={`flex flex-col flex-1 ${compact ? 'p-2.5' : 'p-4'}`}>
        {product.collection && (
          <Link href={`/collections/${product.collection.slug?.current}`} className={`text-amber-600 font-medium uppercase tracking-wider hover:text-amber-700 ${compact ? 'text-[10px]' : 'text-xs'}`}>
            {product.collection.title}
          </Link>
        )}
        <Link href={`/products/${product.slug.current}`}>
          <h3 className={`font-semibold text-gray-900 hover:text-amber-600 ${compact ? 'text-m mt-0.5 line-clamp-2' : 'mt-1 line-clamp-2'}`}>
            {product.title}
          </h3>
        </Link>
        
        <div className={`${compact ? 'mt-2' : 'mt-auto pt-3 border-t border-gray-50'}`}>
          {product.stock === 0 ? (
            <button disabled className={`w-full bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed ${compact ? 'text-xs py-1.5' : 'text-sm py-2.5'}`}>
              Out of Stock
            </button>
          ) : (
            <QuoteButton
              productId={product._id}
              productName={product.title}
              productImage={product.images?.[0]}
              productSku={product.sku}
              productCollection={product.collection?.title}
              buttonText={product.quoteSettings?.quoteButtonText || 'Get Quote'}
              className="w-full text-sm py-2.5"
            />
          )}
        </div>
      </div>
    </div>
  );
}

