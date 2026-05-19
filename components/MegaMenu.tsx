'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Package } from 'lucide-react';

interface MegaMenuConfig {
  enabled?: boolean;
  title?: string;
  columns?: Array<{
    _key: string;
    title: string;
    links?: Array<{
      label: string;
      url: string;
      imageUrl?: string; // 👈 Server-side processed URL
    }>;
  }>;
  showImages?: boolean;
  viewAllText?: string;
  viewAllUrl?: string;
}

interface MegaMenuProps {
  config?: MegaMenuConfig | null;
}

export default function MegaMenu({ config }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  // 👇 SAFE CHECK - Return null if no config or columns
  if (!config?.enabled || !config.columns?.length) return null;

  const { title = 'Collections', columns = [], showImages = true, viewAllText = 'View All', viewAllUrl = '/collections' } = config;
  const colCount = Math.min(columns.length, 4);
  
  // 👇 Dynamic grid and width classes based on columns
  const gridCols = colCount === 4 ? 'grid-cols-4' : colCount === 3 ? 'grid-cols-3' : colCount === 2 ? 'grid-cols-2' : 'grid-cols-1';
  
  // ⚡ Tip: left-0 ke sath width ko desktop standard par rakhein taake layout responsive rahe
  const widthClass = colCount === 4 ? 'w-[780px]' : colCount === 3 ? 'w-[620px]' : colCount === 2 ? 'w-[420px]' : 'w-[260px]';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 150); // Snappy 150ms timeout
  };

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Trigger Button */}
      <button 
        className={`px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all flex items-center gap-1 focus:outline-none ${isOpen ? 'text-white bg-gray-800' : ''}`}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        /* ⚡ Changed left-0 to left-1/2 -translate-x-1/2 for perfect center alignment under the link */
        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 ${widthClass} max-w-[92vw] sm:max-w-[85vw] md:max-w-[95vw] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200`}>
          <div className="p-6 lg:p-8">
            <div className={`grid ${gridCols} gap-6 lg:gap-8`}>
              {columns.map((column, colIdx) => (
                <div key={column._key || colIdx} className="space-y-4">
                  {/* Column Header */}
                  <h4 className="text-xs font-bold text-black uppercase tracking-wider pb-2 border-b border-gray-100">
                    {column.title}
                  </h4>
                  
                  {/* Links List */}
                  <ul className="space-y-1">
                    {(column.links || []).map((link, i) => {
                      const targetUrl = link.url && link.url.trim() !== '' ? link.url : '#';
                      
                      return (
                        <li key={i}>
                          <Link
                            href={targetUrl}
                            prefetch={targetUrl !== '#'}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-gray-50 group/link transition-all duration-200"
                          >
                            {/* Image Container with Fallback Badge */}
                            {showImages && (
                              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-50 relative">
                                {link.imageUrl ? (
                                  <Image
                                    src={link.imageUrl}
                                    alt=""
                                    fill
                                    sizes="36px"
                                    className="object-cover group-hover/link:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <Package className="w-4 h-4 text-gray-400 opacity-60" />
                                )}
                              </div>
                            )}
                            
                            {/* Link Label */}
                            <span className="text-sm text-gray-700 font-medium group-hover/link:text-amber-600 transition-colors duration-150">
                              {link.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footer Banner */}
          {viewAllUrl && (
            <Link
              href={viewAllUrl}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-sm font-bold text-gray-900 hover:text-amber-600 hover:bg-amber-50/50 transition-all border-t border-gray-100 group/btn"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}