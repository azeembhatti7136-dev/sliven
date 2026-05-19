import { getAllPages } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import Image from 'next/image';

export default async function PagesList() {
  const pages = await getAllPages();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ───── Header Banner ───── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pages</h1>
        </div>
      </div>

      {/* ───── Grid Content ───── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(!pages || pages.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500 font-medium">No pages yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page: any) => {
              
              // 👇 Safe Image Resolving Fallback (Checks both SEO Image & Hero Background)
              let pageImageSource = null;
              if (page.seoImage && page.seoImage.asset) {
                pageImageSource = page.seoImage;
              } else if (page.hero?.backgroundImage && page.hero.backgroundImage.asset) {
                pageImageSource = page.hero.backgroundImage;
              }

              const imageUrl = pageImageSource 
                ? urlFor(pageImageSource).width(600).height(450).auto('format').url() 
                : null;

              return (
                <Link
                  key={page._id}
                  href={`/pages/${page.slug?.current || '#'}`}
                  className="group relative overflow-hidden rounded-3xl bg-gray-200 aspect-[4/3] hover:shadow-2xl transition-all duration-300 transform active:scale-[0.99] border border-gray-100"
                >
                  {/* Image Render */}
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={page.title || 'Page Preview'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-amber-50 to-orange-50/40 text-amber-500/50 gap-2">
                      <FileText className="w-12 h-12 opacity-40" />
                      <span className="text-xs font-semibold opacity-60">No Cover Image</span>
                    </div>
                  )}

                  {/* Premium Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Content Meta Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-amber-400 transition-colors">
                      {page.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 mt-3">
                      {page.showHero && (
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/5">
                          Hero Section
                        </span>
                      )}
                      <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md backdrop-blur-md">
                        Dynamic Page
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}