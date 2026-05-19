// src/components/Testimonial.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const ref = image.asset._ref;
  const parts = ref.split('-');
  const id = parts[1];
  const fmt = parts[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}-${width}x${h}.${fmt}`;
}


interface TestimonialItem {
  _key: string;
  name: string;
  role?: string;
  avatar?: any;
  rating?: number;
  quote: string;
}

interface TestimonialProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  testimonials: TestimonialItem[];
  backgroundColor?: string;
}

export default function Testimonial({ sectionLabel, title, subtitle, testimonials, backgroundColor = '#f9fafb' }: TestimonialProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const scrollSpeed = useRef(0.6);

  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  if (!testimonials?.length) return null;

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    el.scrollLeft += scrollSpeed.current;

    // Seamless loop
    if (el.scrollLeft >= (el.scrollWidth - el.clientWidth) / 2) {
      el.scrollLeft = 0;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden py-20 lg:py-28">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          {sectionLabel && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200 mb-6">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {sectionLabel}
            </span>
          )}
          <div className={textColor}>
            <RichTextRenderer content={title} textColor={textColor} headingColor={textColor} />
          </div>
          {subtitle && <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto text-lg`}>{subtitle}</p>}
        </div>

        {/* Scrolling Cards */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-auto scrollbar-hide py-4"
        >
          {/* Duplicate for infinite loop */}
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={`${item._key}-${index}`}
              className="flex-shrink-0 w-[380px] sm:w-[420px] group"
            >
              <div className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 shadow-lg hover:shadow-2xl border ${isDark ? 'border-gray-700' : 'border-gray-100'} transition-all duration-500 hover:-translate-y-1`}>
                {/* Quote SVG Background */}
                <div className="absolute top-6 right-6 text-amber-100 opacity-50">
                  <Quote className="w-12 h-12" />
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (item.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-5`}>
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0">
                    {item.avatar ? (
                      <Image src={getImageUrl(item.avatar, 80, 80)} alt={item.name} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-600 font-bold text-lg">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${textColor}`}>{item.name}</p>
                    {item.role && <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} truncate`}>{item.role}</p>}
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Quote className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient Fade Edges */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-16 h-64 bg-gradient-to-r pointer-events-none ${isDark ? 'from-gray-900' : 'from-gray-50'} to-transparent z-10`} />
        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-16 h-64 bg-gradient-to-l pointer-events-none ${isDark ? 'from-gray-900' : 'from-gray-50'} to-transparent z-10`} />
      </div>
    </section>
  );
}

