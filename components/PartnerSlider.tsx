'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { urlFor } from '@/lib/sanity'; // ⚡ Native builder tool import kiya
import RichTextRenderer from './RichTextRenderer';

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
  const isDark = backgroundColor === '#111827' || backgroundColor === '#000000';
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollSpeed = 0.8; // Smooth layout horizontal speed constant

  // Infinite Seamless Loop Animation
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (!isPaused) {
      el.scrollLeft += scrollSpeed;

      // ⚡ SEAMLESS RESET: Jab adha array scroll ho jaye, bina jhatke ke 0 par reset karein
      // Kyunki humne duplicate copy array use kiya hai ([...logos, ...logos])
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !logos || logos.length === 0) return;

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, logos]);

  if (!logos?.length) return null;

  // Seamless looping duplication mechanism
  const extendedLogos = [...logos, ...logos, ...logos]; 

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden py-16 lg:py-24">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-amber-50 opacity-50 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-orange-50 opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Left Block: Content Headers */}
          <div className="lg:col-span-2">
            {sectionLabel && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200 mb-4">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {sectionLabel}
              </span>
            )}
            <div className={isDark ? 'text-white' : 'text-gray-900'}>
              <RichTextRenderer 
                content={title} 
                textColor={isDark ? 'text-white' : 'text-gray-900'} 
                headingColor={isDark ? 'text-white' : 'text-gray-900'} 
              />
            </div>
            {subtitle && (
              <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} text-base leading-relaxed`}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Block: Marquee Layout Slider */}
          <div className="lg:col-span-3 relative">
            {/* Soft Gradient Fade Shadows */}
            <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r z-10 pointer-events-none ${isDark ? 'from-gray-900' : 'from-white'} to-transparent`} />
            <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l z-10 pointer-events-none ${isDark ? 'from-gray-900' : 'from-white'} to-transparent`} />

            <div
              ref={scrollRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex gap-4 overflow-x-hidden py-4 px-2 select-none"
            >
              {extendedLogos.map((logo, index) => {
                // 👇 Safe Native Sanity Image resolving tool
                const logoImgSrc = logo.image && (logo.image.asset || logo.image._ref)
                  ? urlFor(logo.image).width(200).height(100).format('webp').url()
                  : null;

                if (!logoImgSrc) return null;

                return (
                  <div
                    key={`${logo._key || index}-${index}`}
                    className={`flex-shrink-0 w-36 h-24 sm:w-44 sm:h-28 rounded-2xl border transition-all duration-300 flex items-center justify-center p-6 group shadow-sm hover:shadow-xl
                      ${isDark 
                        ? 'bg-gray-900/60 border-gray-800 hover:border-amber-500/40' 
                        : 'bg-white border-gray-100 hover:border-amber-400/60'
                      }`}
                  >
                    {logo.link ? (
                      <Link href={logo.link} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center relative">
                        <Image
                          src={logoImgSrc}
                          alt={logo.name || 'Partner logo'}
                          fill
                          sizes="(max-width: 640px) 144px, 176px"
                          className={`object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 ${isDark ? 'brightness-0 invert' : ''}`}
                        />
                      </Link>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <Image
                          src={logoImgSrc}
                          alt={logo.name || 'Partner logo'}
                          fill
                          sizes="(max-width: 640px) 144px, 176px"
                          className={`object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 ${isDark ? 'brightness-0 invert' : ''}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}