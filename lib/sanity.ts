// src/lib/sanity.ts - NO @sanity/image-url IMPORT!
// Completely safe, no dependency on @sanity/client

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'd2zeiu5j';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

/**
 * Build Sanity image URL WITHOUT using @sanity/image-url
 * @param source - Sanity image object or ref string
 * @param width - Optional width
 * @param height - Optional height
 * @returns URL string
 */
export function urlFor(source: any) {
  if (!source) return '';
  
  // Get the image ref
  let ref: string;
  if (typeof source === 'string') {
    ref = source;
  } else if (source?.asset?._ref) {
    ref = source.asset._ref;
  } else if (source?._ref) {
    ref = source._ref;
  } else {
    return '';
  }

  // ref format: image-{id}-{width}x{height}-{format}
  const parts = ref.split('-');
  const id = parts[1];
  const dimensions = parts[2] || '800x600';
  const format = parts[3] || 'jpg';

  // Build URL
  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;

  // Add query params
  const params: string[] = [];
  
  return {
    url: () => url,
    width: (w: number) => {
      url = url.replace(/-\d+x\d+-/, `-${w}x${Math.round(w * 0.75)}-`);
      return { url: () => url, height: (h: number) => { url = url.replace(/x\d+-/, `x${h}-`); return { url: () => url }; } };
    },
    height: (h: number) => {
      url = url.replace(/x\d+-/, `x${h}-`);
      return { url: () => url };
    },
    format: (f: string) => {
      url = url.replace(/\.\w+$/, `.${f}`);
      return { url: () => url };
    },
    quality: (q: number) => {
      return { url: () => `${url}?q=${q}` };
    },
  };
}