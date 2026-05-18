// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/lib/sanityClient.server'; // 👈 CHANGE
import FloatingButtons from '@/components/FloatingButtons';
import imageUrlBuilder from '@sanity/image-url'; // 👈 ADD

const builder = imageUrlBuilder({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
});

function urlFor(source: any) {
  if (!source?.asset?._ref) return null;
  return builder.image(source);
}

async function getSettings() {
  return client.fetch(`
    *[_type == "settings"][0] {
      logo,
      logoText,
      menu {
        links[] {
          _key, _type,
          _type == "collectionGroup" => { label, "link": reference->slug.current },
          _type == "linkInternal" => { label, "link": reference->slug.current },
          _type == "linkExternal" => { label, "url": url },
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
  
  // 👇 ADD: Process logo URL server-side
  const logoUrl = settings?.logo ? urlFor(settings.logo)?.width(120).height(40).url() : null;

  return (
    <html lang="en">
      <body className="font-sans">
        <Header /> 
        {children}
        <Footer 
          logoUrl={logoUrl} // 👈 ADD
          logoText={settings?.logoText}
          links={settings?.footer?.links}
          text={settings?.footer?.text}
        />
        <ToastProvider />
        <FloatingButtons />
      </body>
    </html>
  );
}