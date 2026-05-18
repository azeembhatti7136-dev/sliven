// src/components/Timeline.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import RichTextRenderer from './RichTextRenderer';
// ❌ DELETE: function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const match = image.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const id = match[1];
  const fmt = match[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}


// 👇 Safe image URL function (no @sanity imports)
function getImageUrl(image: any, width: number = 600, height: number = 400): string {
  if (!image?.asset?._ref) return '';
  const ref = image.asset._ref;
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const id = match[1];
  const fmt = match[3] || 'jpg';
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${height}.${fmt}`;
}

interface TimelineStep {
  _key: string;
  stepNumber: string;
  title: string;
  description?: string;
  image?: any;
  imageUrl?: string; // 👈 ADD pre-processed URL option
}

interface TimelineProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  steps: TimelineStep[];
  backgroundColor?: string;
}

export default function Timeline({ sectionLabel, title, subtitle, steps, backgroundColor = '#ffffff' }: TimelineProps) {
  const isDark = backgroundColor === '#111827';
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

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Center Line - Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-orange-300 to-amber-200 -translate-x-1/2 rounded-full" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step._key}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${isEven ? 'md:pr-10' : 'md:pl-10 md:col-start-2'} ${!isEven && !isLast ? 'md:mt-16' : ''} ${isEven && index !== 0 ? 'md:-mt-16' : ''}`}
              >
                {/* Connection Dot */}
                <div className={`hidden md:flex absolute ${isEven ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} top-8 z-10`}>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-4 ring-white shadow-lg" />
                </div>

                {/* Card */}
                <div className="group relative bg-white rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-amber-200 overflow-hidden">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-orange-400/0 to-amber-400/0 group-hover:from-amber-400/5 group-hover:via-orange-400/5 group-hover:to-amber-400/5 transition-all duration-700" />

                  {/* Step Number Badge */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-amber-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {step.stepNumber}
                    </div>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-200 to-transparent rounded-full" />
                  </div>

                  {/* Image */}
                  {step.image && (
                    <div className="relative h-44 lg:h-52 rounded-2xl overflow-hidden mb-5 group-hover:shadow-md transition-shadow">
                      <Image
                        src={step.imageUrl || getImageUrl(step.image, 600, 400)} // 👈 Safe URL
                        alt={step.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  )}

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>

                {/* Mobile Connector */}
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

