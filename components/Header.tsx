'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ArrowRight } from 'lucide-react';
import MegaMenu from './MegaMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile accordion state for managing multiple mega menus
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch settings + collections from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error('Failed to fetch menu');
        const data = await response.json();
        
        if (data?.settings?.menu) {
          setSettings(data.settings.menu);
        }
        setCollections(data?.collections || []);
      } catch (err) {
        console.error('Header fetch error:', err);
        setCollections([]);
      }
    };
    
    fetchMenuData();
  }, []);

  // Safe variables parsing from state
  const logoUrl = settings?.logoUrl;
  const logoText = settings?.logoText || 'SLIVENSPORTS';
  const logoWidth = settings?.logoWidth || 200;
  
  // 👇 Unified configuration array (Supports safe mixed type ordering)
  const navItems = settings?.navItems || []; 
  
  const headerStyle = settings?.headerStyle || {};
  const bgColor = headerStyle.backgroundColor || '#000000';
  const isSticky = headerStyle.sticky !== false;
  const headerHeight = 72;
  const showSearch = headerStyle.showSearch !== false;
  const showCTA = headerStyle.showCTA !== false;
  const ctaText = headerStyle.ctaText || 'Get Quote';
  const ctaUrl = headerStyle.ctaUrl || '/products';

  // Theme checking
  const isDark = bgColor === '#000000' || bgColor === '#111827';
  const navTextClass = isDark 
    ? 'text-gray-300 hover:text-white hover:bg-gray-800/60' 
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80';
  const borderClass = isDark ? 'border-gray-800/80' : 'border-gray-200/80';
  const buttonClass = 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-orange-500/10';

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { 
        setIsSearchOpen(false); 
        setIsMobileMenuOpen(false); 
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) setIsSearchOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target) && !(target as Element).closest('button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); setIsMobileMenuOpen(false); };
  const toggleMobile = () => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsSearchOpen(false); };

  return (
    <header
      ref={headerRef}
      className={`${isSticky ? 'sticky top-0' : ''} z-50 border-b backdrop-blur-md ${borderClass} transition-all duration-300`}
      style={{ backgroundColor: bgColor, minHeight: `${headerHeight}px` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ minHeight: `${headerHeight}px` }}>
        <div className="flex items-center justify-between" style={{ minHeight: `${headerHeight}px` }}>

          {/* ───── Logo ───── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 active:scale-98 transition-transform">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                width={logoWidth}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
                {logoText}
              </span>
            )}
          </Link>

          {/* ───── Desktop Navigation (✨ Dynamic Mix-Ordering) ───── */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item: any, idx: number) => {
              // 1. Simple Link Element
              if (item._type === 'navLink') {
                return (
                  <Link
                    key={item._key || idx}
                    href={item.url || '/'}
                    className={`px-4 py-2 text-lg font-bold rounded-xl transition-all duration-200 ${navTextClass}`}
                  >
                    {item.label}
                  </Link>
                );
              }

              // 2. Multi-Mega-Menu Element
              if (item._type === 'megaMenu') {
                const megaConfig = { ...item, enabled: true };
                return (
                  <MegaMenu key={item._key || idx} config={megaConfig} />
                );
              }

              return null;
            })}
          </nav>

          {/* ───── Right Actions ───── */}
          <div className="flex items-center gap-2">
            {showSearch && (
              <button 
                onClick={toggleSearch}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${navTextClass} ${isSearchOpen ? 'bg-gray-800 text-white' : ''}`}
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {showCTA && (
              <Link 
                href={ctaUrl}
                className={`hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all transform active:scale-95 ${buttonClass}`}
              >
                {ctaText}
              </Link>
            )}

            <button 
              onClick={toggleMobile}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all ${navTextClass}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ───── Search Overlay ───── */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800/80 shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search brands, products or collections..."
                  className="w-full pl-12 pr-14 py-3.5 text-base bg-gray-800 text-white placeholder-gray-400 border border-gray-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button 
                  type="submit"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${buttonClass}`}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ───── Mobile Menu (With Multi Menu Support) ───── */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef} 
            className="lg:hidden border-t border-gray-800/50 absolute left-0 right-0 top-full max-h-[85vh] overflow-y-auto shadow-2xl transition-all duration-300" 
            style={{ backgroundColor: bgColor }}
          >
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item: any, idx: number) => {
                const uniqueKey = item._key || `mob-${idx}`;

                // A. Simple Link Item
                if (item._type === 'navLink') {
                  return (
                    <Link
                      key={uniqueKey}
                      href={item.url || '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 text-base font-semibold rounded-xl transition-all ${navTextClass}`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // B. Mega Menu Dynamic Dropdowns (Accordion Style)
                if (item._type === 'megaMenu') {
                  const isExpanded = activeMobileMenu === uniqueKey;
                  
                  return (
                    <div key={uniqueKey} className="rounded-xl overflow-hidden bg-gray-900/20 border border-gray-800/30 my-0.5">
                      <button
                        onClick={() => setActiveMobileMenu(isExpanded ? null : uniqueKey)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-base font-bold text-left transition-all ${
                          isDark ? 'text-white hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <span>{item.title}</span>
                        <span className={`text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180 text-amber-500' : 'text-gray-400'}`}>
                          ▼
                        </span>
                      </button>

                      {/* Accordion content */}
                      {isExpanded && (
                        <div className="px-4 pb-3 pt-1 bg-black/10 space-y-4 border-t border-gray-800/20 animate-in fade-in duration-150">
                          {item.columns?.map((col: any, cIdx: number) => (
                            <div key={col._key || cIdx} className="space-y-1.5">
                              <div className="px-2 text-xs font-black text-gray-500 uppercase tracking-wider">
                                {col.title}
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                {col.links?.map((link: any, lIdx: number) => (
                                  <Link
                                    key={lIdx}
                                    href={link.url || '#'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-2 py-2 text-sm text-gray-300 hover:text-amber-400 rounded-lg bg-gray-800/30 border border-gray-800/10 truncate transition-colors"
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                          
                          {/* Inside Multi Mega view-all */}
                          {item.viewAllUrl && (
                            <Link
                              href={item.viewAllUrl}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block text-center mt-2 py-2 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20"
                            >
                              {item.viewAllText || 'View All'} →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              })}

              {/* Mobile Footer Call To Action */}
              {showCTA && (
                <Link
                  href={ctaUrl}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mt-4 text-center px-4 py-3.5 text-base font-bold rounded-xl shadow-lg ${buttonClass}`}
                >
                  {ctaText}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}