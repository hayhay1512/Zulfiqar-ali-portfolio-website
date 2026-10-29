import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isOwnerLoggedIn: boolean;
  activeSections: {
    skills: boolean;
    projects: boolean;
    websites: boolean;
    certificates: boolean;
    gallery: boolean;
    videos: boolean;
  };
}

export function Navbar({
  onOpenAdmin,
  isOwnerLoggedIn,
  activeSections,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'HOME', href: '#' },
    { label: 'ABOUT US', href: '#about' },
    activeSections.skills ? { label: 'SERVICES', href: '#skills' } : null,
    activeSections.skills ? { label: 'SKILL', href: '#skills-tags' } : null,
    activeSections.projects ? { label: 'WORK', href: '#projects' } : null,
    activeSections.websites ? { label: 'WEBSITES', href: '#websites' } : null,
    activeSections.certificates ? { label: 'CREDENTIALS', href: '#certificates' } : null,
    activeSections.gallery ? { label: 'GALLERY', href: '#gallery' } : null,
    { label: 'CONTACT', href: '#contact' },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f2faf7]/90 dark:bg-[#051d1a]/90 backdrop-blur-md border-b border-teal-600/15 dark:border-teal-500/15 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Logo Wordmark with Teal Badge (Matches NGAPro style from screenshot) */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a3a35] via-[#167067] to-[#32b2a6] flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform">
            Z
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-extrabold tracking-wider text-[#082926] dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase font-heading leading-tight">
              ZULFIQAR ALI
            </span>
            <span className="text-[10px] font-mono tracking-widest text-teal-700 dark:text-teal-400 font-semibold uppercase leading-none">
              PORTFOLIO
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (Matching Home, About Us, Services, Skill, Work, Testimonial/Contact) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-wider text-[#164b46] dark:text-teal-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors whitespace-nowrap uppercase py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-teal-500 hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions - Theme Toggle & Admin Access */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          <button
            onClick={onOpenAdmin}
            type="button"
            title="Admin & Content Manager"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isOwnerLoggedIn
                ? 'bg-teal-700 hover:bg-teal-600 text-white shadow-xs'
                : 'bg-white/80 dark:bg-[#0a2f2b] text-[#0f443e] dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-600/20 dark:border-teal-500/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden md:inline">{isOwnerLoggedIn ? 'Owner Active' : 'Admin'}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="lg:hidden p-2 text-[#164b46] dark:text-teal-200 hover:text-teal-600 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-teal-600/15 dark:border-teal-500/20 bg-[#f2faf7]/95 dark:bg-[#051d1a]/95 backdrop-blur-xl px-6 py-5 space-y-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold tracking-wider text-[#164b46] dark:text-teal-200 hover:text-teal-600 dark:hover:text-teal-400 py-2 uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-teal-600/15 dark:border-teal-900/60 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              type="button"
              className="w-full py-2.5 rounded-full text-center text-xs font-bold tracking-wider uppercase bg-white dark:bg-[#09322e] text-[#164b46] dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-teal-600/20"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{isOwnerLoggedIn ? 'Owner Active' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
