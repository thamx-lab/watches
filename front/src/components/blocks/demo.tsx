'use client';

import { useState, useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

interface MediaAbout {
  overview: string;
  conclusion: string;
}

interface MediaContent {
  src: string;
  poster?: string;
  background: string;
  title: string;
  date: string;
  scrollToExpand: string;
  about: MediaAbout;
}

interface MediaContentCollection {
  [key: string]: MediaContent;
}

const sampleMediaContent: MediaContentCollection = {
  classic: {
    src: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1920&auto=format&fit=crop',
    title: 'Classic Heritage',
    date: 'Est. 1920',
    scrollToExpand: 'Scroll to Explore',
    about: {
      overview: 'Experience the pinnacle of horological engineering. The Classic Heritage represents a century of craftsmanship and uncompromising quality.',
      conclusion: 'Crafted for those who appreciate the finer details. Our collection merges tradition with modern elegance.',
    },
  },
  modern: {
    src: 'https://images.unsplash.com/photo-1548169874-531866cb2832?q=80&w=1280&auto=format&fit=crop',
    background: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1920&auto=format&fit=crop',
    title: 'Modern Elegance',
    date: 'New Collection',
    scrollToExpand: 'Scroll to Explore',
    about: {
      overview: 'A bold statement for the modern era. Featuring scratch-resistant sapphire crystal and an automatic movement that never misses a beat.',
      conclusion: 'Designed for the pioneers of today. Elevate your presence with a timepiece that commands attention.',
    },
  },
};

const MediaContent = ({ themeKey }: { themeKey: 'classic' | 'modern' }) => {
  const currentMedia = sampleMediaContent[themeKey];

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-3xl font-bold mb-6 text-black dark:text-white'>
        About This Timepiece
      </h2>
      <p className='text-lg mb-8 text-black dark:text-white'>
        {currentMedia.about.overview}
      </p>
      <p className='text-lg mb-8 text-black dark:text-white'>
        {currentMedia.about.conclusion}
      </p>
    </div>
  );
};

const Demo = () => {
  const [themeKey, setThemeKey] = useState<'classic' | 'modern'>('classic');
  const currentMedia = sampleMediaContent[themeKey];

  useEffect(() => {
    window.scrollTo(0, 0);
    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, [themeKey]);

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='fixed top-4 right-4 z-50 flex gap-2'>
        <button
          onClick={() => setThemeKey('classic')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            themeKey === 'classic'
              ? 'bg-white text-black font-semibold'
              : 'bg-black/50 text-white border border-white/30 hover:bg-white/10'
          }`}
        >
          Classic
        </button>
        <button
          onClick={() => setThemeKey('modern')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            themeKey === 'modern'
              ? 'bg-white text-black font-semibold'
              : 'bg-black/50 text-white border border-white/30 hover:bg-white/10'
          }`}
        >
          Modern
        </button>
      </div>

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={currentMedia.src}
        bgImageSrc={currentMedia.background}
        title={currentMedia.title}
        date={currentMedia.date}
        scrollToExpand={currentMedia.scrollToExpand}
        textBlend={false}
      >
        <MediaContent themeKey={themeKey} />
      </ScrollExpandMedia>
    </div>
  );
};

export default Demo;
