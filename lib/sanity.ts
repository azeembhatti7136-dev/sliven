// src/lib/sanity.ts
// ✅ COMPLETELY SAFE & BULLETPROOF - No @sanity imports!

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

  // ref format: image-{id}-{WIDTH}x{HEIGHT}-{format}
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return dummyBuilder;
  
  const id = match[1];     // Asset ID
  const dims = match[2];   // e.g., "1920x600"
  const fmt = match[3];    // Extension

  // Original dimensions nikalwain takay agar user height na de, to image transform bigre nahi
  const [origW, origH] = dims.split('x').map(Number);

  let targetW: number | null = null;
  let targetH: number | null = null;
  let f = fmt;
  let q = 80;

  const buildUrl = (): string => {
    // Agar sirf width di ho to auto-aspect ratio set karein takay stretch na ho
    if (targetW && !targetH) {
      targetH = Math.round((targetW / origW) * origH);
    } else if (targetH && !targetW) {
      targetW = Math.round((targetH / origH) * origW);
    }

    const finalW = targetW || origW;
    const finalH = targetH || origH;

    // Sanity standard asset url format with exact query modifiers
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${finalW}x${finalH}.${f}?q=${q}&auto=format`;
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