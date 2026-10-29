import { useEffect } from 'react';
import type { MediaItem } from '../types';
import { X, ExternalLink, Download } from 'lucide-react';

interface LightboxModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export function LightboxModal({ item, onClose }: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isPdf = item.media_url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-stone-800 bg-stone-950/50">
          <div className="pr-4">
            <span className="text-xs uppercase font-mono text-amber-400">
              {item.type}
            </span>
            <h3 className="text-base font-bold text-white truncate max-w-md">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {item.link_url && (
              <a
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                title="Open external link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={onClose}
              type="button"
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[300px]">
          {isPdf ? (
            <iframe
              src={item.media_url}
              title={item.title}
              className="w-full h-[65vh] rounded-lg border border-stone-850"
            />
          ) : (
            <img
              src={item.media_url}
              alt={item.title}
              className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-md"
            />
          )}
        </div>

        {/* Caption bar */}
        {item.caption && (
          <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 text-xs text-stone-300">
            {item.caption}
          </div>
        )}
      </div>
    </div>
  );
}
