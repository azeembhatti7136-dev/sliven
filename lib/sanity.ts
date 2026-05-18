// src/lib/sanity.ts
// ✅ COMPLETELY SAFE - No @sanity imports!

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

interface ImageBuilder {
  url: () => string;
  width: (w: number) => ImageBuilder;
  height: (h: number) => ImageBuilder;
  format: (f: string) => ImageBuilder;
  quality: (q: number) => ImageBuilder;
}

// Dummy builder for invalid images
const dummyBuilder: ImageBuilder = {
  url: () => '/placeholder.png',
  width: () => dummyBuilder,
  height: () => dummyBuilder,
  format: () => dummyBuilder,
  quality: () => dummyBuilder,
};

export function urlFor(source: any): ImageBuilder {
  const getRef = (): string => {
    if (!source) return '';
    if (typeof source === 'string') return source;
    return source?.asset?._ref || source?._ref || '';
  };

  const ref = getRef();
  if (!ref) return dummyBuilder;

  // ref format: image-{id}-{width}x{height}-{format}
  const parts = ref.split('-');
  const id = parts[1];
  const format = parts[3] || 'jpg';
  
  let w = 800;
  let h = 600;
  let f = format;
  let q = 80;

  const buildUrl = (): string => 
    `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${w}x${h}.${f}?q=${q}`;

  const builder: ImageBuilder = {
    url: buildUrl,
    width: (width: number) => { w = width; return builder; },
    height: (height: number) => { h = height; return builder; },
    format: (format: string) => { f = format; return builder; },
    quality: (quality: number) => { q = quality; return builder; },
  };

  return builder;
}