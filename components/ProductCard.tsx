'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import QuoteButton from './QuoteButton';

export default function ProductCard({ product, compact = false }: { product: any; compact?: boolean }) {
  const isQuoteProduct = product.quoteSettings?.enableQuote || false;
  
  // ═══════════════════════════════════════
  // 🔍 IMAGE DEBUG BLOCK START
  // ═══════════════════════════════════════
  
  console.group(`🛒 ProductCard: ${product.title || 'Untitled'}`);
  
  // 1. Check all available fields
  console.log('1️⃣ All product keys:', Object.keys(product));
  
  // 2. Check imageUrl
  console.log('2️⃣ product.imageUrl:', product.imageUrl, `(type: ${typeof product.imageUrl})`);
  
  // 3. Check image (if exists)
  console.log('3️⃣ product.image:', product.image, `(type: ${typeof product.image})`);
  
  // 4. Check images array
  console.log('4️⃣ product.images:', product.images, `(type: ${typeof product.images})`);
  
  // 5. Deep check if image object exists
  if (product.image && typeof product.image === 'object') {
    console.log('5️⃣ product.image.asset:', product.image.asset);
    console.log('6️⃣ product.image.asset?._ref:', product.image.asset?._ref);
    console.log('7️⃣ product.image.asset?.url:', product.image.asset?.url);
  }
  
  // 6. Check images array first element
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    console.log('8️⃣ product.images[0]:', product.images[0]);
    console.log('9️⃣ product.images[0].asset:', product.images[0]?.asset);
    console.log('🔟 product.images[0].asset?.url:', product.images[0]?.asset?.url);
  }
  
  // ═══════════════════════════════════════
  // IMAGE URL RESOLUTION LOGIC
  // ═══════════════════════════════════════
  
  let imageUrl = '';
  
  // Priority 1: Direct imageUrl string from query
  if (product.imageUrl && typeof product.imageUrl === 'string') {
    imageUrl = product.imageUrl;
    console.log('✅ Using product.imageUrl:', imageUrl);
  }
  // Priority 2: image object with expanded asset->url
  else if (product.image?.asset?.url) {
    imageUrl = product.image.asset.url;
    console.log('✅ Using product.image.asset.url:', imageUrl);
  }
  // Priority 3: images array first element with expanded asset->url
  else if (product.images?.[0]?.asset?.url) {
    imageUrl = product.images[0].asset.url;
    console.log('✅ Using product.images[0].asset.url:', imageUrl);
  }
  // Priority 4: Build URL from asset reference
  else if (product.image?.asset?._ref) {
    const ref = product.image.asset._ref;
    const parts = ref.split('-');
    if (parts.length >= 4) {
      const [, id, dimensions, ext] = parts;
      imageUrl = `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${dimensions}.${ext}`;
      console.log('✅ Built URL from image._ref:', imageUrl);
    }
  }
  // Priority 5: Build URL from images[0] reference
  else if (product.images?.[0]?.asset?._ref) {
    const ref = product.images[0].asset._ref;
    const parts = ref.split('-');
    if (parts.length >= 4) {
      const [, id, dimensions, ext] = parts;
      imageUrl = `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${dimensions}.${ext}`;
      console.log('✅ Built URL from images[0]._ref:', imageUrl);
    }
  }
  // Priority 6: image is already a string URL
  else if (typeof product.image === 'string') {
    imageUrl = product.image;
    console.log('✅ Using product.image as string:', imageUrl);
  }
  
  // Final check
  if (!imageUrl) {
    console.error('❌ NO IMAGE URL FOUND - Showing placeholder');
    console.log('💡 Product data:', JSON.stringify(product, null, 2).substring(0, 500));
  } else {
    console.log('🎯 Final resolved imageUrl:', imageUrl);
  }
  
  console.groupEnd();
  
  // ═══════════════════════════════════════
  // 🔍 IMAGE DEBUG BLOCK END
  // ═══════════════════════════════════════

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col ${compact ? 'w-[380px] h-[450px]' : ''}`}>
      <Link href={`/products/${product.slug?.current}`} className={`relative overflow-hidden bg-gray-50 ${compact ? 'aspect-square max-h-[380px]' : 'aspect-square'}`}>
        {imageUrl ? (
          <Image 
            src={imageUrl}
            alt={product.title} 
            fill 
            unoptimized 
            sizes={compact ? "200px" : "(max-width: 640px) 100vw, 25vw"} 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onLoad={() => console.log(`✅ Image loaded: ${product.title}`)}
            onError={(e) => console.error(`❌ Image failed: ${product.title}`, imageUrl)}
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
        <Link href={`/products/${product.slug?.current}`}>
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
              productImage={imageUrl}
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