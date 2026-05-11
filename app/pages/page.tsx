// src/app/pages/page.tsx
import { getAllPages } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import Image from 'next/image';

export default async function PagesList() {
  const pages = await getAllPages();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pages.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page: any) => (
              <Link
                key={page._id}
                href={`/pages/${page.slug.current}`}
                className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] hover:shadow-xl transition-all duration-300"
              >
                {page.seoImage ? (
                  <Image
                    src={urlFor(page.seoImage).width(600).height(450).url()}
                    alt={page.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : page.hero?.backgroundImage ? (
                  <Image
                    src={urlFor(page.hero.backgroundImage).width(600).height(450).url()}
                    alt={page.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-orange-50">
                    <FileText className="w-12 h-12 text-amber-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white">{page.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    {page.showHero && (
                      <span className="text-white/60 text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Hero
                      </span>
                    )}
                    <span className="text-white/60 text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Page
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}