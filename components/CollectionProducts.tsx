// src/components/CollectionProducts.tsx
'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
import ProductCard from './ProductCard';

interface Product {
  _id: string;
  title?: string;
  name?: string;
  slug: { current: string };
  price: number;
  compareAtPrice?: number;
  images?: any[];
  image?: any;
  features?: string[];
  stock?: number;
  tags?: string[];
  quoteSettings?: any;
}

interface CollectionProductsProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  productsPerPage?: number;
  backgroundColor?: string;
  products: Product[];
}

export default function CollectionProducts({
  sectionLabel,
  title,
  subtitle,
  productsPerPage = 8,
  backgroundColor = '#ffffff',
  products = [],
}: CollectionProductsProps) {
  const [currentPage, setCurrentPage] = useState(1);
 console.log('Total Products:', products.length);
  console.log('Products Per Page:', productsPerPage);
  console.log('Total Pages:', Math.ceil(products.length / productsPerPage));
  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const productsSection = document.getElementById('collection-products-grid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    }
  };

  if (!products || products.length === 0) return null;

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) pages.push('...');

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);

    return pages;
  };

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {/* Decorative Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-50 rounded-full blur-3xl opacity-40" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          {sectionLabel && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                {sectionLabel}
              </span>
            </div>
          )}

          <div className={textColor}>
            <RichTextRenderer content={title} textColor={textColor} headingColor={textColor} />
          </div>

          {subtitle && (
            <p className={`mt-4 ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed`}>
              {subtitle}
            </p>
          )}

          {/* Product Count */}
          <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, products.length)} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {currentProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No products on this page</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) =>
              typeof page === 'string' ? (
                <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page as number)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}