// src/components/VideoWithText.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, Pause } from 'lucide-react';
import RichTextRenderer from './RichTextRenderer';
function getImageUrl(image: any, width: number = 800, height?: number): string {
  if (!image?.asset?._ref) return '';
  const ref = image.asset._ref;
  const parts = ref.split('-');
  const id = parts[1];
  const fmt = parts[3] || 'jpg';
  const h = height || Math.round(width * 0.75);
  return `https://cdn.sanity.io/images/d2zeiu5j/production/${id}-${width}x${h}.${fmt}`;
}-${width}x${h}.${fmt}`;
}


interface VideoWithTextProps {
  title?: string;
  layout?: 'textLeft' | 'videoLeft';
  titleRichText: any;
  descriptionRichText?: any;
  videoUrl: string;
  videoType?: 'youtube' | 'vimeo' | 'direct';
  videoThumbnail?: any;
  backgroundColor?: string;
}

export default function VideoWithText({
  title,
  layout = 'textLeft',
  titleRichText,
  descriptionRichText,
  videoUrl,
  videoType = 'youtube',
  videoThumbnail,
  backgroundColor = '#ffffff',
}: VideoWithTextProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^"&?\/s]{11})/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}?` : url;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.match(/vimeo\.com\/(\d+)/);
    return videoId ? `https://player.vimeo.com/video/${videoId[1]}?` : url;
  };

  const textColor = backgroundColor === '#111827' ? 'text-white' : 'text-gray-900';
  const descriptionColor = backgroundColor === '#111827' ? 'text-gray-300' : 'text-gray-600';

  const textContent = (
    <div className="space-y-6">
      {/* Title with Rich Text */}
      <div className={textColor}>
        <RichTextRenderer content={titleRichText} />
      </div>

      {/* Description with Rich Text */}
      {descriptionRichText && (
        <div className={descriptionColor}>
          <RichTextRenderer content={descriptionRichText} />
        </div>
      )}
    </div>
  );

  const videoContent = (
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
      {videoType === 'youtube' || videoType === 'vimeo' ? (
        <iframe
          src={
            videoType === 'youtube'
              ? getYouTubeEmbedUrl(videoUrl)
              : getVimeoEmbedUrl(videoUrl)
          }
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {isPlaying ? (
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
            />
          ) : (
            <>
              {videoThumbnail ? (
                <Image
                  src={getImageUrl(videoThumbnail, 800, 450)}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <span className="text-gray-500">No thumbnail</span>
                </div>
              )}
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-all"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900 ml-1" />
                </div>
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  return (
    <section style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {title && (
          <h2 className={`text-3xl font-bold text-center mb-12 ${textColor}`}>
            {title}
          </h2>
        )}

        <div className={`grid lg:grid-cols-2 gap-17 lg:gap-16 items-center`}>
          {layout === 'textLeft' ? (
            <>
              <div>{textContent}</div>
              <div>{videoContent}</div>
            </>
          ) : (
            <>
              <div>{videoContent}</div>
              <div>{textContent}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

