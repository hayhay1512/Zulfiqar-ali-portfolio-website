import { useState } from 'react';
import type { Profile } from '../types';
import { User, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  profile: Profile;
  onContactClick?: () => void;
}

export function AboutSection({ profile, onContactClick }: AboutSectionProps) {
  const [imageError, setImageError] = useState(false);

  const handleContact = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      const contactEl = document.getElementById('contact');
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
      } else if (profile.email) {
        window.location.href = `mailto:${profile.email}`;
      }
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 relative overflow-hidden border-b border-teal-600/15 dark:border-teal-500/15">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Framed Portrait with Concentric Ring Motif (Matches Reference Section 2) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Concentric spiral / radar vector graphic background */}
            <div className="absolute -left-10 -bottom-10 w-72 h-72 pointer-events-none opacity-40 dark:opacity-60 -z-10">
              <svg viewBox="0 0 200 200" className="w-full h-full text-teal-600/40" fill="none" stroke="currentColor">
                {[20, 35, 50, 65, 80, 95].map((r, i) => (
                  <circle
                    key={i}
                    cx="100"
                    cy="100"
                    r={r}
                    strokeWidth="1.2"
                    strokeDasharray={i % 2 === 0 ? '4 4' : 'none'}
                    className="opacity-60"
                  />
                ))}
              </svg>
            </div>

            {/* Framed Card */}
            <div className="relative w-full max-w-[340px] aspect-4/5 rounded-3xl overflow-hidden p-2.5 bg-gradient-to-b from-teal-500/20 via-slate-800/10 to-transparent border border-teal-600/30 dark:border-teal-500/30 shadow-2xl backdrop-blur-xs group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-[#0d332f] relative">
                {profile.avatar_url && !imageError ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Zulfiqar Ali'}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#12423c] to-[#072421] text-teal-200">
                    <User className="w-20 h-20 mb-3 stroke-[1.2]" />
                    <span className="text-sm font-mono text-teal-100">Zulfiqar Ali</span>
                  </div>
                )}

                {/* Subtle dark gradient overlay at base */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#051c19] via-transparent to-transparent opacity-60" />
                
                {/* Floating pill tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#072824]/90 backdrop-blur-md border border-teal-500/30 text-xs flex items-center justify-between">
                  <span className="font-semibold text-white tracking-wide">{profile.full_name || 'Zulfiqar Ali'}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-teal-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Counters & Call-to-action */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top row with Category Tag & Geometric Spiral Accent */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/30">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                About Us & Expertise
              </span>

              {/* Geometric circular accent matching template badge */}
              <div className="w-12 h-12 rounded-full border border-teal-600/30 dark:border-teal-400/30 flex items-center justify-center p-1 opacity-75">
                <div className="w-8 h-8 rounded-full border border-dashed border-teal-500/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-teal-500" />
                </div>
              </div>
            </div>

            {/* Section Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#082926] dark:text-white leading-[1.15]">
              I AM AVAILABLE FOR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-400 dark:from-teal-400 dark:to-emerald-300">
                WEB & FULL-STACK
              </span>{' '}
              PROJECTS
            </h2>

            {/* Description Paragraph */}
            <p className="text-base sm:text-lg text-[#1e5852] dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              {profile.bio ||
                'I specialize in transforming intricate product visions into clean, high-performance web systems and intuitive user interfaces. With extensive experience spanning front-end architecture, scalable backends, database schema engineering, and real-time cloud integrations.'}
            </p>

            {/* Metric Counter Row (Matching reference's 3 counter boxes) */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#072623]/90 border border-teal-600/15 dark:border-teal-500/25 text-center shadow-xs">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#082926] dark:text-teal-300 font-heading">
                  250<span className="text-teal-500">+</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-200 mt-1">
                  Completed Projects
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#072623]/90 border border-teal-600/15 dark:border-teal-500/25 text-center shadow-xs">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#082926] dark:text-teal-300 font-heading">
                  5<span className="text-teal-500">+</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-200 mt-1">
                  Years Experience
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#072623]/90 border border-teal-600/15 dark:border-teal-500/25 text-center shadow-xs">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#082926] dark:text-teal-300 font-heading">
                  99<span className="text-teal-500">%</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-teal-800 dark:text-teal-200 mt-1">
                  Client Satisfaction
                </div>
              </div>
            </div>

            {/* Action CTA Row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleContact}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#35a89e] hover:bg-[#2c9289] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-teal-900/15 hover:shadow-teal-900/25 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span>GET IN TOUCH</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-teal-800 dark:text-teal-200 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Open for freelance, contract & full-time</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
