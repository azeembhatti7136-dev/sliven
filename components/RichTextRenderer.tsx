// src/components/RichTextRenderer.tsx
'use client';

import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
// ❌ DELETE: function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const match = image.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const id = match[1];
  const fmt = match[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}


// 👇 Safe image URL builder without @sanity/client
function getImageUrl(imageRef: string): string {
  const projectId = 'd2zeiu5j';
  const dataset = 'production';
  // imageRef format: image-{id}-{width}x{height}-{format}
  const parts = imageRef.split('-');
  const id = parts[1];
  const dimensions = parts[2];
  const format = parts[3] || 'jpg';
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
}

function getSanityImageUrl(image: any): string {
  if (!image?.asset?._ref) return '';
  const ref = image.asset._ref;
  // ref format: image-{id}-{dimensions}-{format}
  const [, id, dimensions, format] = ref.split('-');
  const projectId = 'd2zeiu5j';
  const dataset = 'production';
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-800x450.${format || 'jpg'}`;
}

interface RichTextRendererProps {
  content: any;
  className?: string;
  textColor?: string;
  headingColor?: string;
  descriptionColor?: string;
}

const createComponents = (headingColor = 'text-gray-900', descriptionColor = 'text-gray-700') => ({
  types: {
    customRichText: ({value}: any) => {
      if (!value?.text) return null;
      return <PortableText value={value.text} components={createComponents(headingColor, descriptionColor)} />;
    },
    image: ({value}: any) => (
      <div className="relative aspect-video my-6 rounded-xl overflow-hidden">
        <Image
          src={getSanityImageUrl(value)} // 👈 Safe URL function
          alt={value.alt || ''}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
    ),
  },
  marks: {
    color: ({children, value}: any) => {
      const style: React.CSSProperties = {};
      if (value?.color && value.color !== '#ffffff') style.color = value.color;
      if (value?.backgroundColor && value.backgroundColor !== 'transparent') {
        style.backgroundColor = value.backgroundColor;
        style.padding = '2px 6px';
        style.borderRadius = '4px';
      }
      return <span style={style}>{children}</span>;
    },
    link: ({children, value}: any) => {
      const target = value?.openInNewTab ? '_blank' : '_self';
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
      return (
        <Link href={value?.href || '#'} target={target} rel={rel} className="text-blue-400 underline hover:text-blue-300 transition-colors">
          {children}
        </Link>
      );
    },
  },
  block: {
    normal: ({children}: any) => (
      <p className={`text-base lg:text-lg leading-relaxed font-normal ${descriptionColor}`}>{children}</p>
    ),
    h1: ({children}: any) => (
      <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mt-8 mb-6 leading-tight tracking-tight ${headingColor}`}>{children}</h1>
    ),
    h2: ({children}: any) => (
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mt-6 mb-4 leading-tight ${headingColor}`}>{children}</h2>
    ),
    h3: ({children}: any) => (
      <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mt-4 mb-3 leading-snug ${headingColor}`}>{children}</h3>
    ),
    h4: ({children}: any) => (
      <h4 className={`text-xl sm:text-2xl lg:text-3xl font-semibold mt-3 mb-2 ${headingColor}`}>{children}</h4>
    ),
    blockquote: ({children}: any) => (
      <blockquote className={`border-l-4 border-amber-500 pl-4 italic my-4 text-lg ${descriptionColor}`}>{children}</blockquote>
    ),
  },
});

export default function RichTextRenderer({ 
  content, 
  className = '',
  textColor = 'text-gray-900',
  headingColor,
  descriptionColor,
}: RichTextRendererProps) {
  if (!content) return null;

  const actualContent = content?.text || content;
  const isCustomRichText = Array.isArray(actualContent) && actualContent.length === 1 && actualContent[0]?._type === 'customRichText';
  const finalContent = isCustomRichText ? actualContent[0]?.text || actualContent : actualContent;

  const hColor = headingColor || textColor;
  const dColor = descriptionColor || (textColor === 'text-white' ? 'text-gray-300' : 'text-gray-700');
  
  const components = createComponents(hColor, dColor);
  
  return (
    <div className={`font-aileron ${className}`}>
      <PortableText value={finalContent} components={components} />
    </div>
  );
}

