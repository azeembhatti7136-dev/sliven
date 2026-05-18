// src/components/Header.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ArrowRight, ChevronDown } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { client } from '@/lib/sanity';
import MegaMenu from './MegaMenu';


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch settings + collections
  useEffect(() => {
    client.fetch(`{
      "settings": *[_type == "settings"][0] {
        menu {
          logo, logoText, logoWidth, layout, showMegaMenu, megaMenuTitle,
          links[] { label, url, type, icon, childLinks[] { label, url, image } },
          headerStyle { backgroundColor, textColor, sticky, height, showSearch, showCTA, ctaText, ctaUrl }
        }
      },
      "collections": *[_type == "simpleCollection"] | order(title asc) { _id, title, slug, image }
    }`).then((data: any) => {
      setSettings(data?.settings?.menu);
      setCollections(data?.collections || []);
    }).catch(() => {
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
  const textColor = headerStyle.textColor || '#ffffff';
  const isSticky = headerStyle.sticky !== false;
  const headerHeight = headerStyle.height || 80;
  const showSearch = headerStyle.showSearch !== false;
  const showCTA = headerStyle.showCTA !== false;
  const ctaText = headerStyle.ctaText || 'Get Quote';
  const ctaUrl = headerStyle.ctaUrl || '/products';
  const showMegaMenu = settings?.showMegaMenu !== false;
  const megaMenuTitle = settings?.megaMenuTitle || 'Collections';

  // Text color classes
  const textClass = textColor === '#ffffff' ? 'text-white' : textColor === '#000000' ? 'text-black' : 'text-gray-300';
  const textHoverClass = textColor === '#ffffff' ? 'hover:text-white' : textColor === '#000000' ? 'hover:text-black' : 'hover:text-white';
  const bgHoverClass = textColor === '#ffffff' ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const navTextClass = textColor === '#ffffff' ? 'text-gray-300' : 'text-gray-600';
  const borderClass = textColor === '#ffffff' ? 'border-gray-800' : 'border-gray-200';

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsCollectionOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) setIsSearchOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) setIsMobileMenuOpen(false);
      if (collectionRef.current && !collectionRef.current.contains(target)) {
        setIsCollectionOpen(false);
        setOpenDropdown(null);
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

  const handleCollectionHover = (open: boolean) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (open) {
      setIsCollectionOpen(true);
    } else {
      closeTimer.current = setTimeout(() => setIsCollectionOpen(false), 200);
    }
  };

  return (
    <header
      ref={headerRef}
      className={`${isSticky ? 'sticky top-0' : ''} z-50 border-b ${borderClass}`}
      style={{ backgroundColor: bgColor, height: `${headerHeight}px` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logo ? (
              <Image
                src={urlFor(logo).width(logoWidth).height(headerHeight / 2).url()}
                alt="Logo"
                width={logoWidth}
                height={headerHeight / 2}
                className="h-auto w-auto"
                style={{ maxHeight: `${headerHeight - 16}px` }}
              />
            ) : (
              <span className={`text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent`}>
                {logoText}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link: any) => (
              <div key={link._key || link.label} className="relative group"
                onMouseEnter={() => link.type === 'dropdown' && setOpenDropdown(link.label)}
                onMouseLeave={() => link.type === 'dropdown' && setOpenDropdown(null)}
              >
                {link.type === 'dropdown' && link.childLinks?.length > 0 ? (
                  <>
                    <button className={`px-4 py-2 text-base font-medium ${navTextClass} ${textHoverClass} ${bgHoverClass} rounded-lg transition-all flex items-center gap-1`}>
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                        <div className="py-2">
                          {link.childLinks.map((child: any) => (
                            <Link key={child.label} href={child.url || '#'} onClick={() => setOpenDropdown(null)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
                            >
                              {child.image && <Image src={urlFor(child.image).width(40).height(40).url()} alt="" width={28} height={28} className="rounded-lg object-cover" />}
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={link.url || '/'} className={`px-4 py-2 text-base font-medium ${navTextClass} ${textHoverClass} ${bgHoverClass} rounded-lg transition-all ${link.type === 'button' ? `bg-gradient-to-r from-amber-500 to-orange-500 !text-white hover:from-amber-600 hover:to-orange-600` : ''}`}>
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <MegaMenu config={settings?.megaMenu} />
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {showSearch && (
              <button onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMobileMenuOpen(false); }}
                className={`w-10 h-10 flex items-center justify-center rounded-xl ${navTextClass} ${textHoverClass} ${bgHoverClass} transition-all`}
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {showCTA && (
              <Link href={ctaUrl} className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg">
                {ctaText}
              </Link>
            )}

            <button onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsSearchOpen(false); }}
              className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-xl ${navTextClass} ${textHoverClass} ${bgHoverClass}`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div ref={searchContainerRef} className="absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-2xl">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..." className="w-full pl-12 pr-14 py-4 text-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden border-t border-gray-800 py-4 bg-black">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link: any) => (
                <Link key={link._key || link.label} href={link.url || '/'} onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium ${navTextClass} ${textHoverClass} ${bgHoverClass} rounded-lg ${link.type === 'button' ? 'bg-gradient-to-r from-amber-500 to-orange-500 !text-white' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {showMegaMenu && (
                <>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase mt-2">{megaMenuTitle}</div>
                  {collections.slice(0, 8).map((col: any) => (
                    <Link key={col._id} href={`/collections/${col.slug?.current}`} onClick={() => setIsMobileMenuOpen(false)}
                      className="px-6 py-2 text-base text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
                    >
                      {col.title}
                    </Link>
                  ))}
                  <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-sm text-amber-400">
                    View All Collections →
                  </Link>
                </>
              )}
              {showCTA && (
                <Link href={ctaUrl} onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-semibold rounded-xl"
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