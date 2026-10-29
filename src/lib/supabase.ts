import { createClient } from '@supabase/supabase-js';
import type { Profile, Project, Website, MediaItem } from '../types';

// Fallback images generated for Zulfiqar's portfolio
import avatarImage from '../assets/images/zulfiqar_avatar_1792473978360.jpg';
import showcaseImage from '../assets/images/portfolio_hero_showcase_1792473979516.jpg';
import galleryImage from '../assets/images/gallery_design_work_1792473979824.jpg';

// Read from env with fallback to the user's provided Supabase project credentials
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qqvmcorazhiujurrxugl.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PLxDvVBRWV_t4PWgKu6bpw_y1vya3Dg';
export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || 'zulfiqaralikarime6@gmail.com').toLowerCase().trim();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Storage bucket constant
export const STORAGE_BUCKET = 'portfolio-assets';

// Default initial state for local fallback or when database is not yet migrated
export const DEFAULT_PROFILE: Profile = {
  id: 'owner_profile',
  full_name: 'Zulfiqar Ali',
  title_headline: 'Software Engineer & Technical Architect',
  bio: 'Full-stack software engineer and system builder specializing in high-performance web applications, distributed architecture, and clean user interfaces. Crafting reliable digital products with obsessive attention to craft, performance, and typography.',
  avatar_url: avatarImage,
  skills: [
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'Cloud Architecture',
    'System Design',
    'Tailwind CSS',
    'API Engineering',
    'Supabase',
    'Vite'
  ],
  email: 'zulfiqaralikarime6@gmail.com',
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  twitter_url: '',
  whatsapp: '',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  website_url: '',
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Aether Distributed Message Engine',
    description: 'High-throughput event aggregation pipeline and real-time streaming protocol designed with zero-allocation buffers, WebSocket clustering, and resilient fault isolation.',
    url: 'https://github.com/example/aether-engine',
    order_index: 0,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Zero-Latency Billing & License Gateway',
    description: 'Self-hosted software licensing validation infrastructure featuring cryptographic token issuance, multi-tenant rate limiting, and instant offline validation hooks.',
    url: 'https://github.com/example/billing-gateway',
    order_index: 1,
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 'proj-3',
    name: 'Autonomous Edge Cache Invalidation Protocol',
    description: 'Bespoke distributed cache coordination protocol reducing thundering herd penalties across geo-distributed compute clusters through probabilistic early-recomputation.',
    url: null, // Note: Self-reported demo (no URL)
    order_index: 2,
    created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
];

export const DEFAULT_WEBSITES: Website[] = [
  {
    id: 'web-1',
    title: 'Distributed Systems Architecture Codex',
    description: 'A curated open knowledge compendium dissecting failure modes, consensus protocols, and real-world post-mortems in production distributed engineering.',
    url: 'https://github.com',
    order_index: 0,
    created_at: new Date(Date.now() - 86400000 * 40).toISOString(),
  },
  {
    id: 'web-2',
    title: 'Production Latency Benchmarking Hub',
    description: 'Automated telemetry platform tracking tail latencies, memory overhead, and cold-start profiles across modern JavaScript and WebAssembly runtimes.',
    url: 'https://supabase.com',
    order_index: 1,
    created_at: new Date(Date.now() - 86400000 * 70).toISOString(),
  },
];

export const DEFAULT_MEDIA: MediaItem[] = [
  {
    id: 'med-cert-1',
    title: 'AWS Certified Solutions Architect – Professional',
    type: 'certificate',
    media_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1200&q=80',
    link_url: 'https://aws.amazon.com/certification/',
    caption: 'Advanced cloud architecture, resilience engineering, and multi-region network design.',
    order_index: 0,
  },
  {
    id: 'med-img-1',
    title: 'System Topology & Interface Blueprint',
    type: 'image',
    media_url: showcaseImage,
    caption: 'Ergonomic multi-window telemetry dashboard and architectural monitoring console.',
    order_index: 1,
  },
  {
    id: 'med-img-2',
    title: 'Minimal Hardware Architecture Bench',
    type: 'image',
    media_url: galleryImage,
    caption: 'Design workspace, prototyping notes, and physical structural study.',
    order_index: 2,
  },
  {
    id: 'med-vid-1',
    title: 'Distributed State Machine Walkthrough',
    type: 'video',
    media_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Clean embed sample
    caption: 'Deep-dive code review and live benchmark demonstration of distributed event replication.',
    order_index: 3,
  },
];

/**
 * Uploads a file to Supabase Storage bucket
 */
export async function uploadAsset(
  file: File,
  folder: 'avatars' | 'projects' | 'certificates' | 'gallery' | 'videos' = 'gallery'
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'dat';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  // Attempt upload
  let { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  // If bucket not found, attempt to auto-create it and retry once
  if (uploadError && uploadError.message?.toLowerCase().includes('bucket not found')) {
    try {
      const { error: createError } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
      });

      if (!createError) {
        // Retry upload after bucket creation
        const retryResult = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });
        uploadError = retryResult.error;
      }
    } catch {
      // Ignore create error and proceed to detailed error below
    }
  }

  if (uploadError) {
    if (uploadError.message?.toLowerCase().includes('bucket not found')) {
      throw new Error(
        `Bucket 'portfolio-assets' does not exist yet. Please go to your Supabase Dashboard > Storage > New Bucket, name it 'portfolio-assets', turn 'Public bucket' ON, and click Save.`
      );
    }
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Optimizes an image and converts it to a compact Data URL
 * Guaranteed fallback if Supabase storage bucket has not been configured yet
 */
export async function fileToOptimizedDataUrl(file: File, maxDim = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

