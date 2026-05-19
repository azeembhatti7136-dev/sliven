// src/components/FeaturesSection.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import RichTextRenderer from './RichTextRenderer';
function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const ref = image.asset._ref;
  const parts = ref.split('-');
  const id = parts[1];
  const fmt = parts[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}


interface FeatureCard {
  _key: string;
  icon: any;
  title: string;
  description: string;
  backgroundColor?: string;
}

interface FeaturesSectionProps {
  sectionTitle?: string;
  title: any;
  subtitle?: string;
  features: FeatureCard[];
  backgroundColor?: string;
}

export default function FeaturesSection({
  sectionTitle,
  title,
  subtitle,
  features,
  backgroundColor = '#f9fafb',
}: FeaturesSectionProps) {
  const isDark = backgroundColor === '#111827';
  const isGradient = backgroundColor === 'gradient-orange';

  const bgStyle = isGradient
    ? { background: 'linear-gradient(135deg, #ffedd5 0%, #fff7ed 50%, #ffffff 100%)' }
    : { backgroundColor };

  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const cardBorderColor = isDark ? 'border-gray-700' : 'border-gray-100';
  const cardShadowColor = isDark ? 'shadow-gray-900' : 'shadow-gray-200';

  const getIconBackground = (index: number) => {
    const colors = [
      'from-amber-500 to-orange-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-purple-500 to-pink-500',
      'from-rose-500 to-red-500',
      'from-indigo-500 to-blue-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <section style={bgStyle} className="relative overflow-hidden">
      {/* Background Pattern */}
      {!isDark && (
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Section Label */}
        {sectionTitle && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              {sectionTitle}
            </span>
          </div>
        )}

        {/* Title */}
        <div className={`text-center mb-4 ${textColor}`}>
          <RichTextRenderer content={title} />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className={`text-center ${subtitleColor} max-w-2xl mx-auto text-lg leading-relaxed`}>
            {subtitle}
          </p>
        )}

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features?.map((feature, index) => (
            <div
              key={feature._key}
              className={`group relative bg-white rounded-2xl p-8 border ${cardBorderColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
              style={{ backgroundColor: feature.backgroundColor || '#ffffff' }}
            >
              {/* Hover Gradient Border Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(251,146,60,0.1), rgba(251,191,36,0.1))',
                }}
              />

              {/* Icon with Gradient Background */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getIconBackground(index)} p-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <div className="relative w-full h-full">
                    <Image
                      src={getImageUrl(feature.icon, 64, 64)}
                      alt={feature.title}
                      fill
                      sizes="64px"
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </div>
                {/* Number Badge */}
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100">
                  {index + 1}
                </span>
              </div>

              {/* Feature Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom Accent Line */}
              <div className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${getIconBackground(index)} group-hover:w-full transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
