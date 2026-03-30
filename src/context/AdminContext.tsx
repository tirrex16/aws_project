import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { projects as defaultProjects, type Project } from '../data/projects.ts'
import { supabase } from '../lib/supabaseClient.ts'
import { seedProjectsIfEmpty, fetchAllProjects } from '../lib/seedProjects.ts'
import { defaultSiteContent, type SiteContent } from '../data/siteContent.ts'

// ─── Types ───────────────────────────────────────────────
export type Assets = Record<string, string> // key → URL

interface AdminContextValue {
  projects: Project[]
  assets: Assets
  siteContent: SiteContent
  loading: boolean
  addProject: (project: Project) => Promise<void>
  updateProject: (id: string, updated: Project) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  updateAsset: (key: string, file: File) => Promise<void>
  resetAsset: (key: string) => Promise<void>
  refreshProjects: () => Promise<void>
  updateSiteContent: <K extends keyof SiteContent>(section: K, content: SiteContent[K]) => Promise<void>
}

// ─── Context ─────────────────────────────────────────────
const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [assets, setAssets] = useState<Assets>({})
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultSiteContent)
  const [loading, setLoading] = useState(true)

  // ── Load projects from Supabase on mount ──
  const refreshProjects = useCallback(async () => {
    const data = await fetchAllProjects()
    if (data.length > 0) {
      setProjects(data)
    }
  }, [])

  // ── Load assets from Supabase on mount ──
  const loadAssets = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_assets')
      .select('*')

    if (error) {
      console.error('Failed to load assets:', error.message)
      return
    }

    const map: Assets = {}
    for (const row of data ?? []) {
      map[row.key] = row.url
    }
    setAssets(map)
  }, [])

  // ── Load site content from Supabase ──
  const loadSiteContent = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')

    if (error) {
      console.error('Failed to load site content:', error.message)
      return
    }

    if (!data || data.length === 0) return

    const merged = { ...defaultSiteContent }
    for (const row of data) {
      const key = row.key as keyof SiteContent
      if (key in merged) {
        (merged as any)[key] = row.content
      }
    }
    setSiteContent(merged)
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        await seedProjectsIfEmpty()
        await refreshProjects()
        await loadAssets()
        await loadSiteContent()
      } catch (err) {
        console.error('Initialization error:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [refreshProjects, loadAssets, loadSiteContent])

  // ── Add project ──
  const addProject = useCallback(async (project: Project) => {
    const { error: pErr } = await supabase.from('projects').insert({
      id: project.id,
      name: project.name,
      tagline: project.tagline,
      type: project.type,
      client: project.client,
      duration: project.duration,
      year: project.year,
      img: project.img,
      hero_img: project.heroImg,
      related_ids: project.relatedIds,
    })

    if (pErr) {
      console.error('Failed to add project:', pErr.message)
      alert('Failed to add project: ' + pErr.message)
      return
    }

    for (let i = 0; i < project.sections.length; i++) {
      const sec = project.sections[i]
      await supabase.from('project_sections').insert({
        project_id: project.id,
        label: sec.label,
        num: sec.num,
        headline: sec.headline,
        body: sec.body,
        images: sec.images,
        sort_order: i,
      })
    }

    await refreshProjects()
  }, [refreshProjects])

  // ── Update project ──
  const updateProject = useCallback(async (id: string, updated: Project) => {
    const { error: pErr } = await supabase
      .from('projects')
      .update({
        name: updated.name,
        tagline: updated.tagline,
        type: updated.type,
        client: updated.client,
        duration: updated.duration,
        year: updated.year,
        img: updated.img,
        hero_img: updated.heroImg,
        related_ids: updated.relatedIds,
      })
      .eq('id', id)

    if (pErr) {
      console.error('Failed to update project:', pErr.message)
      alert('Failed to update project: ' + pErr.message)
      return
    }

    await supabase.from('project_sections').delete().eq('project_id', id)

    for (let i = 0; i < updated.sections.length; i++) {
      const sec = updated.sections[i]
      await supabase.from('project_sections').insert({
        project_id: id,
        label: sec.label,
        num: sec.num,
        headline: sec.headline,
        body: sec.body,
        images: sec.images,
        sort_order: i,
      })
    }

    await refreshProjects()
  }, [refreshProjects])

  // ── Delete project ──
  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      console.error('Failed to delete project:', error.message)
      alert('Failed to delete project: ' + error.message)
      return
    }

    await refreshProjects()
  }, [refreshProjects])

  // ── Update asset (upload to Supabase Storage) ──
  const updateAsset = useCallback(async (_key: string, file: File) => {
    const filePath = `assets/${_key}-${Date.now()}.${file.name.split('.').pop()}`

    const { error: upErr } = await supabase.storage
      .from('images')
      .upload(filePath, file, { upsert: true })

    if (upErr) {
      console.error('Failed to upload asset:', upErr.message)
      alert('Failed to upload: ' + upErr.message)
      return
    }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    const publicUrl = urlData.publicUrl

    const { error: dbErr } = await supabase
      .from('site_assets')
      .upsert({ key: _key, url: publicUrl, updated_at: new Date().toISOString() })

    if (dbErr) {
      console.error('Failed to save asset reference:', dbErr.message)
      return
    }

    setAssets((prev) => ({ ...prev, [_key]: publicUrl }))
  }, [])

  // ── Reset asset ──
  const resetAsset = useCallback(async (key: string) => {
    const { error } = await supabase.from('site_assets').delete().eq('key', key)
    if (error) {
      console.error('Failed to reset asset:', error.message)
      return
    }

    setAssets((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  // ── Update site content section ──
  const updateSiteContent = useCallback(async <K extends keyof SiteContent>(section: K, content: SiteContent[K]) => {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        key: section,
        content: content as any,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error(`Failed to update ${section}:`, error.message)
      alert(`Failed to save: ${error.message}`)
      return
    }

    setSiteContent((prev) => ({ ...prev, [section]: content }))
  }, [])

  return (
    <AdminContext.Provider
      value={{ projects, assets, siteContent, loading, addProject, updateProject, deleteProject, updateAsset, resetAsset, refreshProjects, updateSiteContent }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}

// ─── Asset resolution helper ─────────────────────────────
export function resolveAsset(assets: Assets, key: string, fallback: string): string {
  return assets[key] ?? fallback
}
