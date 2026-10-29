import { useState } from 'react';
import type { Profile } from '../types';
import {
  User,
  ArrowRight,
  Mail,
  Github,
  Linkedin,
  MessageCircle,
} from 'lucide-react';

interface HeroProps {
  profile: Profile;
  onContactClick?: () => void;
}

// Clean custom SVG icons for social channels
function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Hero({ profile, onContactClick }: HeroProps) {
  const [imageError, setImageError] = useState(false);

  // Normalize WhatsApp
  const getWhatsAppUrl = (val?: string) => {
    if (!val) return '';
    const trimmed = val.trim();
    if (trimmed.startsWith('http')) return trimmed;
    const cleanDigits = trimmed.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanDigits}`;
  };

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

  const handleLearnMore = () => {
    const aboutEl = document.getElementById('about');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Outer ambient teal glow */}
      <div className="absolute top-1/4 right-1/4 w-[480px] h-[480px] bg-teal-500/15 dark:bg-teal-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Main Hero Card Container matching the uploaded template */}
        <div className="relative rounded-3xl md:rounded-[36px] p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-[#c8e6df]/90 via-[#dcf0eb]/80 to-[#e9f7f4]/95 dark:from-[#062421] dark:via-[#082f2b] dark:to-[#041917] border border-teal-600/20 dark:border-teal-500/20 shadow-2xl overflow-hidden transition-colors">
          
          {/* Background Decorative Graphic Overlays (Matching Template Accents) */}
          {/* 1. Curved Vector Track Lines */}
          <div className="absolute -top-12 -left-12 w-96 h-96 pointer-events-none opacity-40 dark:opacity-20 -z-0">
            <svg viewBox="0 0 400 400" fill="none" className="w-full h-full text-teal-700 dark:text-teal-400">
              <path d="M -50 180 C 120 180, 180 120, 180 -50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
              <path d="M -50 220 C 150 220, 220 150, 220 -50" stroke="currentColor" strokeWidth="1.2" />
              <path d="M -50 260 C 180 260, 260 180, 260 -50" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* 2. Dotted Matrix Pattern on Right Background */}
          <div className="absolute top-8 right-6 sm:right-12 pointer-events-none opacity-25 dark:opacity-30">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-teal-900 dark:text-teal-200">
              {Array.from({ length: 6 }).map((_, r) =>
                Array.from({ length: 6 }).map((__, c) => (
                  <circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="2" fill="currentColor" />
                ))
              )}
            </svg>
          </div>

          {/* 3. Small Floating Triangular Chevrons (Matching Template) */}
          <div className="absolute top-1/2 left-[48%] -translate-y-1/2 hidden lg:flex flex-col gap-2 pointer-events-none opacity-50 text-teal-700 dark:text-teal-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <polygon points="4,2 14,8 4,14" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="opacity-60">
              <polygon points="4,2 14,8 4,14" />
            </svg>
          </div>

          {/* 4. Bottom Zigzag Accent */}
          <div className="absolute bottom-8 left-[38%] hidden md:block pointer-events-none opacity-50 text-teal-700 dark:text-teal-300">
            <svg width="60" height="14" viewBox="0 0 60 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 2 7 L 10 2 L 18 12 L 26 2 L 34 12 L 42 2 L 50 12 L 58 7" />
            </svg>
          </div>

          {/* Grid Layout: Left Hero Text + Right Circular Portrait Bezel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
            
            {/* Left Hero Column: Headline, Bio & Action Buttons (Exact template styling) */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Salutation + Bold Title (Matches "Hey! I am Web Developer") */}
              <div className="space-y-1.5">
                <p className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#164b46] dark:text-teal-300 font-heading">
                  Hey! I am
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#082926] dark:text-white leading-[1.08] font-heading">
                  {profile.title_headline || 'Web Developer'}
                </h1>
              </div>

              {/* Bio text (Exact match with template body copy) */}
              <p className="text-sm sm:text-base md:text-lg text-[#1e5852] dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                {profile.bio ||
                  'I am a Full-Stack Web Developer with extensive experience of over 4 years. My expertise is in creating & designing websites, Mobile Apps, and Desktop Applications.'}
              </p>

              {/* Buttons Row: "LEARN MORE" + "HIRE ME" (Matching uploaded template pills) */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  onClick={handleLearnMore}
                  className="px-7 py-3 rounded-full bg-[#35a89e] hover:bg-[#2c9289] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md shadow-teal-900/15 hover:shadow-teal-900/25 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  LEARN MORE
                </button>

                <button
                  type="button"
                  onClick={handleContact}
                  className="px-7 py-3 rounded-full bg-[#082825] hover:bg-[#0f3c38] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
                >
                  HIRE ME
                </button>
              </div>

              {/* Quick direct social channels for owner */}
              <div className="pt-3 flex items-center justify-center lg:justify-start gap-2.5">
                {profile.whatsapp && (
                  <a
                    href={getWhatsAppUrl(profile.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#0c2a27] border border-teal-700/20 dark:border-teal-400/30 text-teal-800 dark:text-teal-200 hover:text-teal-500 hover:scale-105 transition-all shadow-xs"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}

                {profile.facebook_url && (
                  <a
                    href={profile.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#0c2a27] border border-teal-700/20 dark:border-teal-400/30 text-teal-800 dark:text-teal-200 hover:text-teal-500 hover:scale-105 transition-all shadow-xs"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}

                {profile.instagram_url && (
                  <a
                    href={profile.instagram_url.startsWith('@') ? `https://instagram.com/${profile.instagram_url.slice(1)}` : profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#0c2a27] border border-teal-700/20 dark:border-teal-400/30 text-teal-800 dark:text-teal-200 hover:text-teal-500 hover:scale-105 transition-all shadow-xs"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}

                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#0c2a27] border border-teal-700/20 dark:border-teal-400/30 text-teal-800 dark:text-teal-200 hover:text-teal-500 hover:scale-105 transition-all shadow-xs"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}

                {profile.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#0c2a27] border border-teal-700/20 dark:border-teal-400/30 text-teal-800 dark:text-teal-200 hover:text-teal-500 hover:scale-105 transition-all shadow-xs"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}

                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#0c2a27] border border-teal-700/20 dark:border-teal-400/30 text-teal-800 dark:text-teal-200 hover:text-teal-500 hover:scale-105 transition-all shadow-xs"
                    aria-label="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>

            {/* Right Hero Column: Circular Portrait Setup with Dual-Tone Bezel & Dashed Orbit (Exact uploaded screenshot geometry) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Bottom-right zigzag decoration */}
              <div className="absolute -bottom-4 -right-4 pointer-events-none opacity-60 text-teal-800 dark:text-teal-300">
                <svg width="45" height="35" viewBox="0 0 45 35" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 5 5 L 15 15 L 5 25 L 15 35" />
                  <path d="M 22 5 L 32 15 L 22 25 L 32 35" opacity="0.6" />
                </svg>
              </div>

              {/* Master Bezel Frame Structure */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-88 md:h-88 flex items-center justify-center">
                
                {/* 1. Outer Dark Teal Bezel Crescent Ring (Signature design feature from screenshot) */}
                <div className="absolute inset-0 rounded-full border-[12px] sm:border-[16px] border-[#0a3834] dark:border-[#0f4d47] border-t-transparent dark:border-t-transparent -rotate-45 shadow-xl pointer-events-none z-10" />

                {/* 2. Concentric Dashed Ring Just Outside The Portrait */}
                <div className="absolute inset-3 sm:inset-4 rounded-full border-2 border-dashed border-teal-700/40 dark:border-teal-400/40 pointer-events-none" />

                {/* 3. Solid Teal Inner Circular Plate Hosting Avatar */}
                <div className="relative w-[78%] h-[78%] rounded-full overflow-hidden bg-[#1a766e] dark:bg-[#125852] border-4 border-white/40 dark:border-teal-300/30 shadow-2xl flex items-center justify-center">
                  {profile.avatar_url && !imageError ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'Zulfiqar Ali'}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#196b63] to-[#0c3834] text-teal-100">
                      <User className="w-20 h-20 sm:w-24 sm:h-24 stroke-[1.2]" />
                      <span className="text-xs font-mono text-teal-200 mt-2">Zulfiqar Ali</span>
                    </div>
                  )}

                  {/* Subtle lower gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#082825]/40 via-transparent to-transparent pointer-events-none" />
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
