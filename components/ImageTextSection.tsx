// src/components/ImageTextSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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


interface ImageTextItem {
  _key: string;
  layout?: 'textLeft' | 'imageLeft';
  title?: any;
  description?: any;
  image: any;
  imageAlt?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface ImageTextSectionProps {
  title: any;
  subtitle?: string;
  backgroundImage?: any;
  backgroundOpacity?: number;
  sections: ImageTextItem[];
  backgroundColor?: string;
}

export default function ImageTextSection({
  title,
  subtitle,
  backgroundImage,
  backgroundOpacity = 95,
  sections,
  backgroundColor = '#ffffff',
}: ImageTextSectionProps) {
  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  if (!sections || sections.length === 0) return null;

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {/* 🎯 Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={getImageUrl(backgroundImage, 1920, 1080)}
            alt="Section background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: isDark ? '#111827' : '#ffffff',
              opacity: (100 - backgroundOpacity) / 100,
            }}
          />
        </div>
      )}

      {/* Decorative Elements (only if no background image) */}
      {!isDark && !backgroundImage && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-40 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-40 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className={textColor}>
            <RichTextRenderer 
              content={title} 
              textColor={textColor}
              headingColor={textColor}
            />
          </div>
          {subtitle && (
            <p className={`mt-4 ${subtitleColor} max-w-3xl mx-auto text-lg leading-relaxed`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-20 lg:space-y-32">
          {sections.map((section, index) => (
            <ImageTextItem key={section._key} section={section} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageTextItem({
  section,
  index,
  isDark,
}: {
  section: ImageTextItem;
  index: number;
  isDark: boolean;
}) {
  const isReversed = section.layout === 'imageLeft';
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-100/80';
  const cardBg = isDark ? 'bg-gray-800/60 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const descColor = isDark ? 'text-gray-300' : 'text-gray-600';

  const contentBlock = (
    <div className={`flex flex-col justify-center space-y-6 ${cardBg} p-8 lg:p-12 rounded-3xl border ${borderColor} shadow-lg`}>
      {section.title && (
        <RichTextRenderer 
          content={section.title} 
          textColor={textColor}
          headingColor={textColor}
        />
      )}

      {section.description && (
        <RichTextRenderer 
          content={section.description} 
          textColor={descColor}
          descriptionColor={descColor}
        />
      )}

      {section.buttonText && section.buttonLink && (
        <div>
          <Link
            href={section.buttonLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:gap-3"
          >
            {section.buttonText}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </div>
  );

  const imageBlock = (
    <div className="relative group">
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
        {section.image && (
          <Image
            src={getImageUrl(section.image, 800, 600)}
            alt={section.imageAlt || 'Section image'}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl opacity-20 -z-10 group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl opacity-10 -z-10 group-hover:scale-110 transition-transform duration-500" />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {isReversed ? (
        <>
          {imageBlock}
          {contentBlock}
        </>
      ) : (
        <>
          {contentBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
}

