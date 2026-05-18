// src/components/FloatingButtons.tsx
'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const whatsappNumber = '923007136735';
  const whatsappMessage = 'Hi! I would like to get a quote.';

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* WhatsApp - LEFT SIDE */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group relative"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
          <span className="absolute left-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat on WhatsApp
          </span>
        </Link>
      </div>

      {/* Scroll to Top - RIGHT SIDE */}
      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={scrollToTop}
            className="w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-400 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-in slide-in-from-bottom-2"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}
