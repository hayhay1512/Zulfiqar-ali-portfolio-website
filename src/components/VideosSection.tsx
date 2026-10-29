import type { MediaItem } from '../types';
import { Play } from 'lucide-react';

interface VideosSectionProps {
  videos: MediaItem[];
}

function getEmbedUrl(rawUrl: string): { type: 'youtube' | 'vimeo' | 'loom' | 'direct'; url: string } {
  if (!rawUrl) return { type: 'direct', url: '' };

  // YouTube match
  const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube', url: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }

  // Vimeo match
  const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return { type: 'vimeo', url: `https://player.vimeo.com/video/${vimeoMatch[3]}` };
  }

  // Loom match
  const loomMatch = rawUrl.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return { type: 'loom', url: `https://www.loom.com/embed/${loomMatch[1]}` };
  }

  return { type: 'direct', url: rawUrl };
}

export function VideosSection({ videos }: VideosSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section id="videos" className="py-20 md:py-28 relative border-b border-teal-600/15 dark:border-teal-500/15 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-700 dark:text-teal-300 font-semibold">
              Motion & Demos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#082926] dark:text-white mt-1 font-heading">
              Videos & Demonstrations
            </h2>
          </div>
          <p className="text-xs text-teal-700/70 dark:text-teal-400/70 font-mono">
            Recorded walkthroughs, talks, & interface demos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.map((video) => {
            const embed = getEmbedUrl(video.media_url);

            return (
              <div
                key={video.id}
                className="rounded-2xl border border-teal-600/20 dark:border-teal-500/20 bg-white dark:bg-[#072623] overflow-hidden shadow-xl hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300"
              >
                {/* Video Player Frame */}
                <div className="relative aspect-16/9 bg-black overflow-hidden">
                  {embed.type === 'direct' ? (
                    <video
                      controls
                      src={embed.url}
                      className="w-full h-full object-contain"
                      poster=""
                    >
                      Your browser does not support HTML5 video.
                    </video>
                  ) : (
                    <iframe
                      src={embed.url}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )}
                </div>

                {/* Video Details */}
                <div className="p-6 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Embedded Player</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    {video.title}
                  </h3>
                  {video.caption && (
                    <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      {video.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
