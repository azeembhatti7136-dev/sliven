// src/lib/sanity.ts
// ✅ THE DEFINITIVE SANITY CDN SPECIFICATION - Fixes All Image Blocks Immediately!

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

interface ImageBuilder {
  url: () => string;
  width: (w: number) => ImageBuilder;
  height: (h: number) => ImageBuilder;
  format: (f: string) => ImageBuilder;
  quality: (q: number) => ImageBuilder;
}

const dummyBuilder: ImageBuilder = {
  url: () => '',
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

  // 1. "image-" prefix remove karein
  let cleanRef = ref;
  if (cleanRef.startsWith('image-')) {
    cleanRef = cleanRef.substring(6);
  }

  // 2. Ref ko split karein parts mein
  const parts = cleanRef.split('-');
  if (parts.length < 3) return dummyBuilder;

  const fmt = parts[parts.length - 1]; // e.g., "jpg", "png", "webp"
  const dims = parts[parts.length - 2]; // e.g., "1920x1080"
  
  // Pure original asset ID (Bina dimensions aur extension ke)
  const id = parts.slice(0, parts.length - 2).join('-');

  // Original specs parse karein (Sanity CDN requires exact original dimensions in the pathname)
  const [origW, origH] = dims.split('x').map(Number);
  if (!origW || !origH) return dummyBuilder;

  let targetW: number | null = null;
  let targetH: number | null = null;
  let f = fmt;
  let q = 80;

  const buildUrl = (): string => {
    // Resizing ke params queries ke through chalenge
    const queryParams: string[] = [];

    if (targetW) queryParams.push(`w=${targetW}`);
    if (targetH) queryParams.push(`h=${targetH}`);
    
    queryParams.push(`q=${q}`);
    queryParams.push(`auto=format`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    // ⚡ CRITICAL FIX: Pathname ke andar ALWAYS original `dims` (origW x origH) jati hain!
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dims}.${f}${queryString}`;
  };

  const builder: ImageBuilder = {
    url: buildUrl,
    width: (width: number) => { targetW = width; return builder; },
    height: (height: number) => { targetH = height; return builder; },
    format: (format: string) => { f = format; return builder; },
    quality: (quality: number) => { q = quality; return builder; },
  };

  return builder;
}