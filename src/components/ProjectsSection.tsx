import { useState } from 'react';
import type { Project } from '../types';
import { ExternalLink, ArrowRight, Sparkles, Globe, Laptop, Layers } from 'lucide-react';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects || projects.length === 0) return null;

  const [activePage, setActivePage] = useState(0);

  // Category tags to give rich context if not specified in project
  const getProjectCategory = (index: number) => {
    const categories = [
      'Website Design & Full-Stack',
      'Web Application & SaaS',
      'Cloud Platform & API System',
      'Interactive UI/UX & Portal',
      'Enterprise Dashboard',
    ];
    return categories[index % categories.length];
  };

  return (
    <section id="projects" className="py-20 md:py-28 relative border-b border-teal-600/15 dark:border-teal-500/15 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-teal-600/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header (Matching Reference: "MY WORK" pill + "RECENT PROJECTS") */}
        <div className="space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>MY WORK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#082926] dark:text-white font-heading">
            RECENT PROJECTS
          </h2>
          <p className="text-sm sm:text-base text-[#1e5852] dark:text-slate-300 max-w-xl font-normal">
            Selected engineering builds, web applications, and digital platforms crafted with high precision.
          </p>
        </div>

        {/* Project Cards Grid (Matches Reference Layout with Preview Mockup & Round Arrow Button) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const hasUrl = Boolean(project.url && project.url.trim().length > 0);
            const category = getProjectCategory(index);

            return (
              <article
                key={project.id || index}
                className="group relative flex flex-col justify-between rounded-2xl overflow-hidden bg-white dark:bg-[#072623] border border-teal-600/20 dark:border-teal-500/20 shadow-xl hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top Mockup Preview Frame (Browser bar styling matching reference) */}
                <div className="relative aspect-16/10 bg-gradient-to-br from-[#d4ece6]/60 to-[#edf7f5]/80 dark:from-[#09322e] dark:to-[#051c19] border-b border-teal-600/15 dark:border-teal-900/60 p-4 flex flex-col justify-between overflow-hidden">
                  
                  {/* Browser mockup header dots */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-[10px] font-mono text-teal-700/70 dark:text-teal-400/70 uppercase">
                      {(index + 1).toString().padStart(2, '0')} // BUILD
                    </span>
                  </div>

                  {/* Visual mockup graphics inside card preview */}
                  <div className="my-auto py-2 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-white/90 dark:bg-[#061e1b] border border-teal-600/20 dark:border-teal-500/30 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {index % 3 === 0 ? (
                        <Laptop className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      ) : index % 3 === 1 ? (
                        <Globe className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#0d3632] dark:text-slate-200 font-mono tracking-tight line-clamp-1 px-4">
                      {project.name}
                    </div>
                  </div>

                  {/* Gradient highlight on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    {/* Category Label */}
                    <div className="text-xs font-mono font-medium text-teal-700 dark:text-teal-300 uppercase tracking-wide">
                      {category}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold tracking-tight text-[#082926] dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#1e5852] dark:text-slate-300 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom Action Row: External Link / Circular Blue Arrow Button (Matches Reference) */}
                  <div className="pt-4 mt-2 border-t border-teal-600/10 dark:border-teal-900/60 flex items-center justify-between">
                    {hasUrl ? (
                      <a
                        href={project.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#164a44] dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 inline-flex items-center gap-1.5 transition-colors"
                      >
                        <span>Explore Project</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-teal-700/60 dark:text-teal-400/60 font-mono">
                        Proprietary Core
                      </span>
                    )}

                    {/* Distinctive Round Teal Arrow Button */}
                    {hasUrl ? (
                      <a
                        href={project.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-[#35a89e] hover:bg-[#2c9289] text-white flex items-center justify-center shadow-md shadow-teal-900/20 group-hover:scale-110 transition-transform active:scale-95"
                        aria-label={`Open ${project.name}`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#e0f1ed] dark:bg-[#0a312d] text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Reference Pagination Indicator Dots */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-6 h-2 rounded-full bg-[#35a89e]" />
          <div className="w-2 h-2 rounded-full bg-teal-200 dark:bg-teal-900/60" />
          <div className="w-2 h-2 rounded-full bg-teal-200 dark:bg-teal-900/60" />
        </div>

      </div>
    </section>
  );
}
