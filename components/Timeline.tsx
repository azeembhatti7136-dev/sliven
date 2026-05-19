'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity'; 
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
  
  // ⚡ Dynamic Responsive Semantic Color Mapping
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const headingColor = isDark ? 'text-amber-400' : 'text-gray-900';
  const descColor = isDark ? 'text-gray-300' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-900/80' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-800 hover:border-amber-500/40' : 'border-gray-100 hover:border-amber-200/60';
  const ringColor = isDark ? 'ring-gray-900' : 'ring-white';

  if (!steps?.length) return null;

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br ${isDark ? 'from-amber-950/20 via-orange-950/10' : 'from-amber-50 via-orange-50'} to-transparent opacity-40 blur-3xl`} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header Block */}
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

        {/* Timeline Dynamic Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative">
          {/* Center Vertical Axis Line */}
          <div className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 ${isDark ? 'bg-gradient-to-b from-gray-800 via-amber-900/60 to-gray-800' : 'bg-gradient-to-b from-amber-200 via-orange-300 to-amber-200'} -translate-x-1/2 rounded-full`} />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isLast = index === steps.length - 1;

            // 👇 ⚡ Secure Fallback Parser Matrix (404 Issue Fix)
            const hasImageObj = step.image && (step.image.asset || step.image._ref);
            let resolvedImageUrl = null;

            if (step.imageUrl) {
              resolvedImageUrl = step.imageUrl;
            } else if (hasImageObj) {
              try {
                // Pehle standard logic chalane ki koshish karein
                resolvedImageUrl = urlFor(step.image).width(600).height(400).format('webp').url();
              } catch (err) {
                // Agar builder fail ho ya string format kharab kare, toh khud manual transform karein
                const assetRef = step.image.asset?._ref || step.image._ref;
                if (assetRef) {
                  const parts = assetRef.split('-');
                  const id = parts[1];
                  const dimensions = parts[2];
                  const ext = parts[3] || 'jpg';
                  
                  if (id && dimensions) {
                    resolvedImageUrl = `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${dimensions}.${ext}?w=600&h=400&auto=format`;
                  }
                }
              }
            }

            return (
              <motion.div
                key={step._key || index}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative ${isEven ? 'md:pr-10' : 'md:pl-10 md:col-start-2'} ${!isEven && !isLast ? 'md:mt-16' : ''} ${isEven && index !== 0 ? 'md:-mt-16' : ''}`}
              >
                {/* Center Target Axis Connection Dot */}
                <div className={`hidden md:flex absolute ${isEven ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'} top-8 z-10`}>
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-4 ${ringColor} shadow-lg`} />
                </div>

                {/* Main Step Wrapper Card */}
                <div className={`group relative ${cardBg} rounded-3xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-500 border ${cardBorder} overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-orange-400/0 to-amber-400/0 group-hover:from-amber-400/5 group-hover:via-orange-400/5 group-hover:to-amber-400/5 transition-all duration-700" />

                  {/* Header Badge Index Area */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-orange-500/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                      {step.stepNumber}
                    </div>
                    <div className={`h-0.5 flex-1 bg-gradient-to-r ${isDark ? 'from-amber-900/40' : 'from-amber-200'} to-transparent rounded-full`} />
                  </div>

                  {/* ⚡ Secure Image Core Container Box */}
                  {resolvedImageUrl && (
                    <div className={`relative h-44 lg:h-52 rounded-2xl overflow-hidden mb-5 ${isDark ? 'bg-gray-950' : 'bg-gray-100'}`}>
                      <Image
                        src={resolvedImageUrl}
                        alt={step.title || 'Timeline step asset process'}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                        className="object-cover transform group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        priority={index < 2} 
                      />
                    </div>
                  )}

                  {/* Text Description Zone */}
                  <h3 className={`text-xl font-bold mb-2 ${headingColor} group-hover:text-amber-500 transition-colors duration-200`}>
                    {step.title}
                  </h3>
                  
                  {step.description && (
                    <p className={`text-sm ${descColor} leading-relaxed font-normal`}>
                      {step.description}
                    </p>
                  )}

                  {/* Bottom Line Border Accent Effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>

                {/* Mobile Flow Vertical Divider Line */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-2">
                    <div className={`w-0.5 h-8 bg-gradient-to-b ${isDark ? 'from-amber-600/40 to-transparent' : 'from-amber-300 to-amber-100'} rounded-full`} />
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