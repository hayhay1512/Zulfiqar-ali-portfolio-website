export type MediaType = 'certificate' | 'image' | 'video';

export interface Profile {
  id: string;
  full_name: string;
  title_headline?: string;
  bio: string;
  avatar_url?: string;
  skills: string[];
  email: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  whatsapp?: string;
  facebook_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  website_url?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string | null;
  order_index?: number;
  created_at?: string;
}

export interface Website {
  id: string;
  title: string;
  description: string;
  url: string;
  order_index?: number;
  created_at?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  media_url: string;
  link_url?: string | null;
  caption?: string | null;
  order_index?: number;
  created_at?: string;
}
