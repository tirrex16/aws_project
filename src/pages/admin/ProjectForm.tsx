import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext.tsx'
import { type Project, type ProjectSection } from '../../data/projects.ts'
import { supabase } from '../../lib/supabaseClient.ts'
import ImageCropModal from './ImageCropModal.tsx'

function generateId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'png'
  const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from('images')
    .upload(filePath, file, { upsert: true })

  if (error) {
    console.error('Upload failed:', error.message)
    throw new Error('Image upload failed: ' + error.message)
  }

  const { data } = supabase.storage.from('images').getPublicUrl(filePath)
  return data.publicUrl
}

const emptySection = (): ProjectSection => ({
  label: 'Challenge',
  num: '01',
  headline: '',
  body: '',
  images: [],
})

const emptyProject = (): Omit<Project, 'id'> => ({
  name: '',
  tagline: '',
  type: '',
  client: '',
  duration: '',
  year: new Date().getFullYear().toString(),
  img: '',
  heroImg: '',
  sections: [emptySection()],
  relatedIds: [],
})

export default function ProjectForm() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { projects, addProject, updateProject } = useAdmin()
  const isEdit = id !== 'new' && id !== undefined
  const existing = isEdit ? projects.find((p) => p.id === id) : undefined

  const [form, setForm] = useState(() =>
    existing ? { ...existing } : { id: '', ...emptyProject() }
  )
  const [heroPreview, setHeroPreview] = useState<string>(existing?.heroImg ?? '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const heroInputRef = useRef<HTMLInputElement>(null)
  const [heroCropFile, setHeroCropFile] = useState<File | null>(null)
  const [sectionCropFile, setSectionCropFile] = useState<{ file: File; idx: number } | null>(null)

  useEffect(() => {
    if (existing) {
      setForm({ ...existing })
      setHeroPreview(existing.heroImg)
    }
  }, [id])

  const set = (field: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // ── Hero image upload ──
  const handleHeroFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File size cannot exceed 5MB')
      e.target.value = ''
      return
    }
    setHeroCropFile(file)
    e.target.value = ''
  }

  const handleHeroCropConfirm = async (croppedFile: File) => {
    setHeroCropFile(null)
    setUploading(true)
    try {
      const url = await uploadImage(croppedFile, 'projects/hero')
      setHeroPreview(url)
      set('img', url)
      set('heroImg', url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  // ── Section helpers ──
  const updateSection = (idx: number, field: keyof ProjectSection, value: unknown) => {
    const sections = [...form.sections]
    sections[idx] = { ...sections[idx], [field]: value } as ProjectSection
    set('sections', sections)
  }

  const addSection = () => {
    const num = String(form.sections.length + 1).padStart(2, '0')
    set('sections', [
      ...form.sections,
      { ...emptySection(), num, label: ['Challenge', 'Solution', 'Conclusion', 'Outcome'][form.sections.length] ?? 'Section' },
    ])
  }

  const removeSection = (idx: number) => {
    set('sections', form.sections.filter((_, i) => i !== idx))
  }

  const handleSectionFileSelect = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File size cannot exceed 5MB')
      e.target.value = ''
      return
    }
    setSectionCropFile({ file, idx })
    e.target.value = ''
  }

  const handleSectionCropConfirm = async (croppedFile: File) => {
    if (!sectionCropFile) return
    const idx = sectionCropFile.idx
    setSectionCropFile(null)
    setUploading(true)
    try {
      const url = await uploadImage(croppedFile, 'projects/sections')
      updateSection(idx, 'images', [...form.sections[idx].images, url].slice(0, 2))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeSectionImage = (sIdx: number, iIdx: number) => {
    const imgs = form.sections[sIdx].images.filter((_, i) => i !== iIdx)
    updateSection(sIdx, 'images', imgs)
  }

  // ── Validation ──
  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.type.trim()) e.type = 'Required'
    if (!form.year.trim()) e.year = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── Submit ──
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const project: Project = {
        ...form,
        id: isEdit ? form.id : generateId(form.name),
      }
      if (isEdit) {
        await updateProject(project.id, project)
      } else {
        await addProject(project)
      }
      navigate('/admin/projects')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#e8e8e8]">
        <div>
          <button className="text-[0.8125rem] font-semibold text-[#666] hover:text-[#0f0f0f] transition-colors flex items-center gap-1.5 mb-2 px-3 py-1.5 -ml-3 rounded-lg hover:bg-black/5" onClick={() => navigate('/admin/projects')}>
            ← Back to Projects
          </button>
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none mb-1">
            {isEdit ? 'Edit Project' : 'New Project'}
          </h1>
        </div>
      </div>

      <form className="max-w-[800px] flex flex-col gap-12" onSubmit={handleSubmit}>
        {/* ── Hero image ── */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-[#0f0f0f] border-b border-[#e8e8e8] pb-3">Cover Image</h2>
          <div
            className={`w-full h-[320px] rounded-[24px] overflow-hidden border-2 border-dashed ${heroPreview ? 'border-transparent' : 'border-[#d9d9d9] hover:border-[#0f0f0f] hover:bg-[#fafafa] bg-[#f5f5f5] cursor-pointer'} transition-all flex flex-col items-center justify-center relative group`}
            onClick={() => heroInputRef.current?.click()}
          >
            {uploading && !heroPreview && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" />
                <p className="text-[0.9375rem] font-medium text-[#666]">Uploading...</p>
              </div>
            )}
            {heroPreview ? (
              <>
                <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm cursor-pointer">
                  <span className="text-white font-semibold text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/30">
                    {uploading ? 'Uploading...' : 'Change Image'}
                  </span>
                </div>
              </>
            ) : !uploading && (
              <div className="flex flex-col items-center gap-2 text-center px-10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#e8e8e8] mb-1">
                  <span className="text-xl">↑</span>
                </div>
                <p className="text-[0.9375rem] font-semibold text-[#0f0f0f]">Click to upload cover image</p>
                <small className="text-[0.8125rem] text-[#888]">PNG, JPG, WebP up to 10MB</small>
              </div>
            )}
            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleHeroFileSelect}
            />
          </div>
          {heroPreview && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-red-500 text-sm font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                onClick={() => { setHeroPreview(''); set('img', ''); set('heroImg', '') }}
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        {/* ── Basic info ── */}
        <div className="flex flex-col gap-5">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-[#0f0f0f] border-b border-[#e8e8e8] pb-3 mb-2">Project Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Name *</label>
              <input
                className={`w-full h-11 px-4 bg-[#f9f9f9] border ${errors.name ? 'border-red-400 bg-red-50' : 'border-[#e8e8e8] hover:border-[#ccc]'} rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white`}
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Lune"
              />
              {errors.name && <span className="text-red-500 text-xs font-medium">{errors.name}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Tagline</label>
              <input
                className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white"
                value={form.tagline}
                onChange={(e) => set('tagline', e.target.value)}
                placeholder="Short description"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Type / Scope *</label>
              <input
                className={`w-full h-11 px-4 bg-[#f9f9f9] border ${errors.type ? 'border-red-400 bg-red-50' : 'border-[#e8e8e8] hover:border-[#ccc]'} rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white`}
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
                placeholder="e.g. Brand Identity"
              />
              {errors.type && <span className="text-red-500 text-xs font-medium">{errors.type}</span>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Client</label>
              <input
                className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white"
                value={form.client}
                onChange={(e) => set('client', e.target.value)}
                placeholder="Client name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Duration</label>
              <input
                className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                placeholder="e.g. 2 months"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Year *</label>
              <input
                className={`w-full h-11 px-4 bg-[#f9f9f9] border ${errors.year ? 'border-red-400 bg-red-50' : 'border-[#e8e8e8] hover:border-[#ccc]'} rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white`}
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="2025"
              />
              {errors.year && <span className="text-red-500 text-xs font-medium">{errors.year}</span>}
            </div>
          </div>
        </div>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3 mb-2">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] text-[#0f0f0f]">Content Sections</h2>
            {form.sections.length < 4 && (
              <button type="button" className="text-sm font-semibold text-[#3b5bdb] hover:bg-[#eff3ff] px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#c3d2f9]" onClick={addSection}>
                + Add section
              </button>
            )}
          </div>
          <div className="flex flex-col gap-6">
            {form.sections.map((sec, idx) => (
              <div key={idx} className="bg-white border border-[#e8e8e8] rounded-[24px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-6 transition-all hover:border-[#d9d9d9]">
                <div className="flex justify-between items-center bg-[#f9f9f9] -mx-8 -mt-8 px-8 py-4 border-b border-[#e8e8e8] rounded-t-[24px]">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#888] tracking-widest bg-white px-2 py-1 rounded border border-[#e8e8e8]">SEC {sec.num}</span>
                    <select
                      className="bg-transparent text-[0.9375rem] font-bold text-[#0f0f0f] outline-none cursor-pointer hover:text-black transition-colors"
                      value={sec.label}
                      onChange={(e) => updateSection(idx, 'label', e.target.value)}
                    >
                      {['Challenge', 'Solution', 'Conclusion', 'Outcome', 'Process', 'Result'].map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  {form.sections.length > 1 && (
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => removeSection(idx)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Headline</label>
                    <input
                      className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white"
                      value={sec.headline}
                      onChange={(e) => updateSection(idx, 'headline', e.target.value)}
                      placeholder="Main statement for this section"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Body text</label>
                    <textarea
                      rows={4}
                      className="w-full p-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none transition-colors focus:border-[#0f0f0f] focus:bg-white resize-y"
                      value={sec.body}
                      onChange={(e) => updateSection(idx, 'body', e.target.value)}
                      placeholder="Supporting description"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Images (max 2)</label>
                      <span className="text-[0.75rem] text-[#888]">{sec.images.length}/2 uploaded</span>
                    </div>
                    <div className="flex gap-4">
                      {sec.images.map((src, iIdx) => (
                        <div key={iIdx} className="relative w-[160px] h-[120px] rounded-xl overflow-hidden border border-[#e8e8e8] group">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 backdrop-blur-md"
                            onClick={() => removeSectionImage(idx, iIdx)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {sec.images.length < 2 && (
                        <label className="w-[160px] h-[120px] rounded-xl border border-dashed border-[#ccc] hover:border-[#0f0f0f] hover:bg-[#fafafa] bg-[#f5f5f5] flex flex-col items-center justify-center cursor-pointer transition-colors text-[#888] hover:text-[#0f0f0f]">
                          {uploading ? (
                            <div className="w-6 h-6 border-2 border-[#888] border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <span className="text-xl mb-1">+</span>
                              <span className="text-[0.75rem] font-medium text-inherit">Add Image</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSectionFileSelect(idx, e)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex items-center justify-end gap-4 pt-8 border-t border-[#e8e8e8] mt-6">
          <button
            type="button"
            className="px-6 py-3 bg-white border border-[#e8e8e8] text-[#0f0f0f] rounded-xl font-semibold hover:bg-[#f5f5f5] transition-colors"
            onClick={() => navigate('/admin/projects')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-[#0f0f0f] text-white rounded-xl font-semibold hover:bg-[#333] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={saving || uploading}
          >
            {saving ? 'Saving…' : uploading ? 'Uploading…' : isEdit ? 'Save changes' : 'Create project'}
          </button>
        </div>
      </form>

      {heroCropFile && (
        <ImageCropModal
          file={heroCropFile}
          onConfirm={handleHeroCropConfirm}
          onCancel={() => setHeroCropFile(null)}
          aspectRatio={4 / 3}
        />
      )}

      {sectionCropFile && (
        <ImageCropModal
          file={sectionCropFile.file}
          onConfirm={handleSectionCropConfirm}
          onCancel={() => setSectionCropFile(null)}
        />
      )}
    </div>
  )
}
