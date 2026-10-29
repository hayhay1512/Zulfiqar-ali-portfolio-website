import type { MediaItem } from '../types';
import { Eye, Image as ImageIcon } from 'lucide-react';

interface GallerySectionProps {
  images: MediaItem[];
  onOpenLightbox: (item: MediaItem) => void;
}

export function GallerySection({ images, onOpenLightbox }: GallerySectionProps) {
  if (!images || images.length === 0) return null;

  return (
    <section id="gallery" className="py-20 md:py-28 relative border-b border-teal-600/15 dark:border-teal-500/15 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-700 dark:text-teal-300 font-semibold">
              Visual Archives
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#082926] dark:text-white mt-1 font-heading">
              Images & Visual Craft
            </h2>
          </div>
          <p className="text-xs text-teal-700/70 dark:text-teal-400/70 font-mono">
            Architectural mockups, hardware setups & photography
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item, index) => (
            <div
              key={item.id || index}
              onClick={() => onOpenLightbox(item)}
              className="group relative rounded-2xl overflow-hidden border border-teal-600/20 dark:border-teal-500/20 bg-white dark:bg-[#072623] cursor-pointer shadow-xl hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={item.media_url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Scrim overlay with typography */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                <div className="flex items-center justify-between text-white">
                  <div className="space-y-1 pr-4">
                    <h3 className="font-bold text-sm tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs text-stone-300 line-clamp-1">
                        {item.caption}
                      </p>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
