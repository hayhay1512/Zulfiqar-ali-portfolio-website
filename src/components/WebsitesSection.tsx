import type { Website } from '../types';
import { Globe, ArrowUpRight, Sparkles } from 'lucide-react';

interface WebsitesSectionProps {
  websites: Website[];
}

export function WebsitesSection({ websites }: WebsitesSectionProps) {
  if (!websites || websites.length === 0) return null;

  return (
    <section id="websites" className="py-20 md:py-28 relative border-b border-teal-600/15 dark:border-teal-500/15 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>DEPLOYMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#082926] dark:text-white font-heading">
            FEATURED WEBSITES
          </h2>
          <p className="text-sm sm:text-base text-[#1e5852] dark:text-slate-300 max-w-xl font-normal">
            Live web portals, client platforms, and high-performance digital publications.
          </p>
        </div>

        {/* Website List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {websites.map((site) => (
            <div
              key={site.id}
              className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#072623] border border-teal-600/20 dark:border-teal-500/20 shadow-xl hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-[#0c3934] border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-300">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-teal-800 dark:text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                    LIVE WEB
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#082926] dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {site.title}
                </h3>

                <p className="text-sm text-[#1e5852] dark:text-slate-300 leading-relaxed">
                  {site.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-teal-600/10 dark:border-teal-900/60 flex items-center justify-between">
                <span className="text-xs font-mono text-teal-700/70 dark:text-teal-400/70 truncate max-w-[220px]">
                  {site.url.replace(/^https?:\/\//, '')}
                </span>

                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#35a89e] hover:bg-[#2c9289] text-white shadow-md shadow-teal-900/15 group-hover:scale-105 transition-all"
                >
                  <span>Visit site</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
