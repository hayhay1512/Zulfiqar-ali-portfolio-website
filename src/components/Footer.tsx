import type { Profile } from '../types';
import {
  Shield,
  ArrowUp,
  Mail,
  Globe,
  Github,
  Linkedin,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface FooterProps {
  profile: Profile;
  onOpenAdmin: () => void;
  isOwnerLoggedIn: boolean;
}

// Clean custom SVG icons for consistency
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

function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function Footer({ profile, onOpenAdmin, isOwnerLoggedIn }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Normalize external URLs
  const normalizeUrl = (url?: string, defaultPrefix = 'https://') => {
    if (!url) return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
      return trimmed;
    }
    return `${defaultPrefix}${trimmed}`;
  };

  // Format WhatsApp URL to work with phone numbers or links
  const getWhatsAppUrl = (val?: string) => {
    if (!val) return '';
    const trimmed = val.trim();
    if (trimmed.startsWith('http')) return trimmed;
    const cleanDigits = trimmed.replace(/[^\d]/g, '');
    return `https://wa.me/${cleanDigits}`;
  };

  const socialLinks = [
    profile.email ? {
      name: 'Email',
      href: `mailto:${profile.email}`,
      icon: Mail,
      label: profile.email,
    } : null,
    profile.whatsapp ? {
      name: 'WhatsApp',
      href: getWhatsAppUrl(profile.whatsapp),
      icon: MessageCircle,
      label: 'WhatsApp',
    } : null,
    profile.facebook_url ? {
      name: 'Facebook',
      href: normalizeUrl(profile.facebook_url, 'https://'),
      customIcon: FacebookIcon,
      label: 'Facebook',
    } : null,
    profile.instagram_url ? {
      name: 'Instagram',
      href: profile.instagram_url.startsWith('@')
        ? `https://instagram.com/${profile.instagram_url.slice(1)}`
        : normalizeUrl(profile.instagram_url, 'https://'),
      customIcon: InstagramIcon,
      label: 'Instagram',
    } : null,
    profile.tiktok_url ? {
      name: 'TikTok',
      href: profile.tiktok_url.startsWith('@')
        ? `https://tiktok.com/${profile.tiktok_url}`
        : normalizeUrl(profile.tiktok_url, 'https://'),
      customIcon: TikTokIcon,
      label: 'TikTok',
    } : null,
    profile.website_url ? {
      name: 'Website',
      href: normalizeUrl(profile.website_url, 'https://'),
      icon: Globe,
      label: 'Website',
    } : null,
    profile.github_url ? {
      name: 'GitHub',
      href: normalizeUrl(profile.github_url, 'https://'),
      icon: Github,
      label: 'GitHub',
    } : null,
    profile.linkedin_url ? {
      name: 'LinkedIn',
      href: normalizeUrl(profile.linkedin_url, 'https://'),
      icon: Linkedin,
      label: 'LinkedIn',
    } : null,
  ].filter(Boolean) as {
    name: string;
    href: string;
    icon?: any;
    customIcon?: any;
    label: string;
  }[];

  return (
    <footer id="contact" className="border-t border-teal-600/15 dark:border-teal-500/15 pt-16 pb-16 bg-[#edf7f5] dark:bg-[#031513] text-[#1b554f] dark:text-teal-200 text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        
        {/* Contact Strip Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-teal-600/20 dark:border-teal-500/20 bg-white/90 dark:bg-[#072623]/80 backdrop-blur-md shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-teal-700 dark:text-teal-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Direct Channels & Social Connections
              </span>
              <p className="text-xs text-[#22635c] dark:text-teal-300/80">
                Official touchpoints for {profile.full_name || 'Zulfiqar Ali'} — Reach out directly anytime.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-medium text-emerald-700 dark:text-emerald-400">
                Accepting New Inquiries
              </span>
            </div>
          </div>

          {/* Social Channels Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((item) => {
              const IconComponent = item.icon;
              const CustomIconComponent = item.customIcon;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-600/20 dark:border-teal-500/30 bg-white dark:bg-[#09322e] text-[#0d3632] dark:text-teal-100 hover:text-teal-600 dark:hover:text-teal-300 hover:border-teal-500 dark:hover:border-teal-400 transition-all shadow-2xs hover:shadow-teal-900/10 group cursor-pointer"
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />}
                  {CustomIconComponent && <CustomIconComponent className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />}
                  <span className="font-semibold text-xs">{item.label}</span>
                  <ExternalLink className="w-3 h-3 text-teal-700/60 dark:text-teal-400/60 group-hover:text-teal-600 dark:group-hover:text-teal-300" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom Line Bar with Explicit Required Developed by Zulfiqar Ali */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-teal-600/15 dark:border-teal-500/15">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-bold text-[#082926] dark:text-white uppercase font-heading tracking-wide">
              {profile.full_name || 'Zulfiqar Ali'} Portfolio
            </span>
            <span className="hidden sm:inline text-teal-700/40 dark:text-teal-400/40" aria-hidden="true">·</span>
            <span className="font-bold text-teal-700 dark:text-teal-300">
              Developed by Zulfiqar Ali
            </span>
            <span className="hidden sm:inline text-teal-700/40 dark:text-teal-400/40" aria-hidden="true">·</span>
            <span className="font-mono text-teal-700/60 dark:text-teal-400/60">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={onOpenAdmin}
              type="button"
              className="inline-flex items-center gap-1.5 text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-200 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isOwnerLoggedIn ? 'Admin Panel' : 'Owner Area'}</span>
            </button>

            <span className="text-teal-700/40 dark:text-teal-400/40" aria-hidden="true">·</span>

            <button
              onClick={scrollToTop}
              type="button"
              className="inline-flex items-center gap-1.5 text-teal-800 dark:text-teal-300 hover:text-teal-600 dark:hover:text-teal-200 transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
