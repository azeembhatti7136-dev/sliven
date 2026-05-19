// src/lib/sanity.ts
// 📝 DEBUGGING VERSION - Yeh console par errors aur data leak karega!

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
  url: () => {
    console.warn("⚠️ urlFor: dummyBuilder triggered (Empty URL returned)");
    return '';
  },
  width: () => dummyBuilder,
  height: () => dummyBuilder,
  format: () => dummyBuilder,
  quality: () => dummyBuilder,
};

export function urlFor(source: any): ImageBuilder {
  console.log("🔍 urlFor received source data:", JSON.parse(JSON.stringify(source)));

  const getRef = (): string => {
    if (!source) {
      console.error("❌ urlFor Error: source is completely null or undefined");
      return '';
    }
    if (typeof source === 'string') {
      if (source.startsWith('http')) {
        console.log("ℹ️ urlFor: source is already a direct HTTP URL string:", source);
      }
      return source;
    }
    
    // Check various Sanity image object variants
    if (source?.asset?._ref) return source.asset._ref;
    if (source?._ref) return source._ref;
    if (source?.asset?.url) {
      console.log("ℹ️ urlFor: Found direct url inside asset object:", source.asset.url);
      return source.asset.url;
    }

    console.error("❌ urlFor Error: Could not find any valid _ref or string in this object!", source);
    return '';
  };

  const ref = getRef();
  if (!ref) return dummyBuilder;

  // Agar direct URL string chal rahi hai to directly return karein builder ke through
  if (ref.startsWith('http')) {
    return {
      url: () => ref,
      width: function() { return this; },
      height: function() { return this; },
      format: function() { return this; },
      quality: function() { return this; },
    };
  }

  // Sanity image asset parser logic
  let cleanRef = ref;
  if (cleanRef.startsWith('image-')) {
    cleanRef = cleanRef.substring(6);
  }

  const parts = cleanRef.split('-');
  if (parts.length < 3) {
    console.error("❌ urlFor Error: _ref string structure is invalid or not a standard Sanity asset string:", ref);
    return dummyBuilder;
  }

  const fmt = parts[parts.length - 1]; 
  const dims = parts[parts.length - 2]; 
  const id = parts.slice(0, parts.length - 2).join('-');

  const [origW, origH] = dims.split('x').map(Number);
  if (!origW || !origH) {
    console.error("❌ urlFor Error: Failed to parse dimensions from _ref:", dims);
    return dummyBuilder;
  }

  let targetW: number | null = null;
  let targetH: number | null = null;
  let f = fmt;
  let q = 80;

  const buildUrl = (): string => {
    if (targetW && !targetH) {
      targetH = Math.round((targetW / origW) * origH);
    } else if (targetH && !targetW) {
      targetW = Math.round((targetH / origH) * origW);
    }

    const finalW = targetW || origW;
    const finalH = targetH || origH;

    const generatedUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${finalW}x${finalH}.${f}?q=${q}&auto=format`;
    console.log("✅ urlFor successfully generated CDN URL:", generatedUrl);
    return generatedUrl;
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