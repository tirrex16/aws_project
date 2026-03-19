import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { projects as defaultProjects, type Project } from '../data/projects.ts'

// ─── Types ───────────────────────────────────────────────
export type Assets = Record<string, string> // key → base64 or URL

interface AdminContextValue {
  projects: Project[]
  assets: Assets
  addProject: (project: Project) => void
  updateProject: (id: string, updated: Project) => void
  deleteProject: (id: string) => void
  updateAsset: (key: string, base64: string) => void
  resetAsset: (key: string) => void
}

// ─── Storage keys ────────────────────────────────────────
const PROJECTS_KEY = 'kanso_projects'
const ASSETS_KEY = 'kanso_assets'

// ─── Helpers ─────────────────────────────────────────────
function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (raw) return JSON.parse(raw) as Project[]
  } catch {}
  return defaultProjects
}

function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err)
    alert('Failed to save. The image you uploaded might be too large for the browser storage. Please try a smaller image.')
  }
}

function loadAssets(): Assets {
  try {
    const raw = localStorage.getItem(ASSETS_KEY)
    if (raw) return JSON.parse(raw) as Assets
  } catch {}
  return {}
}

function saveAssets(assets: Assets) {
  try {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets))
  } catch (err) {
    console.error('Failed to save assets to localStorage:', err)
    alert('Failed to save asset. The image might be too large.')
  }
}

// ─── Context ─────────────────────────────────────────────
const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(loadProjects)
  const [assets, setAssets] = useState<Assets>(loadAssets)

  // Persist projects whenever they change
  useEffect(() => {
    saveProjects(projects)
  }, [projects])

  // Persist assets whenever they change
  useEffect(() => {
    saveAssets(assets)
  }, [assets])

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev])
  }, [])

  const updateProject = useCallback((id: string, updated: Project) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateAsset = useCallback((key: string, base64: string) => {
    setAssets((prev) => ({ ...prev, [key]: base64 }))
  }, [])

  const resetAsset = useCallback((key: string) => {
    setAssets((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  return (
    <AdminContext.Provider
      value={{ projects, assets, addProject, updateProject, deleteProject, updateAsset, resetAsset }}
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
// Used by public components: resolves overridden asset first, then falls back to static path
export function resolveAsset(assets: Assets, key: string, fallback: string): string {
  return assets[key] ?? fallback
}
