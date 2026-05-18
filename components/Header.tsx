'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ArrowRight, ChevronDown } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { fetchClient } from '@/lib/sanityFetch';
import MegaMenu from './MegaMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch settings + collections
  useEffect(() => {
    fetchClient.fetch(`{
      "settings": *[_type == "settings"][0] {
        menu {
          logo, logoText, logoWidth,
          megaMenu {
            enabled, title, showImages, viewAllText, viewAllUrl,
            columns[] {
              _key, title,
              links[] { label, url, image }
            }
          },
          links[] { label, url },
          headerStyle { backgroundColor, sticky, showSearch, showCTA, ctaText, ctaUrl }
        }
      },
      "collections": *[_type == "simpleCollection"] | order(title asc) { _id, title, slug, image }
    }`)
    .then((data: any) => {
      if (data?.settings?.menu) {
        setSettings(data.settings.menu);
      }
      setCollections(data?.collections || []);
    })
    .catch((err) => {
      console.error('Header fetch error:', err);
      setCollections([]);
    });
  }, []);

  // Default values
  const logo = settings?.logo;
  const logoText = settings?.logoText || 'SLIVENSPORTS';
  const logoWidth = settings?.logoWidth || 200;
  const navLinks = settings?.links || [];
  const headerStyle = settings?.headerStyle || {};
  const bgColor = headerStyle.backgroundColor || '#000000';
  const isSticky = headerStyle.sticky !== false;
  const headerHeight = 72;
  const showSearch = headerStyle.showSearch !== false;
  const showCTA = headerStyle.showCTA !== false;
  const ctaText = headerStyle.ctaText || 'Get Quote';
  const ctaUrl = headerStyle.ctaUrl || '/products';
  const megaMenuConfig = settings?.megaMenu;

  // Colors
  const isDark = bgColor === '#000000' || bgColor === '#111827';
  const navTextClass = isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
  const borderClass = isDark ? 'border-gray-800' : 'border-gray-200';
  const buttonClass = 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600';

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setIsMobileMenuOpen(false); }
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
      className={`${isSticky ? 'sticky top-0' : ''} z-50 border-b ${borderClass}`}
      style={{ backgroundColor: bgColor, minHeight: `${headerHeight}px` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ minHeight: `${headerHeight}px` }}>
        <div className="flex items-center justify-between" style={{ minHeight: `${headerHeight}px` }}>

          {/* ───── Logo ───── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logo ? (
              <Image
                src={urlFor(logo).width(logoWidth).url()}
                alt="Logo"
                width={logoWidth}
                height={40}
                className="h-10 w-auto"
                priority
              />
            ) : (
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {logoText}
              </span>
            )}
          </Link>

          {/* ───── Desktop Navigation ───── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link: any) => (
              <Link
                key={link._key || link.label}
                href={link.url || '/'}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${navTextClass}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mega Menu */}
            {settings?.megaMenu?.enabled && (
              <MegaMenu config={settings.megaMenu} />
            )}
          </nav>

          {/* ───── Right Actions ───── */}
          <div className="flex items-center gap-2">
            {showSearch && (
              <button onClick={toggleSearch}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${navTextClass}`}
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {showCTA && (
              <Link href={ctaUrl}
                className={`hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg ${buttonClass}`}
              >
                {ctaText}
              </Link>
            )}

            <button onClick={toggleMobile}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all ${navTextClass}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ───── Search Overlay ───── */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-2xl">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-14 py-4 text-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button type="submit"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center hover:shadow-lg transition-all ${buttonClass}`}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ───── Mobile Menu ───── */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden border-t border-gray-800 py-4" style={{ backgroundColor: bgColor }}>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link: any) => (
                <Link
                  key={link._key || link.label}
                  href={link.url || '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-lg transition-all ${navTextClass}`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Collections */}
              {megaMenuConfig?.enabled && (
                <>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase mt-2">
                    {megaMenuConfig.title || 'Collections'}
                  </div>
                  {megaMenuConfig.columns?.map((col: any) => (
                    <div key={col._key}>
                      <div className="px-6 py-1 text-xs font-semibold text-gray-500 uppercase">{col.title}</div>
                      {col.links?.map((link: any) => (
                        <Link
                          key={link.label}
                          href={link.url || '#'}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-8 py-2 text-sm text-gray-300 hover:text-white rounded-lg"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    href={megaMenuConfig.viewAllUrl || '/collections'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-sm text-amber-400 font-medium"
                  >
                    {megaMenuConfig.viewAllText || 'View All Collections'} →
                  </Link>
                </>
              )}

              {showCTA && (
                <Link
                  href={ctaUrl}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`mt-3 text-center px-4 py-3 text-base font-semibold rounded-xl ${buttonClass}`}
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