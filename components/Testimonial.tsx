'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { urlFor } from '@/lib/sanity'; // ⚡ Native builder handler centralized tool
import RichTextRenderer from './RichTextRenderer';

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
  const scrollSpeed = 0.6; // Speed index constant matrix

  const isDark = backgroundColor === '#111827' || backgroundColor === '#000000';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const innerCardBg = isDark ? 'bg-gray-900/60' : 'bg-white';
  const innerBorder = isDark ? 'border-gray-800' : 'border-gray-100';
  const rowDivider = isDark ? 'border-gray-800' : 'border-gray-100';

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (!isPaused) {
      el.scrollLeft += scrollSpeed;

      // ⚡ SEAMLESS LOOP RECOVERY: Adha marquee loop complete hotey hi zero par instant position transform check
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !testimonials || testimonials.length === 0) return;

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, testimonials]);

  if (!testimonials?.length) return null;

  // Seamless duplication array layer
  const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden py-20 lg:py-28">
      {/* Background decoration elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header Block */}
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
          {subtitle && (
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-2xl mx-auto text-lg`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrolling Cards Loop Marquee */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-hidden py-4 select-none"
        >
          {extendedTestimonials.map((item, index) => {
            // 👇 Safe Native Avatar Parser with Typesafe Webp output configuration
            const hasAvatarObj = item.avatar && (item.avatar.asset || item.avatar._ref);
            const avatarUrl = hasAvatarObj 
              ? urlFor(item.avatar).width(100).height(100).format('webp').url() 
              : null;

            return (
              <div
                key={`${item._key || index}-${index}`}
                className="flex-shrink-0 w-[360px] sm:w-[400px] group"
              >
                <div className={`relative ${innerCardBg} rounded-3xl p-8 shadow-sm border ${innerBorder} hover:shadow-2xl transition-all duration-500 hover:-translate-y-1`}>
                  
                  {/* Floating Quote Design Element */}
                  <div className={`absolute top-6 right-6 ${isDark ? 'text-gray-800' : 'text-amber-100/60'} transition-colors`}>
                    <Quote className="w-10 h-10" />
                  </div>

                  {/* Rating Stars Bar */}
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (item.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  {/* Feedback Message */}
                  <blockquote className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-5 font-medium`}>
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  {/* Author Information footer zone */}
                  <div className={`flex items-center gap-3 pt-4 border-t ${rowDivider}`}>
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 flex-shrink-0 flex items-center justify-center border border-black/5">
                      {avatarUrl ? (
                        <Image 
                          src={avatarUrl} 
                          alt={item.name || 'User Avatar'} 
                          fill 
                          className="object-cover" 
                          sizes="44px" 
                        />
                      ) : (
                        <div className="text-amber-600 font-black text-base uppercase">
                          {item.name ? item.name.charAt(0) : 'U'}
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <p className={`font-bold text-sm truncate ${textColor}`}>{item.name}</p>
                      {item.role && (
                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} truncate font-medium mt-0.5`}>
                          {item.role}
                        </p>
                      )}
                    </div>

                    <div className="ml-auto flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <Quote className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}