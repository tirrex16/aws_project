import { useRef, useState, type ChangeEvent } from 'react'
import { useAdmin, resolveAsset } from '../../context/AdminContext.tsx'
import ImageCropModal from './ImageCropModal.tsx'

interface InlineImageUploadProps {
  assetKey: string
  label: string
  fallback?: string
}

export default function InlineImageUpload({ assetKey, label, fallback = '/images/placeholder-photo.svg' }: InlineImageUploadProps) {
  const { assets, updateAsset, resetAsset } = useAdmin()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [cropFile, setCropFile] = useState<File | null>(null)

  const src = resolveAsset(assets, assetKey, fallback)
  const isOverridden = !!assets[assetKey]

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
      await updateAsset(assetKey, croppedFile)
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
    setUploading(true)
    try {
      await resetAsset(assetKey)
    } finally {
      setUploading(false)
    }
  }

  const getAspectRatio = (key: string) => {
    if (key.startsWith('project_')) return 4 / 3
    if (key.startsWith('work_')) return 16 / 10
    if (key === 'hero_bg' || key === 'showreel') return 16 / 9
    if (key.startsWith('bento_')) return 3 / 4
    return undefined
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">{label}</label>
        <div className={`relative rounded-xl overflow-hidden border ${isOverridden ? 'border-blue-400' : 'border-[#e8e8e8]'} bg-[#f5f5f5] group`} style={{ height: 140 }}>
          <img src={src} alt={label} className="w-full h-full object-cover" />
          {isOverridden && (
            <span className="absolute top-2 right-2 bg-blue-500 text-white text-[0.5625rem] font-bold uppercase tracking-[0.05em] px-1.5 py-0.5 rounded shadow">Modified</span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-white text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/30 hover:bg-white/30 transition-colors"
            >
              {uploading ? 'Uploading…' : isOverridden ? 'Change' : 'Upload'}
            </button>
            {isOverridden && (
              <button
                type="button"
                onClick={handleReset}
                disabled={uploading}
                className="text-white text-xs font-semibold bg-red-500/50 px-3 py-1.5 rounded-lg backdrop-blur-md border border-red-300/30 hover:bg-red-500/70 transition-colors"
              >
                Reset
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
          aspectRatio={getAspectRatio(assetKey)}
        />
      )}
    </>
  )
}
