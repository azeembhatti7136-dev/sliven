// src/components/PartnerSlider.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const match = image.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const id = match[1];
  const fmt = match[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}


interface PartnerLogo {
  _key: string;
  image: any;
  name?: string;
  link?: string;
}

interface PartnerSliderProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  logos: PartnerLogo[];
  backgroundColor?: string;
}

export default function PartnerSlider({ sectionLabel, title, subtitle, logos, backgroundColor = '#ffffff' }: PartnerSliderProps) {
  const isDark = backgroundColor === '#111827';
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollSpeed = useRef(0.8);

  if (!logos?.length) return null;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: 'smooth' });
  };

  // Smooth animation loop
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    el.scrollLeft += scrollSpeed.current;

    // Reset when reaching the end
    if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
      el.scrollLeft = 0;
    }

    checkScroll();
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || logos.length <= 3) return;

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, logos.length]);

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden py-16 lg:py-24">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-amber-50 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-orange-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-2">
            {sectionLabel && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200 mb-4">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {sectionLabel}
              </span>
            )}
            <div className={isDark ? 'text-white' : 'text-gray-900'}>
              <RichTextRenderer content={title} textColor={isDark ? 'text-white' : 'text-gray-900'} headingColor={isDark ? 'text-white' : 'text-gray-900'} />
            </div>
            {subtitle && (
              <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} text-base leading-relaxed`}>
                {subtitle}
              </p>
            )}

            
          </div>

          {/* Right: Logo Slider */}
<div className="lg:col-span-3 relative">
  {/* Gradient Fade Edges */}
  <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r z-10 pointer-events-none ${isDark ? 'from-gray-900' : 'from-white'} to-transparent`} />
  <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l z-10 pointer-events-none ${isDark ? 'from-gray-900' : 'from-white'} to-transparent`} />

  <div
    ref={scrollRef}
    onScroll={checkScroll}
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
    onTouchStart={() => setIsPaused(true)}
    onTouchEnd={() => setIsPaused(false)}
    className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-2 touch-pan-x"
    style={{ WebkitOverflowScrolling: 'touch' }}
  >
    {[...logos, ...logos].map((logo, index) => (
      <div
        key={`${logo._key}-${index}`}
        className="flex-shrink-0 w-36 h-24 sm:w-44 sm:h-28 rounded-2xl bg-black border border-gray-800 shadow-lg hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex items-center justify-center p-5 group"
      >
        {logo.link ? (
          <Link href={logo.link} target="_blank" className="w-full h-full flex items-center justify-center">
            <Image
              src={getImageUrl(logo.image, 300)}
              alt={logo.name || 'Partner logo'}
              width={200}
              height={80}
              className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 brightness-0 invert"
              sizes="200px"
              unoptimized
            />
          </Link>
        ) : (
          <Image
            src={getImageUrl(logo.image, 300)}
            alt={logo.name || 'Partner logo'}
            width={200}
            height={80}
            className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 brightness-0 invert"
            sizes="200px"
            unoptimized
          />
        )}
      </div>
    ))}
  </div>
</div>
        </div>
      </div>
    </section>
  );
}
