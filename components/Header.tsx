// src/components/Header.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Search, ArrowRight, ChevronDown } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

interface SubLink {
  _key: string;
  label?: string;
  link?: string;
  url?: string;
}

interface MenuLink {
  _key: string;
  _type?: string;         // 👈 ADD
  label?: string;
  link?: string;
  url?: string;
  childLinks?: SubLink[];
}

interface HeaderProps {
  menu?: { links?: MenuLink[] };
  logo?: any;
  logoText?: string;
}

export default function Header({ menu, logo, logoText }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navLinks = menu?.links?.filter(link => {
  // Dropdown - has label and childLinks
  if (link._type === 'dropdownMenu' && link.label && link.childLinks?.length) return true;
  // Regular link - has label and (link or url)
  if (link.label && (link.link || link.url)) return true;
  return false;
}) || [];

const getHref = (link: MenuLink | SubLink) => (link as any).link || (link as any).url || '/';

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setIsSearchOpen(false); setIsMobileMenuOpen(false); setOpenDropdown(null); } };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) setIsSearchOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) setIsMobileMenuOpen(false);
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

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logo ? (
              <Image src={urlFor(logo).width(240).height(80).url()} alt="Logo" width={240} height={80} className="h-16 w-auto" />
            ) : (
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                {logoText || 'Quotify'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          {navLinks.length > 0 && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link._key} className="relative">
                  {/* Has Sub-links? */}
                  {link.childLinks && link.childLinks.length > 0 ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === link._key ? null : link._key)}
                        onMouseEnter={() => setOpenDropdown(link._key)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className={`px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
                          openDropdown === link._key ? 'text-white bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === link._key ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown */}
                      {openDropdown === link._key && (
                        <div
                          className="absolute top-full left-0 mt-1 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 z-50"
                          onMouseEnter={() => setOpenDropdown(link._key)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {link.childLinks.map((sub) => (
                            <Link
                              key={sub._key}
                              href={getHref(sub)}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-all mx-1 rounded-lg"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={getHref(link)}
                      className="px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMobileMenuOpen(false); }}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link href="/products" className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg">
              Get Quote
            </Link>

            <button
              onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsSearchOpen(false); }}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-white hover:bg-gray-800"
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
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-12 pr-14 py-4 text-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
              <div className="flex gap-2 mt-3 flex-wrap">
                {['T-Shirts', 'Hoodies', 'Custom Apparel', 'Teamwear'].map((s) => (
                  <button key={s} onClick={() => setSearchQuery(s)} className="px-3 py-1.5 text-sm text-gray-400 bg-gray-800 rounded-full hover:bg-amber-500/20 hover:text-amber-400 transition-all">{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden border-t border-gray-800 py-4 bg-black">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link._key}>
                  {link.childLinks && link.childLinks.length > 0 ? (
                    <MobileDropdown link={link} onClose={() => setIsMobileMenuOpen(false)} />
                  ) : (
                    <Link href={getHref(link)} onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-base font-semibold rounded-xl">
                Get Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

// Mobile Dropdown Component
function MobileDropdown({ link, onClose }: { link: MenuLink; onClose: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg"
      >
        {link.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && link.childLinks && (
        <div className="ml-4 space-y-1 py-1">
          {link.childLinks.map((sub) => (
            <Link
              key={sub._key}
              href={(sub as any).link || (sub as any).url || '/'}
              onClick={onClose}
              className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}