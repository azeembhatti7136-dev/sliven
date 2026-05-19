'use client';

import { useState } from 'react';
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
  
  // ⚡ Track broken status for each image step index
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

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
            // ═══════════════════════════════════════
            // 🔍 SANITY IMAGE DIAGNOSTIC BLOCK START
            // ═══════════════════════════════════════
            
            console.group(`🖼️ [Step ${index}] - "${step.title}" Image Diagnostic`);
            
            // 1. Raw Data Check
            console.log('1️⃣ Full step.image object:', step.image);
            console.log('2️⃣ Has imageUrl fallback?:', step.imageUrl ? `✅ YES: ${step.imageUrl}` : '❌ NO');
            console.log('3️⃣ Has image object?:', step.image ? '✅ YES' : '❌ NO');
            
            if (step.image) {
              // 2. Asset Reference Check
              console.log('4️⃣ image._type:', step.image._type || 'NOT SET');
              console.log('5️⃣ image.asset:', step.image.asset || 'NOT SET');
              console.log('6️⃣ image.asset._ref:', step.image.asset?._ref || 'NOT SET');
              console.log('7️⃣ image._ref:', step.image._ref || 'NOT SET');
              
              const assetRef = step.image.asset?._ref || step.image._ref;
              
              if (assetRef) {
                // 3. Reference Parsing
                const parts = assetRef.split('-');
                console.log('8️⃣ Full Asset Ref:', assetRef);
                console.log('9️⃣ Ref Parts Breakdown:', {
                  type: parts[0] || 'MISSING',
                  id: parts[1] || 'MISSING',
                  dimensions: parts[2] || 'MISSING',
                  extension: parts[3] || 'MISSING',
                  isValidRef: parts.length >= 4 && parts[0] === 'image'
                });
                
                // 4. Test URL Generation with urlFor()
                console.log('🔟 Attempting urlFor()...');
                try {
                  const sanityUrl = urlFor(step.image).width(600).height(400).url();
                  console.log('   ✅ urlFor() Success:', sanityUrl);
                  
                  // Test if URL is accessible
                  fetch(sanityUrl, { method: 'HEAD' })
                    .then(res => {
                      console.log(`   🌐 HTTP Status: ${res.status} ${res.statusText}`);
                      if (res.ok) {
                        console.log('   ✅ Image accessible via urlFor()!');
                      } else {
                        console.error(`   ❌ Image NOT accessible! Status: ${res.status}`);
                      }
                    })
                    .catch(err => {
                      console.error('   ❌ Fetch failed:', err.message);
                    });
                } catch (err) {
                  console.error('   ❌ urlFor() Error:', err);
                }
                
                // 5. Direct CDN URL Construction
                if (parts[1] && parts[2] && parts[3]) {
                  const directCdnUrl = `https://cdn.sanity.io/images/d2zeiu5j/production/${parts[1]}-${parts[2]}.${parts[3]}?w=600&h=400&q=80&auto=format&fit=max`;
                  console.log('1️⃣1️⃣ Direct CDN URL:', directCdnUrl);
                  
                  // Test direct CDN URL
                  fetch(directCdnUrl, { method: 'HEAD' })
                    .then(res => {
                      console.log(`   🌐 HTTP Status: ${res.status} ${res.statusText}`);
                      if (res.ok) {
                        console.log('   ✅ Direct CDN URL accessible!');
                      } else {
                        console.error(`   ❌ Direct CDN URL failed! Status: ${res.status}`);
                        console.error('   📝 Possible reasons:');
                        console.error('      - Image unpublished in Sanity');
                        console.error('      - Asset deleted from Sanity');
                        console.error('      - Wrong project ID or dataset');
                        console.error('      - CORS settings blocking access');
                      }
                    })
                    .catch(err => {
                      console.error('   ❌ Fetch failed:', err.message);
                    });
                } else {
                  console.error('1️⃣1️⃣ Cannot construct direct CDN URL - missing ref parts');
                }
              } else {
                console.error('❌ NO ASSET REFERENCE FOUND!');
                console.error('   The image object exists but has no asset _ref');
                console.error('   This means the image was not properly uploaded in Sanity');
              }
            } else {
              console.error('❌ NO IMAGE OBJECT AT ALL!');
              console.error('   This step has no image data');
              if (step.imageUrl) {
                console.log('   ℹ️ But has imageUrl fallback:', step.imageUrl);
              }
            }
            
            // 6. Sanity Config Summary
            console.log('1️⃣2️⃣ Sanity Project Config:', {
              projectId: 'd2zeiu5j',
              dataset: 'production',
              apiVersion: 'v1',
              cdnBaseUrl: 'https://cdn.sanity.io/images/d2zeiu5j/production/'
            });
            
            console.groupEnd();
            
            // ═══════════════════════════════════════
            // 🔍 DIAGNOSTIC BLOCK END
            // ═══════════════════════════════════════

            const isEven = index % 2 === 0;
            const isLast = index === steps.length - 1;

            // 👇 ⚡ Secure Fallback Parser Matrix (404 Issue Fix)
            const hasImageObj = step.image && (step.image.asset || step.image._ref);
            let resolvedImageUrl = null;

            if (step.imageUrl) {
              resolvedImageUrl = step.imageUrl;
              console.log(`📸 Step ${index} using imageUrl fallback:`, resolvedImageUrl);
            } else if (hasImageObj) {
              try {
                resolvedImageUrl = urlFor(step.image).width(600).height(400).url();
                console.log(`📸 Step ${index} using urlFor():`, resolvedImageUrl);
              } catch (err) {
                console.error(`❌ Step ${index} urlFor() failed:`, err);
                const assetRef = step.image.asset?._ref || step.image._ref;
                if (assetRef) {
                  const parts = assetRef.split('-');
                  const id = parts[1];
                  const dimensions = parts[2];
                  const ext = parts[3] || 'jpg';
                  
                  if (id && dimensions) {
                    resolvedImageUrl = `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${dimensions}.${ext}?w=600&h=400&q=80&auto=format&fit=max`;
                    console.log(`📸 Step ${index} using fallback URL:`, resolvedImageUrl);
                  }
                }
              }
            } else {
              console.log(`📸 Step ${index}: No image available`);
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
                    <div className={`relative h-44 lg:h-52 rounded-2xl overflow-hidden mb-5 flex items-center justify-center transition-all duration-300 ${
                      brokenImages[index] 
                        ? `bg-gradient-to-br ${isDark ? 'from-amber-950/30 to-orange-950/20 border border-gray-800' : 'from-amber-50/60 to-orange-50/40 border border-amber-100/50'}` 
                        : (isDark ? 'bg-gray-950' : 'bg-gray-100')
                    }`}>
                      {!brokenImages[index] ? (
                        <Image
                          src={resolvedImageUrl}
                          alt={step.title || 'Timeline step asset process'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 30vw"
                          className="object-cover transform group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          priority={index < 2} 
                          onError={(e) => {
                            console.error(`❌ Image Load Error for Step ${index}:`, {
                              title: step.title,
                              url: resolvedImageUrl,
                              error: e
                            });
                            setBrokenImages(prev => ({ ...prev, [index]: true }));
                          }}
                          onLoad={() => {
                            console.log(`✅ Image Loaded Successfully for Step ${index}: ${step.title}`);
                          }}
                        />
                      ) : (
                        <div className="text-center p-4 animate-pulse">
                          <svg className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-amber-500/40' : 'text-amber-600/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span className={`text-xs font-semibold tracking-wide uppercase ${isDark ? 'text-amber-500/50' : 'text-amber-600/60'} block`}>
                            Media Syncing
                          </span>
                        </div>
                      )}
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