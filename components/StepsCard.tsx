// src/components/StepsCard.tsx
'use client';

import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
import { urlFor } from '@/lib/sanity';

interface Step {
  _key: string;
  stepNumber: string;
  title: string;
  description?: string;
  icon?: any;
}

interface StepsCardProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  steps: Step[];
  backgroundColor?: string;
}

export default function StepsCard({ sectionLabel, title, subtitle, steps, backgroundColor = '#f9fafb' }: StepsCardProps) {
  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-800/80' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-100';

  if (!steps?.length) return null;

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          {sectionLabel && (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {sectionLabel}
            </span>
          )}
          <div className={textColor}>
            <RichTextRenderer content={title} textColor={textColor} headingColor={textColor} />
          </div>
          {subtitle && <p className={`mt-4 ${subtitleColor} max-w-2xl mx-auto text-lg`}>{subtitle}</p>}
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step._key}
              className={`group relative ${cardBg} rounded-3xl border ${borderColor} p-6 lg:p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-orange-400/0 to-amber-400/0 group-hover:from-amber-400/5 group-hover:via-orange-400/5 group-hover:to-amber-400/5 transition-all duration-700" />

              

              <div className="relative z-10">
                {/* Top Row: Badge + Icon */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {step.stepNumber}
                  </div>
                  {step.icon && (
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                      <Image src={urlFor(step.icon).width(48).height(48).url()} alt="" width={32} height={32} className="object-contain" />
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-3 ${textColor} group-hover:text-amber-600 transition-colors`}>
                  {step.title}
                </h3>

                {/* Description */}
                {step.description && (
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                )}

                {/* Bottom Line */}
                <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-500" />

                {/* Arrow (appears on hover) */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}