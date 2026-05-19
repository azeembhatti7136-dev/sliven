'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity'; // ⚡ Native global config tool use kar rahe hain
import RichTextRenderer from './RichTextRenderer';

interface TimelineStep {
  _key: string;
  stepNumber: string;
  title: string;
  description?: string;
  image?: any;
  imageUrl?: string; 
}

interface TimelineProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  steps: TimelineStep[];
  backgroundColor?: string;
}

export default function Timeline({ sectionLabel, title, subtitle, steps, backgroundColor = '#ffffff' }: TimelineProps) {
  const isDark = backgroundColor === '#111827' || backgroundColor === '#000000';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  if (!steps?.length) return null;

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-50 via-orange-50 to-transparent opacity-40 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          {sectionLabel && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              {sectionLabel}
            </motion.span>
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

        {/* Timeline Dynamic Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Center Line - Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-orange-300 to-amber-200 -translate-x-1/2 rounded-full" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isLast = index === steps.length - 1;

            // 👇 Safe Dynamic Image Parsing with native Builder support (.format('webp'))
            const hasImageObj = step.image && (step.image.asset || step.image._ref);
            const resolvedImageUrl = step.imageUrl 
              ? step.imageUrl 
              : hasImageObj 
                ? urlFor(step.image).width(600).height(400).format('webp').url() 
                : null;

            return (
              <motion.div
                key={step._key || index}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative ${isEven ? 'md:pr-10' : 'md:pl-10 md:col-start-2'} ${!isEven && !isLast ? 'md:mt-16' : ''} ${isEven && index !== 0 ? 'md:-mt-16' : ''}`}
              >
                {/* Connection Dot */}
                <div className={`hidden md:flex absolute ${isEven ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} top-8 z-10`}>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-4 ring-white shadow-lg" />
                </div>

                {/* Card Container */}
                <div className="group relative bg-white rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-amber-200/60 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-orange-400/0 to-amber-400/0 group-hover:from-amber-400/5 group-hover:via-orange-400/5 group-hover:to-amber-400/5 transition-all duration-700" />

                  {/* Step Number Badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-orange-500/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                      {step.stepNumber}
                    </div>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-200 to-transparent rounded-full" />
                  </div>

                  {/* Native Responsive Image Hook */}
                  {resolvedImageUrl && (
                    <div className="relative h-44 lg:h-52 rounded-2xl overflow-hidden mb-5 bg-gray-100">
                      <Image
                        src={resolvedImageUrl}
                        alt={step.title || 'Timeline Step Image'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                        className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                      />
                    </div>
                  )}

                  {/* Content Area */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-500 transition-colors duration-200">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  )}

                  {/* Bottom Hover Gradient Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>

                {/* Mobile Connector bar line */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-2">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-amber-300 to-amber-100 rounded-full" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}