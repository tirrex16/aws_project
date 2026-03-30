import { supabase } from './supabaseClient'
import { projects as defaultProjects } from '../data/projects'
import type { Project } from '../data/projects'

/**
 * Check if the projects table is empty, and if so, seed it with default data.
 * Called once when AdminContext first loads.
 */
export async function seedProjectsIfEmpty(): Promise<void> {
  const { count, error } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Failed to check projects table:', error.message)
    return
  }

  if (count && count > 0) return // Already has data

  console.log('Seeding default projects...')

  for (const project of defaultProjects) {
    // Insert the project row
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
      console.error(`Failed to seed project "${project.name}":`, pErr.message)
      continue
    }

    // Insert sections for this project
    for (let i = 0; i < project.sections.length; i++) {
      const sec = project.sections[i]
      const { error: sErr } = await supabase.from('project_sections').insert({
        project_id: project.id,
        label: sec.label,
        num: sec.num,
        headline: sec.headline,
        body: sec.body,
        images: sec.images,
        sort_order: i,
      })
      if (sErr) {
        console.error(`Failed to seed section for "${project.name}":`, sErr.message)
      }
    }
  }

  console.log('Seeding complete!')
}

/**
 * Fetch all projects with their sections from Supabase and convert to the
 * Project[] shape used throughout the app.
 */
export async function fetchAllProjects(): Promise<Project[]> {
  const { data: rows, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch projects:', error.message)
    return []
  }

  if (!rows || rows.length === 0) return []

  // Fetch all sections in one query
  const { data: allSections, error: secErr } = await supabase
    .from('project_sections')
    .select('*')
    .order('sort_order', { ascending: true })

  if (secErr) {
    console.error('Failed to fetch sections:', secErr.message)
  }

  const sectionsMap = new Map<string, typeof allSections>()
  for (const sec of allSections ?? []) {
    const list = sectionsMap.get(sec.project_id) ?? []
    list.push(sec)
    sectionsMap.set(sec.project_id, list)
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    tagline: row.tagline ?? '',
    type: row.type,
    client: row.client ?? '',
    duration: row.duration ?? '',
    year: row.year,
    img: row.img ?? '',
    heroImg: row.hero_img ?? '',
    sections: (sectionsMap.get(row.id) ?? []).map((s) => ({
      label: s.label,
      num: s.num,
      headline: s.headline ?? '',
      body: s.body ?? '',
      images: s.images ?? [],
    })),
    relatedIds: row.related_ids ?? [],
  }))
}
