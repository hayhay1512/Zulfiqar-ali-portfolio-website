import { useEffect, useState, useCallback } from 'react';
import type { Profile, Project, Website, MediaItem } from './types';
import {
  supabase,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_WEBSITES,
  DEFAULT_MEDIA,
  OWNER_EMAIL,
} from './lib/supabase';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TechMarquee } from './components/TechMarquee';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { WebsitesSection } from './components/WebsitesSection';
import { CertificatesSection } from './components/CertificatesSection';
import { GallerySection } from './components/GallerySection';
import { VideosSection } from './components/VideosSection';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { AdminPortal } from './components/AdminPortal';

export default function App() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [websites, setWebsites] = useState<Website[]>(DEFAULT_WEBSITES);
  const [media, setMedia] = useState<MediaItem[]>(DEFAULT_MEDIA);

  const [loading, setLoading] = useState(true);
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [dbTablesInitialized, setDbTablesInitialized] = useState<boolean | null>(null);

  // Check URL route for /admin, subpath /admin, or #admin on mount
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.replace(/\/$/, '');
      const hash = window.location.hash;
      if (path === '/admin' || path.endsWith('/admin') || hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  // Fetch initial data from Supabase
  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 'owner_profile')
        .maybeSingle();

      let localSocial: any = {};
      try {
        const stored = localStorage.getItem('portfolio_social_links');
        if (stored) localSocial = JSON.parse(stored);
      } catch {}

      const localAvatar = localStorage.getItem('portfolio_avatar_url');

      if (profileData) {
        setProfile((prev) => ({
          ...prev,
          ...profileData,
          avatar_url:
            profileData.avatar_url && profileData.avatar_url.trim().length > 0
              ? profileData.avatar_url
              : (localAvatar || prev.avatar_url || DEFAULT_PROFILE.avatar_url),
          skills: Array.isArray(profileData.skills) ? profileData.skills : prev.skills,
          whatsapp: profileData.whatsapp || localSocial.whatsapp || prev.whatsapp || '',
          facebook_url: profileData.facebook_url || localSocial.facebook_url || prev.facebook_url || '',
          instagram_url: profileData.instagram_url || localSocial.instagram_url || prev.instagram_url || '',
          tiktok_url: profileData.tiktok_url || localSocial.tiktok_url || prev.tiktok_url || '',
          website_url: profileData.website_url || localSocial.website_url || prev.website_url || '',
        }));
        setDbTablesInitialized(true);
      } else {
        if (profileError) setDbTablesInitialized(false);
        setProfile((prev) => ({
          ...prev,
          avatar_url: localAvatar || prev.avatar_url || DEFAULT_PROFILE.avatar_url,
          ...localSocial,
        }));
      }

      // 2. Fetch Projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData);
      }

      // 3. Fetch Websites
      const { data: websitesData } = await supabase
        .from('websites')
        .select('*')
        .order('order_index', { ascending: true });

      if (websitesData && websitesData.length > 0) {
        setWebsites(websitesData);
      }

      // 4. Fetch Media
      const { data: mediaData } = await supabase
        .from('media')
        .select('*')
        .order('order_index', { ascending: true });

      if (mediaData && mediaData.length > 0) {
        setMedia(mediaData);
      }
    } catch (err) {
      console.warn('Using seeded portfolio data while Supabase connection stabilizes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Authentication State Listener
  useEffect(() => {
    fetchData();

    // Check existing auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email?.toLowerCase() === OWNER_EMAIL) {
        setIsOwnerLoggedIn(true);
      } else {
        setIsOwnerLoggedIn(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email?.toLowerCase() === OWNER_EMAIL) {
        setIsOwnerLoggedIn(true);
      } else {
        setIsOwnerLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchData]);

  // Derived filtered media arrays for dynamic sections
  const certificates = media.filter((m) => m.type === 'certificate');
  const galleryImages = media.filter((m) => m.type === 'image');
  const videos = media.filter((m) => m.type === 'video');

  const activeSections = {
    skills: Boolean(profile.skills && profile.skills.length > 0),
    projects: Boolean(projects && projects.length > 0),
    websites: Boolean(websites && websites.length > 0),
    certificates: Boolean(certificates && certificates.length > 0),
    gallery: Boolean(galleryImages && galleryImages.length > 0),
    videos: Boolean(videos && videos.length > 0),
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    const path = window.location.pathname.replace(/\/$/, '');
    if (path === '/admin' || path.endsWith('/admin') || window.location.hash === '#admin') {
      const basePath = path.endsWith('/admin') ? path.slice(0, -6) || '/' : './';
      history.replaceState(null, '', window.location.hash === '#admin' ? ' ' : basePath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f2faf7] dark:bg-[#041615] text-[#0d332f] dark:text-slate-100 selection:bg-teal-500/20 selection:text-teal-900 dark:selection:text-teal-200">
      {/* Strict 3-zone Top Bar Contract with reference styling */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isOwnerLoggedIn={isOwnerLoggedIn}
        activeSections={activeSections}
      />

      {/* Main Content Layout matching reference flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero profile={profile} />

        {/* Tech Marquee Ribbon Bar (Matching Reference Bar) */}
        <TechMarquee />

        {/* About & Availability Section (Matching Reference Section 2) */}
        <AboutSection profile={profile} />

        {/* Recent Projects Section (Matching Reference Cards) */}
        {activeSections.projects && <ProjectsSection projects={projects} />}

        {/* Services & Skills Section */}
        {activeSections.skills && <SkillsSection skills={profile.skills} />}

        {/* Websites Section */}
        {activeSections.websites && <WebsitesSection websites={websites} />}

        {/* Certificates Section */}
        {activeSections.certificates && (
          <CertificatesSection
            certificates={certificates}
            onPreview={(item) => setLightboxItem(item)}
          />
        )}

        {/* Images / Gallery Section */}
        {activeSections.gallery && (
          <GallerySection
            images={galleryImages}
            onOpenLightbox={(item) => setLightboxItem(item)}
          />
        )}

        {/* Videos Section */}
        {activeSections.videos && <VideosSection videos={videos} />}
      </main>

      {/* Footer with Developed by Zulfiqar Ali */}
      <Footer
        profile={profile}
        onOpenAdmin={handleOpenAdmin}
        isOwnerLoggedIn={isOwnerLoggedIn}
      />

      {/* Fullscreen Lightbox for Images & Certificates */}
      <LightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />

      {/* Owner Admin Portal (Protected by Supabase Auth and restricted to owner email) */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        profile={profile}
        projects={projects}
        websites={websites}
        media={media}
        isOwnerLoggedIn={isOwnerLoggedIn}
        onRefreshData={fetchData}
      />
    </div>
  );
}
