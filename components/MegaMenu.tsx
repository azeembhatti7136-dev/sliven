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
      imageUrl?: string;
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

  if (!config?.enabled || !config.columns?.length) return null;

  const { title = 'Collections', columns = [], showImages = true, viewAllText = 'View All', viewAllUrl = '/collections' } = config;
  const colCount = Math.min(columns.length, 4);
  
  // ✅ DESKTOP: Bade sizes with max-width constraint
  const gridCols = colCount === 4 ? 'grid-cols-4' : colCount === 3 ? 'grid-cols-3' : colCount === 2 ? 'grid-cols-2' : 'grid-cols-1';
  
  // ✅ BADA DROPDOWN WIDTH
  const widthClass = colCount === 4 
    ? 'w-[900px] lg:w-[960px]' 
    : colCount === 3 
    ? 'w-[720px] lg:w-[780px]' 
    : colCount === 2 
    ? 'w-[480px] lg:w-[540px]' 
    : 'w-[300px] lg:w-[360px]';

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
    closeTimer.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* ✅ TRIGGER BUTTON - BADA & BOLD */}
      <button 
        className={`
          px-5 py-2.5 text-lg font-bold rounded-xl transition-all duration-200 
          flex items-center gap-2 focus:outline-none
          text-gray-900 hover:text-amber-600 hover:bg-amber-50
          ${isOpen ? 'text-amber-600 bg-amber-50' : ''}
        `}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* ✅ DROPDOWN PANEL - BADA */}
      {isOpen && (
        <div className={`
          absolute top-full left-1/2 -translate-x-1/2 mt-3 
          ${widthClass} 
          max-w-[95vw] 
          bg-white rounded-3xl shadow-2xl border border-gray-100 
          overflow-hidden z-50 
          animate-in fade-in slide-in-from-top-2 duration-200
        `}>
          <div className="p-8 lg:p-10">
            <div className={`grid ${gridCols} gap-8 lg:gap-10`}>
              {columns.map((column, colIdx) => (
                <div key={column._key || colIdx} className="space-y-5">
                  {/* ✅ COLUMN HEADER - BADA */}
                  <h4 className="text-sm font-extrabold text-black uppercase tracking-widest pb-3 border-b-2 border-amber-200">
                    {column.title}
                  </h4>
                  
                  {/* ✅ LINKS LIST - BADA GAP */}
                  <ul className="space-y-2">
                    {(column.links || []).map((link, i) => {
                      const targetUrl = link.url && link.url.trim() !== '' ? link.url : '#';
                      
                      return (
                        <li key={i}>
                          <Link
                            href={targetUrl}
                            prefetch={targetUrl !== '#'}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-gray-50 group/link transition-all duration-200"
                          >
                            {/* ✅ IMAGE CONTAINER - BADA */}
                            {showImages && (
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center border-2 border-gray-100 relative group-hover/link:border-amber-200 transition-colors">
                                {link.imageUrl ? (
                                  <Image
                                    src={link.imageUrl}
                                    alt=""
                                    fill
                                    sizes="48px"
                                    className="object-cover group-hover/link:scale-110 transition-transform duration-300"
                                  />
                                ) : (
                                  <Package className="w-5 h-5 text-gray-400 opacity-60" />
                                )}
                              </div>
                            )}
                            
                            {/* ✅ LINK LABEL - BADA & BOLD */}
                            <span className="text-base text-gray-800 font-semibold group-hover/link:text-amber-600 transition-colors duration-150">
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

          {/* ✅ BOTTOM FOOTER - BADA */}
          {viewAllUrl && (
            <Link
              href={viewAllUrl}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-3 px-8 py-5 bg-gray-50 text-base font-extrabold text-gray-900 hover:text-amber-600 hover:bg-amber-50/50 transition-all border-t-2 border-gray-100 group/btn"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}