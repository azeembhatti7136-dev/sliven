// src/components/Footer.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

interface FooterLink {
  _key: string;
  label?: string;
  link?: string;
  href?: string;
}

interface FooterColumn {
  _key: string;
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: any;
  logoText?: string;
  description?: string;
  columns?: FooterColumn[];
  bottomText?: string;
  text?: any;
  links?: FooterLink[];
  socialLinks?: { _key: string; platform: string; link: string }[];
}

export default function Footer({
  logo,
  logoText,
  logoUrl, // 👈 ADD THIS
  description,
  columns,
  bottomText,
  text,
  links,
  socialLinks,
}: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              {logoUrl ? ( // 👈 CHANGE: logo -> logoUrl
                <Image
                  src={logoUrl} // 👈 CHANGE
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto brightness-0 invert"
                />
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  {logoText || 'Quotify'}
                </span>
              )}
            </Link>
            
            {description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {description}
              </p>
            )}

            {text && (
              <div className="text-gray-400 text-sm prose prose-invert">
                <PortableText value={text} />
              </div>
            )}
          </div>

          {/* Links Columns */}
          {columns && columns.length > 0 ? (
            columns.map((column) => (
              <div key={column._key}>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links?.map((link) => (
                    <li key={link._key}>
                      <Link
                        href={link.link || link.href || '#'}
                        className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                      >
                        {link.label || link.link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : links && links.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link._key}>
                    <Link
                      href={link.link || link.href || '#'}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label || link.link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // Default Links
            <>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/collections" className="text-sm text-gray-400 hover:text-white transition-colors">Collections</Link></li>
                  <li><Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">Products</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                  Support
                </h4>
                <ul className="space-y-3">
                  <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="/shipping" className="text-sm text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {bottomText || `© ${new Date().getFullYear()} Quotify. All rights reserved.`}
            </p>
            
            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social._key}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors text-sm capitalize"
                  >
                    {social.platform}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}