export const SUPABASE_SQL_SCRIPT = `-- ==============================================================================
-- ZULFIQAR ALI PORTFOLIO - SUPABASE SETUP SCRIPT
-- Paste this entire script into your Supabase project's SQL Editor and click "Run".
-- Project: https://qqvmcorazhiujurrxugl.supabase.co
-- Owner Email: zulfiqaralikarime6@gmail.com
-- ==============================================================================

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the profile table (single row portfolio bio, name, and skills)
CREATE TABLE IF NOT EXISTS public.profile (
    id TEXT PRIMARY KEY DEFAULT 'owner_profile',
    full_name TEXT NOT NULL DEFAULT 'Zulfiqar Ali',
    title_headline TEXT DEFAULT 'Software Engineer & Technical Architect',
    bio TEXT NOT NULL DEFAULT 'Full-stack software engineer and system builder specializing in high-performance web applications, distributed architecture, and clean user interfaces.',
    avatar_url TEXT DEFAULT '',
    skills TEXT[] DEFAULT ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure', 'System Design', 'Tailwind CSS', 'API Architecture', 'Vite', 'Supabase'],
    email TEXT NOT NULL DEFAULT 'zulfiqaralikarime6@gmail.com',
    github_url TEXT DEFAULT 'https://github.com',
    linkedin_url TEXT DEFAULT 'https://linkedin.com',
    twitter_url TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    tiktok_url TEXT DEFAULT '',
    website_url TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created earlier
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS whatsapp TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS tiktok_url TEXT DEFAULT '';
ALTER TABLE public.profile ADD COLUMN IF NOT EXISTS website_url TEXT DEFAULT '';

-- 3. Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create the websites table
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT NOT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create the media table (Certificates, Images, and Videos)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('certificate', 'image', 'video')),
    media_url TEXT NOT NULL,
    link_url TEXT,
    caption TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Storage Bucket
-- NOTE: Create a public bucket named 'portfolio-assets' in Supabase Dashboard:
-- Storage > New Bucket > Name: 'portfolio-assets' > Toggle 'Public bucket: ON'.
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'portfolio-assets',
        'portfolio-assets',
        true,
        52428800,
        ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'video/mp4', 'video/webm', 'video/quicktime']
    )
    ON CONFLICT (id) DO UPDATE SET public = true;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Storage bucket can be created via Supabase Storage UI';
END $$;

-- ------------------------------------------------------------------------------
-- 7. Row Level Security (RLS) Configuration
-- Only authenticated owner account (zulfiqaralikarime6@gmail.com) can insert/update/delete.
-- All visitors have read-only access.
-- ------------------------------------------------------------------------------

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profile" ON public.profile;
DROP POLICY IF EXISTS "Owner can modify profile" ON public.profile;
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Owner can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Owner can update projects" ON public.projects;
DROP POLICY IF EXISTS "Owner can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view websites" ON public.websites;
DROP POLICY IF EXISTS "Owner can insert websites" ON public.websites;
DROP POLICY IF EXISTS "Owner can update websites" ON public.websites;
DROP POLICY IF EXISTS "Owner can delete websites" ON public.websites;
DROP POLICY IF EXISTS "Public can view media" ON public.media;
DROP POLICY IF EXISTS "Owner can insert media" ON public.media;
DROP POLICY IF EXISTS "Owner can update media" ON public.media;
DROP POLICY IF EXISTS "Owner can delete media" ON public.media;

-- Public Read-Only Policies
CREATE POLICY "Public can view profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view websites" ON public.websites FOR SELECT USING (true);
CREATE POLICY "Public can view media" ON public.media FOR SELECT USING (true);

-- Owner Write Policies (Tied specifically to zulfiqaralikarime6@gmail.com)
CREATE POLICY "Owner can modify profile" ON public.profile
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can insert projects" ON public.projects
    FOR INSERT TO authenticated
    WITH CHECK ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can update projects" ON public.projects
    FOR UPDATE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can delete projects" ON public.projects
    FOR DELETE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can insert websites" ON public.websites
    FOR INSERT TO authenticated
    WITH CHECK ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can update websites" ON public.websites
    FOR UPDATE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can delete websites" ON public.websites
    FOR DELETE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can insert media" ON public.media
    FOR INSERT TO authenticated
    WITH CHECK ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can update media" ON public.media
    FOR UPDATE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com')
    WITH CHECK ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

CREATE POLICY "Owner can delete media" ON public.media
    FOR DELETE TO authenticated
    USING ((auth.jwt() ->> 'email') = 'zulfiqaralikarime6@gmail.com');

-- ------------------------------------------------------------------------------
-- 8. Storage Bucket Note
-- In Supabase Storage, create a bucket named 'portfolio-assets' and toggle 'Public'.
-- (PostgreSQL blocks direct policy modification on storage.objects from SQL Editor
-- with error 42501 because the table is owned by supabase_storage_admin).
-- ------------------------------------------------------------------------------

-- ------------------------------------------------------------------------------
-- 9. Initial Seed Data
-- ------------------------------------------------------------------------------
INSERT INTO public.profile (id, full_name, title_headline, bio, skills, email)
VALUES (
    'owner_profile',
    'Zulfiqar Ali',
    'Software Engineer & System Architect',
    'Full-stack software engineer and system builder specializing in high-performance web applications, distributed architecture, and clean user interfaces.',
    ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Cloud Infrastructure', 'System Architecture', 'Tailwind CSS', 'API Engineering', 'Vite', 'Supabase'],
    'zulfiqaralikarime6@gmail.com'
)
ON CONFLICT (id) DO NOTHING;
`;
