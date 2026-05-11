// src/components/Header.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { urlFor } from '@/lib/sanity';

interface MenuLink {
  _key: string;
  label?: string;
  link?: string;
  url?: string;  // 👈 ADDED
  childLinks?: MenuLink[];
}

interface HeaderProps {
  menu?: {
    links?: MenuLink[];
  };
  logo?: any;
  logoText?: string;
}

export default function Header({ menu, logo, logoText }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = menu?.links?.filter(
    link => link.label && (link.link || link.url)  // 👈 FIXED
  ) || [];

  const getHref = (link: MenuLink) => link.link || link.url || '/';  // 👈 HELPER

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {logo ? (
              <Image
                src={urlFor(logo).width(120).height(40).url()}
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            ) : (
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {logoText || 'Quotify'}
              </span>
            )}
          </Link>

          {navLinks.length > 0 && (
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link._key}
                  href={getHref(link)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  {link.label || 'Link'}
                </Link>
              ))}
            </nav>
          )}

          <div className="hidden lg:block">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Get Quote
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link._key}
                  href={getHref(link)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  {link.label || 'Link'}
                </Link>
              ))}
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 text-center px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl"
              >
                Get Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}