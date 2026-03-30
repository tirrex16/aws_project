-- =============================================
-- Supabase Database Setup for Kanso Admin
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================

-- 1. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  type TEXT NOT NULL,
  client TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  year TEXT NOT NULL,
  img TEXT DEFAULT '',
  hero_img TEXT DEFAULT '',
  related_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Project Sections table
CREATE TABLE IF NOT EXISTS project_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Challenge',
  num TEXT NOT NULL DEFAULT '01',
  headline TEXT DEFAULT '',
  body TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0
);

-- 3. Site Assets table
CREATE TABLE IF NOT EXISTS site_assets (
  key TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Site Content table (editable section content as JSON)
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies — Allow public read and full access
-- (Auth is handled via PIN in the frontend)

-- Projects
CREATE POLICY "Allow public read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert projects" ON projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update projects" ON projects
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete projects" ON projects
  FOR DELETE USING (true);

-- Project Sections
CREATE POLICY "Allow public read sections" ON project_sections
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert sections" ON project_sections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update sections" ON project_sections
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete sections" ON project_sections
  FOR DELETE USING (true);

-- Site Assets
CREATE POLICY "Allow public read assets" ON site_assets
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert assets" ON site_assets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update assets" ON site_assets
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete assets" ON site_assets
  FOR DELETE USING (true);

-- Site Content
CREATE POLICY "Allow public read content" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert content" ON site_content
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update content" ON site_content
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete content" ON site_content
  FOR DELETE USING (true);

-- 7. Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies — public read, allow upload/update/delete
CREATE POLICY "Allow public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow public upload storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public update storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Allow public delete storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');
