import { useState } from 'react';
import type { MediaItem } from '../types';
import { Award, ExternalLink, Eye, FileText } from 'lucide-react';

interface CertificatesSectionProps {
  certificates: MediaItem[];
  onPreview: (item: MediaItem) => void;
}

export function CertificatesSection({ certificates, onPreview }: CertificatesSectionProps) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-20 md:py-28 relative border-b border-teal-600/15 dark:border-teal-500/15 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-700 dark:text-teal-300 font-semibold">
              Credentials & Accreditations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#082926] dark:text-white mt-1 font-heading">
              Certificates
            </h2>
          </div>
          <p className="text-xs text-teal-700/70 dark:text-teal-400/70 font-mono">
            Professional accreditations & course completions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const isPdf = cert.media_url?.toLowerCase().endsWith('.pdf');

            return (
              <div
                key={cert.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-teal-600/20 dark:border-teal-500/20 bg-white dark:bg-[#072623] hover:border-teal-500 dark:hover:border-teal-400 transition-all duration-300 shadow-xl"
              >
                {/* Visual Preview / Thumbnail */}
                <div
                  onClick={() => onPreview(cert)}
                  className="relative aspect-4/3 bg-stone-100 dark:bg-stone-800 overflow-hidden cursor-pointer"
                >
                  {isPdf ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800/80">
                      <FileText className="w-12 h-12 mb-2 stroke-[1.5]" />
                      <span className="text-xs font-mono uppercase">PDF Document</span>
                    </div>
                  ) : (
                    <img
                      src={cert.media_url}
                      alt={cert.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-medium text-xs">
                    <Eye className="w-4 h-4" />
                    <span>Click to inspect</span>
                  </div>
                </div>

                {/* Info & Links */}
                <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Accredited</span>
                    </div>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base leading-snug">
                      {cert.title}
                    </h3>
                    {cert.caption && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                        {cert.caption}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onPreview(cert)}
                      type="button"
                      className="font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View preview</span>
                    </button>

                    {cert.link_url && (
                      <a
                        href={cert.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        <span>Issuer link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
