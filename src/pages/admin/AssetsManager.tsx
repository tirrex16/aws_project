import { useRef, type ChangeEvent } from 'react'
import { useAdmin, resolveAsset } from '../../context/AdminContext.tsx'

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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function AssetCard({ def, src, onReplace, onReset }: {
  def: AssetDefinition
  src: string
  onReplace: (base64: string) => void
  onReset: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isOverridden = src.startsWith('data:')

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const base64 = await fileToBase64(file)
    onReplace(base64)
    e.target.value = ''
  }

  return (
    <div className={`bg-white border ${isOverridden ? 'border-blue-500 shadow-[0_4px_16px_rgba(59,130,246,0.1)]' : 'border-[#e8e8e8] shadow-[0_2px_8px_rgba(0,0,0,0.02)]'} rounded-2xl overflow-hidden p-3 flex flex-col gap-4 transition-all`}>
      <div className="relative w-full aspect-video bg-[#f0f0f0] rounded-xl overflow-hidden">
        <img src={src} alt={def.label} className="w-full h-full object-cover" />
        {isOverridden && <span className="absolute top-2.5 right-2.5 bg-blue-500 text-white text-[0.625rem] font-bold uppercase tracking-[0.05em] px-2 py-1 rounded-[6px] shadow-[0_2px_4px_rgba(0,0,0,0.2)]">Modified</span>}
      </div>
      <div className="flex flex-col px-1 pb-1">
        <div className="text-[0.9375rem] font-semibold text-[#0f0f0f] tracking-[-0.01em]">{def.label}</div>
        <div className="text-[0.8125rem] text-[#666] leading-[1.5] mt-1 mb-4">{def.description}</div>
        <div className="flex items-center gap-2 mt-auto">
          <button className="flex-1 px-3 py-2 bg-white text-[#0f0f0f] border border-[#e8e8e8] rounded-lg text-[0.8125rem] font-medium hover:bg-[#f9f9f9] transition-colors" onClick={() => inputRef.current?.click()}>
            ↑ Replace
          </button>
          {isOverridden && (
            <button className="px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg text-[0.8125rem] font-medium hover:bg-red-50 hover:border-red-300 transition-colors" onClick={onReset}>
              Reset
            </button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}

export default function AssetsManager() {
  const { assets, updateAsset, resetAsset } = useAdmin()

  const modifiedCount = SITE_ASSETS.filter(({ key }) => assets[key]).length

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
        ℹ️ Replaced images are saved in your browser (localStorage). They will be shown on the public site immediately.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SITE_ASSETS.map((def) => (
          <AssetCard
            key={def.key}
            def={def}
            src={resolveAsset(assets, def.key, def.fallback)}
            onReplace={(b64) => updateAsset(def.key, b64)}
            onReset={() => resetAsset(def.key)}
          />
        ))}
      </div>
    </div>
  )
}
