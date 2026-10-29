import { useState, useEffect } from 'react';
import type { Profile, Project, Website, MediaItem, MediaType } from '../types';
import { supabase, OWNER_EMAIL, uploadAsset, fileToOptimizedDataUrl } from '../lib/supabase';
import { ConfirmModal } from './ConfirmModal';
import {
  X,
  Shield,
  User,
  FolderGit2,
  Globe,
  Film,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Link2,
  Database,
  Eye,
} from 'lucide-react';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  projects: Project[];
  websites: Website[];
  media: MediaItem[];
  isOwnerLoggedIn: boolean;
  onRefreshData: () => Promise<void>;
}

export function AdminPortal({
  isOpen,
  onClose,
  profile,
  projects,
  websites,
  media,
  isOwnerLoggedIn,
  onRefreshData,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'websites' | 'media'>('profile');

  // Auth form state
  const [emailInput, setEmailInput] = useState(OWNER_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Status notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState<Profile>(profile);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync profileForm when profile updates from database
  useEffect(() => {
    setProfileForm(profile);
  }, [profile]);

  // Project modal / form state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectForm, setProjectForm] = useState<{ name: string; description: string; url: string }>({
    name: '',
    description: '',
    url: '',
  });

  // Website modal / form state
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null);
  const [isWebsiteFormOpen, setIsWebsiteFormOpen] = useState(false);
  const [websiteForm, setWebsiteForm] = useState<{ title: string; description: string; url: string }>({
    title: '',
    description: '',
    url: '',
  });

  // Media modal / form state
  const [isMediaFormOpen, setIsMediaFormOpen] = useState(false);
  const [mediaForm, setMediaForm] = useState<{
    title: string;
    type: MediaType;
    media_url: string;
    link_url: string;
    caption: string;
  }>({
    title: '',
    type: 'certificate',
    media_url: '',
    link_url: '',
    caption: '',
  });
  const [mediaUploading, setMediaUploading] = useState(false);

  // Confirmation modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'project' | 'website' | 'media';
    id: string;
    title: string;
  }>({
    isOpen: false,
    type: 'project',
    id: '',
    title: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg(null);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg(null);
    setTimeout(() => setErrorMsg(null), 6000);
  };

  // -------------------------------------------------------------
  // Owner Authentication
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      const cleanEmail = emailInput.trim().toLowerCase();
      if (cleanEmail !== OWNER_EMAIL) {
        throw new Error(`Unauthorized. This portfolio is single-owner only. Only ${OWNER_EMAIL} may log in.`);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: passwordInput,
      });

      if (error) {
        throw error;
      }

      if (data.user?.email?.toLowerCase() !== OWNER_EMAIL) {
        await supabase.auth.signOut();
        throw new Error(`Unauthorized account: Only ${OWNER_EMAIL} can access.`);
      }

      showSuccess('Authenticated successfully as owner.');
      await onRefreshData();
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify your credentials or check SQL setup.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      showSuccess('Signed out of owner portal.');
      await onRefreshData();
    } catch (err: any) {
      showError(err.message || 'Error signing out');
    }
  };

  // -------------------------------------------------------------
  // Profile Management
  // -------------------------------------------------------------
  const persistAvatar = async (avatarUrlToSave: string) => {
    localStorage.setItem('portfolio_avatar_url', avatarUrlToSave);
    setProfileForm((prev) => ({ ...prev, avatar_url: avatarUrlToSave }));

    // 1. Attempt full upsert
    let { error: saveError } = await supabase.from('profile').upsert({
      id: 'owner_profile',
      full_name: profileForm.full_name || 'Zulfiqar Ali',
      title_headline: profileForm.title_headline || '',
      bio: profileForm.bio || '',
      avatar_url: avatarUrlToSave,
      skills: profileForm.skills || [],
      email: profileForm.email || OWNER_EMAIL,
      github_url: profileForm.github_url || '',
      linkedin_url: profileForm.linkedin_url || '',
      twitter_url: profileForm.twitter_url || '',
      whatsapp: profileForm.whatsapp || '',
      facebook_url: profileForm.facebook_url || '',
      instagram_url: profileForm.instagram_url || '',
      tiktok_url: profileForm.tiktok_url || '',
      website_url: profileForm.website_url || '',
      updated_at: new Date().toISOString(),
    });

    // 2. Fallback to core columns if database table has older schema
    if (saveError && (saveError.code === '42703' || saveError.message?.toLowerCase().includes('column'))) {
      const { error: coreErr } = await supabase.from('profile').upsert({
        id: 'owner_profile',
        full_name: profileForm.full_name || 'Zulfiqar Ali',
        title_headline: profileForm.title_headline || '',
        bio: profileForm.bio || '',
        avatar_url: avatarUrlToSave,
        skills: profileForm.skills || [],
        email: profileForm.email || OWNER_EMAIL,
        github_url: profileForm.github_url || '',
        linkedin_url: profileForm.linkedin_url || '',
        twitter_url: profileForm.twitter_url || '',
        updated_at: new Date().toISOString(),
      });
      saveError = coreErr;
    }

    if (saveError) {
      console.warn('Supabase profile avatar save warning:', saveError);
    }

    showSuccess('Profile photo saved successfully!');
    await onRefreshData();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      let finalAvatarUrl = '';
      try {
        // 1. Try Supabase Storage upload
        finalAvatarUrl = await uploadAsset(file, 'avatars');
      } catch (storageErr) {
        console.warn('Storage bucket upload failed or bucket missing, using reliable Data URL fallback:', storageErr);
        // 2. Reliable fallback: convert image into compressed Data URL
        finalAvatarUrl = await fileToOptimizedDataUrl(file, 600);
      }

      await persistAvatar(finalAvatarUrl);
    } catch (err: any) {
      showError(`Photo upload error: ${err.message}`);
    } finally {
      setAvatarUploading(false);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const skill = newSkillInput.trim();
    if (!profileForm.skills.includes(skill)) {
      setProfileForm((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const fullPayload = {
      id: 'owner_profile',
      full_name: profileForm.full_name?.trim() || 'Zulfiqar Ali',
      title_headline: profileForm.title_headline?.trim() || '',
      bio: profileForm.bio?.trim() || '',
      avatar_url: profileForm.avatar_url || '',
      skills: profileForm.skills || [],
      email: profileForm.email?.trim() || OWNER_EMAIL,
      github_url: profileForm.github_url?.trim() || '',
      linkedin_url: profileForm.linkedin_url?.trim() || '',
      twitter_url: profileForm.twitter_url?.trim() || '',
      whatsapp: profileForm.whatsapp?.trim() || '',
      facebook_url: profileForm.facebook_url?.trim() || '',
      instagram_url: profileForm.instagram_url?.trim() || '',
      tiktok_url: profileForm.tiktok_url?.trim() || '',
      website_url: profileForm.website_url?.trim() || '',
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('profile').upsert(fullPayload);

      if (error) {
        // If a column is missing in older database table schema
        if (error.code === '42703' || error.message?.toLowerCase().includes('column')) {
          console.warn('Some social columns missing in database schema, falling back to core upsert:', error.message);
          const corePayload = {
            id: 'owner_profile',
            full_name: fullPayload.full_name,
            title_headline: fullPayload.title_headline,
            bio: fullPayload.bio,
            avatar_url: fullPayload.avatar_url,
            skills: fullPayload.skills,
            email: fullPayload.email,
            github_url: fullPayload.github_url,
            linkedin_url: fullPayload.linkedin_url,
            twitter_url: fullPayload.twitter_url,
            updated_at: fullPayload.updated_at,
          };
          const { error: coreErr } = await supabase.from('profile').upsert(corePayload);
          if (coreErr) throw coreErr;

          localStorage.setItem('portfolio_social_links', JSON.stringify({
            whatsapp: fullPayload.whatsapp,
            facebook_url: fullPayload.facebook_url,
            instagram_url: fullPayload.instagram_url,
            tiktok_url: fullPayload.tiktok_url,
            website_url: fullPayload.website_url,
          }));

          showSuccess('Profile & social channels saved successfully!');
          await onRefreshData();
          return;
        }
        throw error;
      }

      if (fullPayload.avatar_url) {
        localStorage.setItem('portfolio_avatar_url', fullPayload.avatar_url);
      }

      localStorage.setItem('portfolio_social_links', JSON.stringify({
        whatsapp: fullPayload.whatsapp,
        facebook_url: fullPayload.facebook_url,
        instagram_url: fullPayload.instagram_url,
        tiktok_url: fullPayload.tiktok_url,
        website_url: fullPayload.website_url,
      }));

      showSuccess('Profile and social channels saved successfully!');
      await onRefreshData();
    } catch (err: any) {
      showError(`Failed to save profile: ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // -------------------------------------------------------------
  // Projects Management
  // -------------------------------------------------------------
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm({ name: '', description: '', url: '' });
    setIsProjectFormOpen(true);
  };

  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({
      name: proj.name,
      description: proj.description,
      url: proj.url || '',
    });
    setIsProjectFormOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.description.trim()) {
      showError('Project name and description are required.');
      return;
    }

    try {
      const projectPayload = {
        name: projectForm.name.trim(),
        description: projectForm.description.trim(),
        url: projectForm.url.trim() ? projectForm.url.trim() : null,
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectPayload)
          .eq('id', editingProject.id);

        if (error) throw error;
        showSuccess('Project updated successfully.');
      } else {
        const { error } = await supabase.from('projects').insert([
          {
            ...projectPayload,
            order_index: projects.length,
          },
        ]);

        if (error) throw error;
        showSuccess('Project created successfully.');
      }

      setIsProjectFormOpen(false);
      await onRefreshData();
    } catch (err: any) {
      showError(`Project action failed: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // Websites Management
  // -------------------------------------------------------------
  const handleOpenAddWebsite = () => {
    setEditingWebsite(null);
    setWebsiteForm({ title: '', description: '', url: '' });
    setIsWebsiteFormOpen(true);
  };

  const handleOpenEditWebsite = (site: Website) => {
    setEditingWebsite(site);
    setWebsiteForm({
      title: site.title,
      description: site.description,
      url: site.url,
    });
    setIsWebsiteFormOpen(true);
  };

  const handleSaveWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteForm.title.trim() || !websiteForm.url.trim()) {
      showError('Title and URL are required.');
      return;
    }

    try {
      const payload = {
        title: websiteForm.title.trim(),
        description: websiteForm.description.trim(),
        url: websiteForm.url.trim(),
      };

      if (editingWebsite) {
        const { error } = await supabase
          .from('websites')
          .update(payload)
          .eq('id', editingWebsite.id);

        if (error) throw error;
        showSuccess('Website updated successfully.');
      } else {
        const { error } = await supabase.from('websites').insert([
          {
            ...payload,
            order_index: websites.length,
          },
        ]);

        if (error) throw error;
        showSuccess('Website added successfully.');
      }

      setIsWebsiteFormOpen(false);
      await onRefreshData();
    } catch (err: any) {
      showError(`Website action failed: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // Media Management (Certificates, Images, Videos)
  // -------------------------------------------------------------
  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaUploading(true);
    try {
      const folder = mediaForm.type === 'certificate' ? 'certificates' : mediaForm.type === 'video' ? 'videos' : 'gallery';
      const url = await uploadAsset(file, folder);
      setMediaForm((prev) => ({ ...prev, media_url: url }));
      showSuccess('Media asset uploaded to Supabase Storage!');
    } catch (err: any) {
      showError(`Upload error: ${err.message}. You may also provide a direct URL.`);
    } finally {
      setMediaUploading(false);
    }
  };

  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.title.trim() || !mediaForm.media_url.trim()) {
      showError('Title and Media URL / File are required.');
      return;
    }

    try {
      const payload = {
        title: mediaForm.title.trim(),
        type: mediaForm.type,
        media_url: mediaForm.media_url.trim(),
        link_url: mediaForm.link_url.trim() ? mediaForm.link_url.trim() : null,
        caption: mediaForm.caption.trim() ? mediaForm.caption.trim() : null,
        order_index: media.length,
      };

      const { error } = await supabase.from('media').insert([payload]);
      if (error) throw error;

      showSuccess(`${mediaForm.type.charAt(0).toUpperCase() + mediaForm.type.slice(1)} added successfully.`);
      setIsMediaFormOpen(false);
      setMediaForm({
        title: '',
        type: 'certificate',
        media_url: '',
        link_url: '',
        caption: '',
      });
      await onRefreshData();
    } catch (err: any) {
      showError(`Media upload failed: ${err.message}`);
    }
  };

  // -------------------------------------------------------------
  // Delete Execution
  // -------------------------------------------------------------
  const handleExecuteDelete = async () => {
    setIsDeleting(true);
    try {
      const { type, id } = deleteConfirmation;
      const tableName = type === 'project' ? 'projects' : type === 'website' ? 'websites' : 'media';

      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;

      showSuccess(`Deleted ${type} successfully.`);
      setDeleteConfirmation({ isOpen: false, type: 'project', id: '', title: '' });
      await onRefreshData();
    } catch (err: any) {
      showError(`Failed to delete item: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-5xl w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Owner Administration</span>
                {isOwnerLoggedIn && (
                  <span className="text-[11px] font-mono font-normal text-emerald-600 dark:text-emerald-400">
                    · Authenticated
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500">
                Single-owner control center for Zulfiqar Ali ({OWNER_EMAIL})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerLoggedIn && (
              <button
                onClick={handleLogout}
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Alert Banners */}
        {successMsg && (
          <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="px-6 py-2.5 bg-red-50 dark:bg-red-950/60 border-b border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Unauthenticated View: Single Owner Login Form */}
        {!isOwnerLoggedIn ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col items-center justify-center">
            <div className="max-w-md w-full space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 mx-auto flex items-center justify-center text-stone-700 dark:text-stone-300">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  Owner Authentication
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  This portfolio belongs exclusively to Zulfiqar Ali. Public sign-ups are disabled. Enter your owner credentials to manage content.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Owner Email
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    readOnly
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/60 text-stone-900 dark:text-stone-100 font-mono text-xs cursor-not-allowed"
                  />
                  <span className="text-[11px] text-stone-400">
                    Locked to designated single owner account
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter owner account password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? 'Verifying Credentials...' : 'Sign In as Owner'}
                </button>
              </form>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/40 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                <div className="font-semibold text-stone-800 dark:text-stone-200">
                  Protected Owner Account
                </div>
                <p className="text-[11px] leading-relaxed">
                  Only the authorized owner account (<code className="font-mono text-[10px]">{OWNER_EMAIL}</code>) has administrative privileges to modify portfolio content.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Owner View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30 p-3 sm:p-4 shrink-0 flex md:flex-col gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('profile')}
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile & Skills</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'projects'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('websites')}
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'websites'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Websites ({websites.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                type="button"
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === 'media'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Media & Proof ({media.length})</span>
              </button>
            </aside>

            {/* Main Tab Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: Profile & Skills */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      Edit Profile & Skills
                    </h3>
                    <p className="text-xs text-stone-500">
                      Update your name, bio, profile picture, and technical skills.
                    </p>
                  </div>

                  {/* Profile Picture Upload & Preview */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 shrink-0">
                        {profileForm.avatar_url ? (
                          <img
                            src={profileForm.avatar_url}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <User className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-amber-500" />
                            <span>{avatarUploading ? 'Uploading & Saving...' : 'Upload New Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarFileChange}
                              disabled={avatarUploading}
                              className="hidden"
                            />
                          </label>

                          {profileForm.avatar_url && (
                            <button
                              type="button"
                              onClick={() => persistAvatar('')}
                              className="px-2.5 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                              title="Clear photo"
                            >
                              Remove Photo
                            </button>
                          )}
                        </div>

                        <p className="text-[11px] text-stone-400">
                          Upload file or paste any direct image link below:
                        </p>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. https://... or direct image URL"
                            value={profileForm.avatar_url || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, avatar_url: e.target.value }))}
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                          />
                          <button
                            type="button"
                            onClick={() => persistAvatar(profileForm.avatar_url || '')}
                            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 cursor-pointer shrink-0"
                          >
                            Save Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name & Headline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, full_name: e.target.value }))}
                        required
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                        Headline / Title
                      </label>
                      <input
                        type="text"
                        value={profileForm.title_headline || ''}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, title_headline: e.target.value }))}
                        className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 leading-relaxed"
                    />
                  </div>

                  {/* Skills Editor */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                      Skills & Technologies
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Rust, Distributed Systems, Docker"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:opacity-90 cursor-pointer"
                      >
                        Add Skill
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {profileForm.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-600 transition-colors cursor-pointer"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct Contact & Social Channels */}
                  <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Bottom Bar & Direct Contact Channels
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        These channels appear in the bottom footer and hero section for visitors to reach you.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          WhatsApp (Phone or wa.me Link)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. +92 300 1234567 or https://wa.me/..."
                          value={profileForm.whatsapp || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* Contact Email */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. zulfiqaralikarime6@gmail.com"
                          value={profileForm.email || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* Facebook */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Facebook Profile / Page URL
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. facebook.com/yourprofile or https://..."
                          value={profileForm.facebook_url || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, facebook_url: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* Instagram */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Instagram Profile URL
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. instagram.com/yourprofile or @handle"
                          value={profileForm.instagram_url || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, instagram_url: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* TikTok */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          TikTok Profile URL
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. tiktok.com/@yourhandle"
                          value={profileForm.tiktok_url || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, tiktok_url: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* Website */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Personal / Company Website
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. yourwebsite.com or https://..."
                          value={profileForm.website_url || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, website_url: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* GitHub */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          GitHub Profile
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. github.com/... or https://..."
                          value={profileForm.github_url || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, github_url: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          LinkedIn Profile
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. linkedin.com/in/... or https://..."
                          value={profileForm.linkedin_url || ''}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: Projects */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        Manage Projects
                      </h3>
                      <p className="text-xs text-stone-500">
                        Create, edit, or remove project entries. Projects with a URL are tagged "Evidence linked", while projects without a URL are tagged "Self-reported".
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddProject}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {/* Project Add/Edit Form Modal */}
                  {isProjectFormOpen && (
                    <form
                      onSubmit={handleSaveProject}
                      className="p-5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-4"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        {editingProject ? 'Edit Project' : 'New Project'}
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={projectForm.name}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Distributed Cache Optimizer"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Description *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={projectForm.description}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Short summary of architecture, impact, or outcomes..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Project URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={projectForm.url}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, url: e.target.value }))}
                          placeholder="https://github.com/... or https://demo..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                        <span className="text-[11px] text-stone-400">
                          Leaving this blank marks the entry as "Self-reported". Providing a valid URL labels it "Evidence linked".
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsProjectFormOpen(false)}
                          className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                        >
                          {editingProject ? 'Update Project' : 'Create Project'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Projects List */}
                  <div className="space-y-3">
                    {projects.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl">
                        No projects yet. Click "Add Project" to create one.
                      </div>
                    ) : (
                      projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                {proj.name}
                              </h4>
                              {proj.url ? (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                  Evidence linked
                                </span>
                              ) : (
                                <span className="text-[10px] text-stone-400 font-mono">
                                  Self-reported
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-300">
                              {proj.description}
                            </p>
                            {proj.url && (
                              <a
                                href={proj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                              >
                                <span>{proj.url}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProject(proj)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                              title="Edit project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmation({
                                  isOpen: true,
                                  type: 'project',
                                  id: proj.id,
                                  title: proj.name,
                                })
                              }
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                              title="Delete project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Websites */}
              {activeTab === 'websites' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        Manage Websites
                      </h3>
                      <p className="text-xs text-stone-500">
                        Add and maintain external website links, public tools, and documentation portals.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddWebsite}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Website</span>
                    </button>
                  </div>

                  {/* Website Add/Edit Form Modal */}
                  {isWebsiteFormOpen && (
                    <form
                      onSubmit={handleSaveWebsite}
                      className="p-5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-4"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        {editingWebsite ? 'Edit Website' : 'New Website'}
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Website Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={websiteForm.title}
                          onChange={(e) => setWebsiteForm((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Distributed Codex"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Description *
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={websiteForm.description}
                          onChange={(e) => setWebsiteForm((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief summary of the website..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Target URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={websiteForm.url}
                          onChange={(e) => setWebsiteForm((prev) => ({ ...prev, url: e.target.value }))}
                          placeholder="https://..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsWebsiteFormOpen(false)}
                          className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                        >
                          {editingWebsite ? 'Update Website' : 'Save Website'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Websites List */}
                  <div className="space-y-3">
                    {websites.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl">
                        No websites listed. Click "Add Website" to create one.
                      </div>
                    ) : (
                      websites.map((site) => (
                        <div
                          key={site.id}
                          className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                              {site.title}
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-300">
                              {site.description}
                            </p>
                            <a
                              href={site.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                            >
                              <span>{site.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEditWebsite(site)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                              title="Edit website"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmation({
                                  isOpen: true,
                                  type: 'website',
                                  id: site.id,
                                  title: site.title,
                                })
                              }
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                              title="Delete website"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Media (Certificates, Images, Videos) */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                        Certificates, Images & Videos
                      </h3>
                      <p className="text-xs text-stone-500">
                        Upload certificates (PDF or Image), gallery images, and embed video players.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMediaFormOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Media Item</span>
                    </button>
                  </div>

                  {/* Add Media Form */}
                  {isMediaFormOpen && (
                    <form
                      onSubmit={handleSaveMedia}
                      className="p-5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-4"
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        New Media Asset
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                            Asset Type *
                          </label>
                          <select
                            value={mediaForm.type}
                            onChange={(e) => setMediaForm((prev) => ({ ...prev, type: e.target.value as MediaType }))}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                          >
                            <option value="certificate">Certificate (PDF / Image)</option>
                            <option value="image">Image (Gallery)</option>
                            <option value="video">Video (Embed or Direct MP4)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                            Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AWS Solutions Architect or Architecture Blueprint"
                            value={mediaForm.title}
                            onChange={(e) => setMediaForm((prev) => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                          />
                        </div>
                      </div>

                      {/* File upload or URL input */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 block">
                          File / URL *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer shrink-0">
                            <Upload className="w-3.5 h-3.5 text-amber-500" />
                            <span>{mediaUploading ? 'Uploading to Supabase...' : 'Upload File to Storage'}</span>
                            <input
                              type="file"
                              accept={mediaForm.type === 'video' ? 'video/*' : 'image/*,application/pdf'}
                              onChange={handleMediaFileUpload}
                              disabled={mediaUploading}
                              className="hidden"
                            />
                          </label>
                          <input
                            type="url"
                            required
                            placeholder={
                              mediaForm.type === 'video'
                                ? 'YouTube, Vimeo, Loom or direct MP4 URL'
                                : 'Or paste direct media URL (https://...)'
                            }
                            value={mediaForm.media_url}
                            onChange={(e) => setMediaForm((prev) => ({ ...prev, media_url: e.target.value }))}
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                          />
                        </div>
                      </div>

                      {/* Optional certificate link or project link */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          External Link (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="e.g. Credly link or verification URL"
                          value={mediaForm.link_url}
                          onChange={(e) => setMediaForm((prev) => ({ ...prev, link_url: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      {/* Caption */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          Caption / Details (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Short explanatory caption..."
                          value={mediaForm.caption}
                          onChange={(e) => setMediaForm((prev) => ({ ...prev, caption: e.target.value }))}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsMediaFormOpen(false)}
                          className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                        >
                          Save Media
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Media items listing */}
                  <div className="space-y-3">
                    {media.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl">
                        No media assets uploaded yet. Click "Add Media Item" to add certificates, gallery photos, or videos.
                      </div>
                    ) : (
                      media.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 sm:p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0 flex items-center justify-center">
                              {item.type === 'video' ? (
                                <Film className="w-5 h-5 text-amber-500" />
                              ) : (
                                <img
                                  src={item.media_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>

                            <div className="truncate">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400">
                                  {item.type}
                                </span>
                                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                                  {item.title}
                                </h4>
                              </div>
                              {item.caption && (
                                <p className="text-[11px] text-stone-500 truncate">
                                  {item.caption}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteConfirmation({
                                  isOpen: true,
                                  type: 'media',
                                  id: item.id,
                                  title: item.title,
                                })
                              }
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                              title="Delete media"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </main>
          </div>
        )}

        {/* Confirmation Modal for Deletions */}
        <ConfirmModal
          isOpen={deleteConfirmation.isOpen}
          title={`Delete ${deleteConfirmation.type}?`}
          message={`Are you sure you want to permanently delete "${deleteConfirmation.title}"? This action cannot be undone.`}
          confirmLabel="Delete Permanently"
          onCancel={() => setDeleteConfirmation({ isOpen: false, type: 'project', id: '', title: '' })}
          onConfirm={handleExecuteDelete}
          isProcessing={isDeleting}
        />
      </div>
    </div>
  );
}
