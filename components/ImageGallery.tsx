'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, Package } from 'lucide-react';
import { urlFor } from '@/lib/sanity'; // 👈 Centralized super safe wrapper use kiya
import RichTextRenderer from './RichTextRenderer';
import ImageLightbox from './ImageLightbox';

interface GalleryImage {
  _key: string;
  asset: any;
  alt?: string;
  caption?: string;
}

interface ImageGalleryProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  images: GalleryImage[];
  columns?: string;
  gap?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

export default function ImageGallery({
  sectionLabel,
  title,
  subtitle,
  images,
  columns = '4',
  gap = 'small',
  backgroundColor = '#ffffff',
}: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  const gapClasses = {
    small: 'gap-3',
    medium: 'gap-5',
    large: 'gap-8',
  };

  const columnClasses: Record<string, string> = {
    '4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '2': 'grid-cols-1 sm:grid-cols-2',
  };

  const aspectClasses: Record<string, string> = {
    '4': 'aspect-square',
    '3': 'aspect-[4/3]',
    '2': 'aspect-[16/9]',
  };

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {/* Decorative Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-40" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-14">
          {sectionLabel && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200">
                {sectionLabel}
              </span>
            </div>
          )}

          <div className={textColor}>
            <RichTextRenderer content={title} />
          </div>

          {subtitle && (
            <p className={`mt-4 ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Gallery Grid */}
        <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}>
          {images.map((image, index) => {
            // ───── Safe Gallery Image URL Resolution ─────
            let galleryImageUrl = '';
            if (image) {
              try {
                galleryImageUrl = typeof image === 'string' && image.startsWith('http')
                  ? image
                  : urlFor(image).width(600).height(600).url();
              } catch (err) {
                console.error(`Error building gallery image URL at index ${index}:`, err);
              }
            }

            return (
              <div
                key={image._key || index}
                className={`group relative ${aspectClasses[columns]} rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 bg-gray-50`}
                onClick={() => openLightbox(index)}
              >
                {galleryImageUrl ? (
                  <Image
                    src={galleryImageUrl}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package className="w-10 h-10" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-50 group-hover:scale-100">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl">
                      <ZoomIn className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">{image.caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={images}
        initialIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}