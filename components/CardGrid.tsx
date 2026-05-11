// src/components/CardGrid.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
import { urlFor } from '@/lib/sanity';

interface Card {
  _key: string;
  image: any;
  imageAlt?: string;
  cardTitle: string;
  cardDescription?: string;
  link?: string;
  backgroundColor?: string;
}

interface CardGridProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  cards: Card[];
  sectionBackground?: string;
}

export default function CardGrid({
  sectionLabel,
  title,
  subtitle,
  cards,
  sectionBackground = '#ffffff',
}: CardGridProps) {
  const isDark = sectionBackground === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  if (!cards || cards.length === 0) return null;

  return (
    <section style={{ backgroundColor: sectionBackground }} className="relative overflow-hidden">
      {/* Decorative Blobs */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-50 rounded-full blur-3xl opacity-40" />
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
            <RichTextRenderer content={title} textColor={textColor} headingColor={textColor} />
          </div>

          {subtitle && (
            <p className={`mt-4 ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Cards Grid - 3 PER ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <CardItem key={card._key} card={card} index={index} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CardItem({ card, index, isDark }: { card: Card; index: number; isDark: boolean }) {
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  const hoverBorderColor = isDark ? 'hover:border-gray-600' : 'hover:border-amber-200';

  const accentColors = [
    'from-amber-400 to-orange-500',
    'from-blue-400 to-cyan-500',
    'from-green-400 to-emerald-500',
    'from-purple-400 to-pink-500',
    'from-rose-400 to-red-500',
    'from-indigo-400 to-blue-500',
  ];

  const accent = accentColors[index % accentColors.length];

  const CardContent = (
    <>
      {/* Image - TOP CENTERED, ICON SIZE */}
      <div className="flex justify-center pt-8 pb-2">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
          {card.image ? (
            <Image
              src={urlFor(card.image).width(100).url()}
              alt={card.imageAlt || card.cardTitle}
              fill
              sizes="80px"
              className="object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400 text-[10px]">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Content - CENTER ALIGNED */}
      <div className="p-5 sm:p-6 pt-0 space-y-3 text-center">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
          {card.cardTitle}
        </h3>

        {/* Description */}
        {card.cardDescription && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {card.cardDescription}
          </p>
        )}

        {/* Bottom Accent Line - CENTERED */}
        <div className="flex justify-center">
          <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${accent} group-hover:w-20 transition-all duration-500`} />
        </div>
      </div>
    </>
  );

  const cardClasses = `group bg-white rounded-2xl border ${borderColor} ${hoverBorderColor} shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 flex flex-col`;

  return card.link ? (
    <Link href={card.link} className={cardClasses} style={{ backgroundColor: card.backgroundColor }}>
      {CardContent}
    </Link>
  ) : (
    <div className={cardClasses} style={{ backgroundColor: card.backgroundColor }}>
      {CardContent}
    </div>
  );
}