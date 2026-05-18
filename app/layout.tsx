// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanity';
import FloatingButtons from '@/components/FloatingButtons';

async function getSettings() {
  return client.fetch(`
    *[_type == "settings"][0] {
      logo,
      logoText,
      menu {
        links[] {
          _key, _type,
          // Collection Group
          _type == "collectionGroup" => { label, "link": reference->slug.current },
          // Internal Link
          _type == "linkInternal" => { label, "link": reference->slug.current },
          // External Link
          _type == "linkExternal" => { label, "url": url },
          // 👇 DROPDOWN
          _type == "dropdownMenu" => {
            label,
            childLinks[] {
              _key, _type,
              _type == "linkInternal" => { label, "link": reference->slug.current },
              _type == "linkExternal" => { label, "url": url }
            }
          }
        }
      },
      footer { links[] { _key, _type, _type == "linkInternal" => { label, "link": reference->slug.current }, _type == "linkExternal" => { label, url } }, text }
    }
  `);
}

export const metadata: Metadata = {
  title: 'Quotify - Custom Quotes E-Commerce',
  description: 'Get custom quotes for bulk orders',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className="font-sans">
        <Header /> 
        {children}
        <Footer 
          links={settings?.footer?.links}
          text={settings?.footer?.text}
        />
        {/* <ToastProvider />
<FloatingButtons /> 
*/}
      </body>
    </html>
  );
}