"use client";
// src/components/Hero.tsx
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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


interface HeroProps {
  backgroundImage: any;
  imageFit?: 'cover' | 'contain';
  overlayOpacity?: number;
  title: any;
  subtitle?: any;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
  horizontalPosition?: 'left' | 'center' | 'right';
  verticalPosition?: 'top' | 'middle' | 'bottom';
  height?: 'small' | 'medium' | 'large' | 'fullscreen';
}

export default function Hero({
  backgroundImage,
  imageFit = 'cover',
  overlayOpacity = 50,
  title,
  subtitle,
  showButton = true,
  buttonText = 'Shop Now',
  buttonLink = '/products',
  horizontalPosition = 'center',
  verticalPosition = 'middle',
  height = 'medium',
}: HeroProps) {
  // Height mapping (in pixels/vh)
  const heightMap: Record<string, string> = {
    small: '400px',
    medium: '600px',
    large: '800px',
    fullscreen: '100vh',
  };

  // Text alignment mapping
  const textAlignMap: Record<string, 'left' | 'center' | 'right'> = {
    left: 'left',
    center: 'center',
    right: 'right',
  };

  // Horizontal position (align items) mapping
  const alignItemsMap: Record<string, 'flex-start' | 'center' | 'flex-end'> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  // Vertical position (justify content) mapping
  const justifyContentMap: Record<string, 'flex-start' | 'center' | 'flex-end'> = {
    top: 'flex-start',
    middle: 'center',
    bottom: 'flex-end',
  };

  return (
    <section 
      style={{
        position: 'relative',
        minHeight: heightMap[height],
        display: 'flex',
        alignItems: verticalPosition === 'top' ? 'flex-start' : verticalPosition === 'bottom' ? 'flex-end' : 'center',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: backgroundImage ? 'transparent' : '#111827',
      }}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            src={getImageUrl(backgroundImage, 1920)}
            alt="Hero background"
            fill
            style={{ objectFit: imageFit }}
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'black',
          opacity: overlayOpacity / 100,
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '48px 16px',
        }}
      >
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: alignItemsMap[horizontalPosition],
            width: '100%',
            maxWidth: '768px',
            marginLeft: horizontalPosition === 'left' ? '0' : horizontalPosition === 'right' ? 'auto' : 'auto',
            marginRight: horizontalPosition === 'left' ? 'auto' : horizontalPosition === 'right' ? '0' : 'auto',
          }}
        >
          {/* Title */}
          <div style={{ textAlign: textAlignMap[horizontalPosition], width: '100%' }}>
            <RichTextRenderer 
              content={title} 
              textColor="text-white"
              headingColor="text-white"
              descriptionColor="text-white/80"
            />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div style={{ marginTop: '24px', textAlign: textAlignMap[horizontalPosition], width: '100%' }}>
              <RichTextRenderer 
                content={subtitle} 
                textColor="text-white"
                headingColor="text-white"
                descriptionColor="text-white"
              />
            </div>
          )}

          {/* CTA Button */}
          {showButton && (
  <div style={{ marginTop: '32px' }}>
    <Link
      href={buttonLink}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-gray-50 px-8 py-5 font-bold text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
    >
      {/* Top shine line */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
      
      {/* Animated background glow */}
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-20 group-hover:blur-2xl" />
      
      {/* Ripple effect on hover */}
      <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full skew-x-12 transition-all duration-1000 group-hover:translate-x-full" />
      
      {/* Pulsing dot */}
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
      </span>
      
      {/* Button text */}
      <span className="relative z-10 text-base tracking-wide">
        {buttonText}
      </span>
      
      {/* Animated arrow container */}
      <span className="relative z-10 flex items-center justify-center rounded-full bg-gray-900 p-1.5 transition-all duration-500 group-hover:bg-black group-hover:shadow-lg group-hover:shadow-black/30 group-hover:translate-x-1">
        <ArrowRight className="h-4 w-4 text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-15deg]" />
      </span>
    </Link>
  </div>
)}
        </div>
      </div>
    </section>
  );
}
