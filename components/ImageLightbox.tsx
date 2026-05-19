'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Package } from 'lucide-react';
import { urlFor } from '@/lib/sanity'; // 👈 Centralized super safe wrapper use kiya

interface GalleryImage {
  _key: string;
  asset: any;
  alt?: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsZoomed(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, goToPrevious, goToNext]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  // ───── Safe Main High-Res Image URL Builder ─────
  let mainLightboxUrl = '';
  if (currentImage) {
    try {
      mainLightboxUrl = typeof currentImage === 'string' && currentImage.startsWith('http')
        ? currentImage
        : urlFor(currentImage).width(1920).height(1080).url();
    } catch (err) {
      console.error("Error building lightbox main preview image:", err);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Zoom Toggle */}
      <button
        onClick={() => setIsZoomed(!isZoomed)}
        className="absolute top-20 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
      >
        {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
      </button>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      {/* Image Container */}
      <div
        className={`relative flex items-center justify-center transition-all duration-500 ${
          isZoomed ? 'cursor-zoom-out w-full h-full p-8' : 'cursor-zoom-in w-[90%] h-[85%]'
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        {mainLightboxUrl ? (
          <Image
            src={mainLightboxUrl}
            alt={currentImage.alt || `Gallery image ${currentIndex + 1}`}
            fill
            className={`object-contain transition-transform duration-500 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            sizes="100vw"
            priority
          />
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-2">
            <Package className="w-16 h-16 opacity-40" />
            <span className="text-sm">Preview Image Unavailable</span>
          </div>
        )}

        {/* Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
            {currentImage.caption}
          </div>
        )}
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 z-20">
          {images.map((image, index) => {
            // ───── Safe Thumbnail Image URL Builder ─────
            let thumbUrl = '';
            if (image) {
              try {
                thumbUrl = typeof image === 'string' && image.startsWith('http')
                  ? image
                  : urlFor(image).width(80).height(80).url();
              } catch (err) {
                console.error(`Error building lightbox thumbnail at index ${index}:`, err);
              }
            }

            return (
              <button
                key={image._key || index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setIsZoomed(false);
                }}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 bg-gray-900 ${
                  index === currentIndex
                    ? 'border-amber-500 scale-110'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                    -
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}