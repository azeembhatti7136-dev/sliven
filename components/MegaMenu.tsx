// src/components/MegaMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

interface MenuColumn {
  _key: string;
  title: string;
  links: Array<{
    label: string;
    url: string;
    image?: any;
  }>;
}

interface MegaMenuConfig {
  enabled: boolean;
  title: string;
  columns: MenuColumn[];
  showImages: boolean;
  viewAllText: string;
  viewAllUrl: string;
}

interface MegaMenuProps {
  config: MegaMenuConfig;
  textClass?: string;
}

export default function MegaMenu({ config, textClass = 'text-white' }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
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
    closeTimer.current = setTimeout(() => setIsOpen(false), 200);
  };

  if (!config?.enabled || !config.columns?.length) return null;

  const { title, columns, showImages, viewAllText, viewAllUrl } = config;
  const colCount = columns.length;
  const widthClass = colCount === 4 ? 'w-[800px]' : colCount === 3 ? 'w-[650px]' : colCount === 2 ? 'w-[450px]' : 'w-[300px]';

  return (
    <div ref={menuRef} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {/* Trigger Button */}
      <button className={`px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all flex items-center gap-1 ${isOpen ? 'text-white bg-gray-800' : ''}`}>
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 ${widthClass} max-w-[95vw] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200`}>
          <div className="p-6 lg:p-8">
            <div className={`grid grid-cols-${colCount} gap-6 lg:gap-8`}>
              {columns.map((column) => (
                <div key={column._key}>
                  {/* Column Title */}
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                    {column.title}
                  </h4>
                  
                  {/* Column Links */}
                  <ul className="space-y-3">
                    {column.links?.map((link, i) => (
                      <li key={i}>
                        <Link
                          href={link.url || '#'}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 group/link"
                        >
                          {showImages && link.image && (
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                              <Image
                                src={urlFor(link.image).width(64).height(64).url()}
                                alt=""
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span className="text-sm text-gray-600 group-hover/link:text-amber-600 transition-colors">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* View All Footer */}
          <Link
            href={viewAllUrl}
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-900 hover:text-amber-600 hover:bg-amber-50 transition-all border-t border-gray-100"
          >
            {viewAllText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}