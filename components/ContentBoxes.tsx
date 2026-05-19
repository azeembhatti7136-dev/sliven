'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { urlFor } from '@/lib/sanity'; // 👈 Centralized super safe wrapper use kiya
import RichTextRenderer from './RichTextRenderer';

interface Box {
  _key: string;
  layout?: 'imageLeft' | 'imageRight';
  image: any;
  imageAlt?: string;
  boxTitle: any;
  boxDescription?: any;
  features?: string[];
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  roundedCorners?: 'medium' | 'large' | 'xl';
}

interface ContentBoxesProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  boxes: Box[];
  sectionBackground?: string;
}

export default function ContentBoxes({
  sectionLabel,
  title,
  subtitle,
  boxes,
  sectionBackground = '#ffffff',
}: ContentBoxesProps) {
  const isDark = sectionBackground === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  if (!boxes || boxes.length === 0) return null;

  return (
    <section style={{ backgroundColor: sectionBackground }} className="relative overflow-hidden">
      {/* Decorative Background */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-50 rounded-full blur-3xl opacity-30" />
        </div>
      )}
      
      {/* Dark mode decorative elements */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gray-800 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gray-800 rounded-full blur-3xl opacity-30" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section Header */}
        <div className="text-center mb-12">
          {sectionLabel && (
            <div className="mb-4">
              <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                isDark 
                  ? 'bg-gradient-to-r from-amber-900/50 to-orange-900/50 text-amber-300 border border-amber-700/50' 
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
              }`}>
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

        {/* Content Boxes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {boxes.map((box, index) => (
            <ContentBoxItem key={box._key || index} box={box} index={index} isDarkSection={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentBoxItem({ box, index, isDarkSection }: { box: Box; index: number; isDarkSection: boolean }) {
  // FORCE DARK BACKGROUND when section is dark, ignore box's own backgroundColor
  const boxBackground = isDarkSection 
    ? '#1f2937'  // Force dark gray for all boxes when section is dark
    : (box.backgroundColor || '#ffffff'); // Respect box background only in light mode
  
  const isDarkBox = isDarkSection; // Simple - if section is dark, box is dark

  const roundClasses = {
    medium: 'rounded-lg',
    large: 'rounded-xl',
    xl: 'rounded-2xl',
  };

  const roundClass = roundClasses[box.roundedCorners || 'medium'];
  const textColor = isDarkBox ? 'text-white' : 'text-gray-900';
  const headingColor = isDarkBox ? 'text-white' : 'text-gray-900';
  const descColor = isDarkBox ? 'text-gray-300' : 'text-gray-500';
  const borderColor = isDarkBox ? 'border-gray-700' : 'border-gray-100';
  const checkBgColor = isDarkBox ? 'bg-amber-500/20' : 'bg-amber-100';
  const checkIconColor = isDarkBox ? 'text-amber-400' : 'text-amber-600';
  const noImageBg = isDarkBox ? 'bg-gray-700' : 'bg-gray-100';
  const noImageText = isDarkBox ? 'text-gray-400' : 'text-gray-400';

  // ───── Safe Box-Image URL Resolution ─────
  let boxImageUrl = '';
  if (box?.image) {
    try {
      boxImageUrl = typeof box.image === 'string' && box.image.startsWith('http')
        ? box.image
        : urlFor(box.image).width(120).height(120).url();
    } catch (err) {
      console.error(`Error building ContentBox image URL at index ${index}:`, err);
    }
  }

  return (
    <div
      style={{ backgroundColor: boxBackground }}
      className={`${roundClass} border ${borderColor} shadow-sm transition-all duration-300 overflow-hidden min-h-[160px] ${
        isDarkBox 
          ? 'hover:shadow-lg hover:shadow-gray-900/50 hover:-translate-y-0.5' 
          : 'hover:shadow-md hover:shadow-gray-200/50 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex flex-row items-stretch h-full min-h-[160px]">
        {/* Image */}
        <div className="w-[25%] min-w-[80px] flex-shrink-0 flex items-center justify-center p-4">
          {boxImageUrl ? (
            <div className="relative w-full aspect-square max-w-[80px]">
              <Image
                src={boxImageUrl}
                alt={box.imageAlt || 'Content image'}
                fill
                sizes="10vw"
                className={`object-contain ${isDarkBox ? 'brightness-110 contrast-110' : ''}`}
              />
            </div>
          ) : (
            <div className={`w-full aspect-square max-w-[80px] rounded-lg flex items-center justify-center ${noImageBg}`}>
              <span className={`text-[10px] ${noImageText}`}>No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 pl-0 flex flex-col justify-center space-y-1.5">
          {box.boxTitle && (
            <div className={headingColor}>
              <RichTextRenderer content={box.boxTitle} textColor={textColor} headingColor={headingColor} />
            </div>
          )}

          {box.boxDescription && (
            <div className={`text-xs leading-relaxed line-clamp-3 ${descColor}`}>
              <RichTextRenderer content={box.boxDescription} textColor={descColor} descriptionColor={descColor} />
            </div>
          )}

          {box.features && box.features.length > 0 && (
            <ul className="space-y-0.5">
              {box.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${checkBgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Check className={`w-1.5 h-1.5 ${checkIconColor}`} />
                  </div>
                  <span className={`text-[11px] ${descColor} line-clamp-1`}>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {box.buttonText && box.buttonLink && (
            <div className="pt-1">
              <Link
                href={box.buttonLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all duration-300 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-500/25"
              >
                {box.buttonText}
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}