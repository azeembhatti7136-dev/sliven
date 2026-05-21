// src/app/products/[slug]/ProductPageClient.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { Package, ChevronLeft, ChevronRight } from 'lucide-react';
import QuoteButton from '@/components/QuoteButton';
import ProductCard from '@/components/ProductCard';

const richTextComponents = {
  block: {
    normal: ({children}: any) => <p className="text-gray-900 leading-relaxed mb-4">{children}</p>,
    h1: ({children}: any) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-xl font-bold text-gray-900 mt-5 mb-2">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
    h4: ({children}: any) => <h4 className="text-base font-semibold text-gray-900 mt-3 mb-1">{children}</h4>,
  },
  list: {
    bullet: ({children}: any) => <ul className="list-disc list-inside space-y-1 text-gray-900 mb-4 ml-2">{children}</ul>,
    number: ({children}: any) => <ol className="list-decimal list-inside space-y-1 text-gray-900 mb-4 ml-2">{children}</ol>,
  },
  listItem: {
    bullet: ({children}: any) => <li className="text-gray-900 leading-relaxed">{children}</li>,
    number: ({children}: any) => <li className="text-gray-900 leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({children}: any) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({children}: any) => <em className="italic text-gray-900">{children}</em>,
    link: ({children, value}: any) => <Link href={value?.href || '#'} className="text-amber-600 underline hover:text-amber-800" target={value?.blank ? '_blank' : '_self'}>{children}</Link>,
  },
};

export default function ProductPageClient({ product, relatedProducts }: { product: any; relatedProducts: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const imageRef = useRef<HTMLDivElement>(null);

  const allImages = product.images || [];
  const specs = product.specifications || {};
  const collections = product.collections || [];

  // ✅ Preload images using direct URLs
  useEffect(() => {
    allImages.forEach((img: any, index: number) => {
      if (img.url) {
        const image = new window.Image();
        image.src = img.url + '?w=1200&h=1200&auto=format';
        image.onload = () => setLoadedImages((prev) => new Set([...prev, index]));
      }
    });
  }, [allImages]);

  const goToPrevious = () => setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  const goToNext = () => setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  const handleThumbnailClick = (index: number) => setCurrentIndex(index);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    setMousePosition({
      x: Math.min(Math.max(((e.clientX - left) / width) * 100, 0), 100),
      y: Math.min(Math.max(((e.clientY - top) / height) * 100, 0), 100),
    });
  };

  const currentImage = allImages[currentIndex];
  const isCurrentLoaded = loadedImages.has(currentIndex);
  
  // ✅ Direct URL for magnifier - add quality params
  const magnifierBgUrl = currentImage?.url 
    ? `${currentImage.url}?w=800&h=800&auto=format` 
    : '';

  const specsDataList: [string, any][] = [
    ['Brand', product.brand || specs.brand],
    ['Manufacturer', product.manufacturer || specs.manufacturer],
    ['Color', product.color || specs.color],
    ['Pattern', product.pattern || specs.pattern],
    ['Composition', specs.composition],
    ['Eco-Friendly Fabric', specs.fabricType],
    ['Apparel Type', specs.apparelType],
    ['Production Type', specs.productionType],
    ['Use', specs.use],
  ];

  const specsData = specsDataList.filter(
    ([_, value]) => value && String(value).trim() !== ''
  );

  return (
    <main key={product._id} className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            {collections.length > 0 && (
              <>
                <Link 
                  href={`/collections/${collections[0].slug?.current}`} 
                  className="text-xs text-amber-600 font-medium uppercase tracking-wider hover:text-amber-700"
                >
                  {collections[0].title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div 
              ref={imageRef} 
              className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 group" 
              onMouseMove={handleMouseMove} 
              onMouseEnter={() => setIsHovering(true)} 
              onMouseLeave={() => setIsHovering(false)}
            >
              {allImages.length > 0 ? (
                <>
                  <Image 
                    src={`${currentImage.url}?w=1200&h=1200&auto=format`}
                    alt={currentImage.alt || product.title} 
                    fill 
                    className={`object-contain p-4 transition-opacity duration-300 ${isCurrentLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    sizes="50vw" 
                    priority={currentIndex === 0}
                    unoptimized
                    onLoad={() => console.log('✅ Main image loaded:', currentImage.url)}
                    onError={() => console.error('❌ Main image failed:', currentImage.url)}
                  />
                  {!isCurrentLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {isHovering && isCurrentLoaded && (
                    <div 
                      className="absolute pointer-events-none z-50" 
                      style={{
                        width: '230px',
                        height: '230px',
                        left: `${mousePosition.x}%`,
                        top: `${mousePosition.y}%`,
                        transform: 'translate(-50%,-50%)',
                        borderRadius: '50%',
                        border: '3px solid white',
                        boxShadow: '0 0 0 2px rgba(0,0,0,0.1), 0 20px 50px rgba(0,0,0,0.4)',
                        overflow: 'hidden',
                        backgroundImage: `url(${magnifierBgUrl})`,
                        backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                        backgroundSize: '500% 500%',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#f9fafb'
                      }} 
                    />
                  )}
                  {allImages.length > 1 && (
                    <>
                      <button onClick={goToPrevious} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                      </button>
                      <button onClick={goToNext} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-20">
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-medium">
                      {currentIndex + 1} / {allImages.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300">
                  <Package className="w-20 h-20" />
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((image: any, index: number) => (
                  <button 
                    key={image._key || index} 
                    onClick={() => handleThumbnailClick(index)} 
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${index === currentIndex ? 'border-amber-500 shadow-md scale-105' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <Image 
                      src={`${image.url}?w=160&h=160&auto=format`}
                      alt="" 
                      fill 
                      className="object-cover" 
                      sizes="100px" 
                      loading="eager"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 flex-wrap">
              {collections.length > 0 && collections.map((collection: any) => (
                <Link 
                  key={collection._id}
                  href={`/collections/${collection.slug?.current}`} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Package className="w-3 h-3" />
                  {collection.title}
                </Link>
              ))}
              {product.sku && <span className="text-xs text-gray-400">SKU: {product.sku}</span>}
              {product.tags?.slice(0, 2).map((tag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">#{tag}</span>
              ))}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.title}</h1>
            {product.features?.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Key Features</h4>
                <ul className="space-y-1">
                  {product.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0 mt-1.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2 pt-2">
              <QuoteButton
                productId={product._id}
                productName={product.title}
                productImage={product.imageUrl || allImages[0]?.url || ''}  // ✅ Fixed: direct URL string
                productSku={product.sku}
                productCollection={collections[0]?.title}
                buttonText={product.quoteSettings?.quoteButtonText || 'Get Quote'}
                className="w-full text-base py-3.5"
              />
              <p className="text-xs text-gray-400 text-center">We'll respond within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Bottom: Description + Specs + Related */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 border-t border-gray-100 pt-12">
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>
            {product.description ? (
              <div className="prose prose-gray max-w-none">
                <PortableText value={product.description} components={richTextComponents} />
              </div>
            ) : <p className="text-gray-400">No description available.</p>}
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Product Details</h2>
              {specsData.length > 0 ? (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      {specsData.map(([label, value], i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 border-r border-gray-200 w-1/3">{label}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-gray-400 text-sm">No specifications available.</p>}
            </div>

            {relatedProducts.length > 0 && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
                <div className="space-y-3 w-full flex flex-col items-center">
                  {relatedProducts.slice(0, 4).map((p: any) => (
                    <ProductCard key={p._id} product={p} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}