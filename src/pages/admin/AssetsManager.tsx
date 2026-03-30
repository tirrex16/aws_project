import { useRef, useState, type ChangeEvent } from 'react'
import { useAdmin, resolveAsset } from '../../context/AdminContext.tsx'
import ImageCropModal from './ImageCropModal.tsx'

interface AssetDefinition {
  key: string
  label: string
  fallback: string
  description: string
}

const SITE_ASSETS: AssetDefinition[] = [
  { key: 'hero_bg', label: 'Hero Background', fallback: '/images/placeholder-photo.svg', description: 'Used in the nav overlay menu' },
  { key: 'hero_bw', label: 'Hero Main Image', fallback: '/images/placeholder-photo.svg', description: 'Large hero photo on homepage' },
  { key: 'showreel', label: 'Showreel Image', fallback: '/images/placeholder-photo.svg', description: 'About section showreel' },
  { key: 'bento_building', label: 'Bento Building', fallback: '/images/placeholder-photo.svg', description: 'Why Us bento card' },
  { key: 'bento_silhouette', label: 'Bento Silhouette', fallback: '/images/placeholder-photo.svg', description: 'Why Us bento card' },
  { key: 'project_1', label: 'Project Image 1', fallback: '/images/placeholder-photo.svg', description: 'Services/sections image' },
  { key: 'project_2', label: 'Project Image 2', fallback: '/images/placeholder-photo.svg', description: 'Services/sections image' },
  { key: 'project_3', label: 'Project Image 3', fallback: '/images/placeholder-photo.svg', description: 'Services/sections image' },
  { key: 'project_4', label: 'Project Image 4', fallback: '/images/placeholder-photo.svg', description: 'Services/sections image' },
  { key: 'work_1', label: 'Work Card 1', fallback: '/images/placeholder-photo.svg', description: 'Selected Work card' },
  { key: 'work_2', label: 'Work Card 2', fallback: '/images/placeholder-photo.svg', description: 'Selected Work card' },
  { key: 'work_3', label: 'Work Card 3', fallback: '/images/placeholder-photo.svg', description: 'Selected Work card' },
  { key: 'work_4', label: 'Work Card 4', fallback: '/images/placeholder-photo.svg', description: 'Selected Work card' },
]

function AssetCard({ def, src, onReplace, onReset }: {
  def: AssetDefinition
  src: string
  onReplace: (file: File) => Promise<void>
  onReset: () => Promise<void>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isOverridden = src !== def.fallback
  const [uploading, setUploading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [cropFile, setCropFile] = useState<File | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('File size cannot exceed 5MB')
      e.target.value = ''
      return
    }
    setCropFile(file)
    e.target.value = ''
  }

  const handleCropConfirm = async (croppedFile: File) => {
    setCropFile(null)
    setUploading(true)
    try {
      await onReplace(croppedFile)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleCropCancel = () => {
    setCropFile(null)
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      await onReset()
    } finally {
      setResetting(false)
    }
  }

  const getAspectRatio = (key: string) => {
    if (key.startsWith('project_')) return 4 / 3
    if (key.startsWith('work_')) return 16 / 10
    if (key === 'hero_bg' || key === 'showreel') return 16 / 9
    if (key === 'hero_bw') return 16 / 9 // For the homepage hero if it was used
    if (key.startsWith('bento_')) return 3 / 4
    return undefined
  }

  return (
    <>
      <div className={`bg-white border ${isOverridden ? 'border-blue-500 shadow-[0_4px_16px_rgba(59,130,246,0.1)]' : 'border-[#e8e8e8] shadow-[0_2px_8px_rgba(0,0,0,0.02)]'} rounded-2xl overflow-hidden p-3 flex flex-col gap-4 transition-all`}>
        <div className="relative w-full aspect-video bg-[#f0f0f0] rounded-xl overflow-hidden">
          <img src={src} alt={def.label} className="w-full h-full object-cover" />
          {isOverridden && <span className="absolute top-2.5 right-2.5 bg-blue-500 text-white text-[0.625rem] font-bold uppercase tracking-[0.05em] px-2 py-1 rounded-[6px] shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Modified</span>}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="flex flex-col px-1 pb-1">
          <div className="text-[0.9375rem] font-semibold text-[#0f0f0f] tracking-[-0.01em]">{def.label}</div>
          <div className="text-[0.8125rem] text-[#666] leading-[1.5] mt-1 mb-4">{def.description}</div>
          <div className="flex items-center gap-2 mt-auto">
            <button
              className="flex-1 px-3 py-2 bg-white text-[#0f0f0f] border border-[#e8e8e8] rounded-lg text-[0.8125rem] font-medium hover:bg-[#f9f9f9] transition-colors disabled:opacity-50"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? '↑ Uploading…' : '↑ Replace'}
            </button>
            {isOverridden && (
              <button
                className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-[0.8125rem] font-medium hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? 'Resetting…' : 'Reset'}
              </button>
            )}
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      </div>

      {cropFile && (
        <ImageCropModal
          file={cropFile}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
          aspectRatio={getAspectRatio(def.key)}
        />
      )}
    </>
  )
}

export default function AssetsManager() {
  const { assets, updateAsset, resetAsset, loading } = useAdmin()

  const modifiedCount = SITE_ASSETS.filter(({ key, fallback }) => assets[key] && assets[key] !== fallback).length

  if (loading) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="h-8 w-28 bg-[#e8e8e8] rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-48 bg-[#f0f0f0] rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-[#e8e8e8] rounded-2xl p-3">
              <div className="w-full aspect-video bg-[#f0f0f0] rounded-xl animate-pulse mb-4" />
              <div className="h-4 w-32 bg-[#e8e8e8] rounded animate-pulse mb-2" />
              <div className="h-3 w-48 bg-[#f0f0f0] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none mb-2">Assets</h1>
          <p className="text-[0.9375rem] text-[#666]">
            {modifiedCount} of {SITE_ASSETS.length} images modified
          </p>
        </div>
      </div>

      <div className="bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] px-5 py-4 rounded-xl text-[0.875rem] font-medium leading-[1.5] mb-8">
        ☁️ Replaced images are saved in the cloud (Supabase Storage). They will be shown on the public site immediately.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SITE_ASSETS.map((def) => (
          <AssetCard
            key={def.key}
            def={def}
            src={resolveAsset(assets, def.key, def.fallback)}
            onReplace={async (file) => { await updateAsset(def.key, file) }}
            onReset={async () => { await resetAsset(def.key) }}
          />
        ))}
      </div>
    </div>
  )
}
