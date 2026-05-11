// src/components/FAQ.tsx
'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';

interface FAQItem {
  _key: string;
  question: string;
  answer: any;
}

interface FAQProps {
  sectionLabel?: string;
  title: any;
  subtitle?: string;
  faqs: FAQItem[];
  columns?: string;
  backgroundColor?: string;
}

export default function FAQ({
  sectionLabel,
  title,
  subtitle,
  faqs,
  columns = '1',
  backgroundColor = '#f9fafb',
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isDark = backgroundColor === '#111827';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subtitleColor = isDark ? 'text-gray-300' : 'text-gray-600';

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ backgroundColor }} className="relative overflow-hidden">
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-50 rounded-full blur-3xl opacity-30" />
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header */}
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

        {/* FAQ Items */}
        <div className={columns === '2' ? 'grid md:grid-cols-2 gap-4' : 'space-y-3'}>
          {faqs.map((faq, index) => (
            <div
              key={faq._key}
              className={`rounded-2xl border transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
              } ${openIndex === index ? 'shadow-lg ring-2 ring-amber-200' : ''}`}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
              >
                <span className={`font-semibold text-sm sm:text-base pr-4 ${textColor}`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rotate-180'
                    : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                }`}>
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`px-5 sm:px-6 pb-5 sm:pb-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className={`pt-4 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <RichTextRenderer 
                      content={faq.answer} 
                      textColor={isDark ? 'text-gray-300' : 'text-gray-600'}
                      headingColor={textColor}
                      descriptionColor={isDark ? 'text-gray-400' : 'text-gray-500'}
                    />
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