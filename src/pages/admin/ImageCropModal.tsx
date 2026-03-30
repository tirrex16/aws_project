import { useState, useRef, useCallback, useEffect } from 'react'
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropModalProps {
  file: File
  onConfirm: (croppedFile: File) => void
  onCancel: () => void
  aspectRatio?: number   // optional fixed aspect ratio
}

function getCroppedCanvas(
  image: HTMLImageElement,
  crop: PixelCrop
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = Math.floor(crop.width * scaleX)
  canvas.height = Math.floor(crop.height * scaleY)

  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  )
  return canvas
}

export default function ImageCropModal({
  file,
  onConfirm,
  onCancel,
  aspectRatio,
}: ImageCropModalProps) {
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [processing, setProcessing] = useState(false)
  const [zoom, setZoom] = useState(100)

  // Load file into data URL
  useEffect(() => {
    const reader = new FileReader()
    reader.onload = () => setImgSrc(reader.result as string)
    reader.readAsDataURL(file)
  }, [file])

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      // Default crop: center 80% of image
      const cropW = width * 0.8
      const cropH = aspectRatio ? cropW / aspectRatio : height * 0.8
      const x = (width - cropW) / 2
      const y = (height - Math.min(cropH, height * 0.9)) / 2
      setCrop({
        unit: 'px',
        x,
        y,
        width: cropW,
        height: Math.min(cropH, height * 0.9),
      })
    },
    [aspectRatio]
  )

  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop) return
    setProcessing(true)
    try {
      const canvas = getCroppedCanvas(imgRef.current, completedCrop)
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))),
          file.type.startsWith('image/png') ? 'image/png' : 'image/jpeg',
          0.92
        )
      )
      const ext = file.name.split('.').pop() ?? 'jpg'
      const croppedFile = new File(
        [blob],
        `cropped-${Date.now()}.${ext}`,
        { type: blob.type }
      )
      onConfirm(croppedFile)
    } catch {
      alert('Failed to crop image')
    } finally {
      setProcessing(false)
    }
  }

  const handleSkip = () => {
    onConfirm(file) // use original without cropping
  }

  if (!imgSrc) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="w-full max-w-[900px] flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white text-lg font-bold tracking-[-0.02em]">
            Crop & Resize
          </h2>
          <p className="text-white/50 text-sm mt-0.5">
            Drag corners to adjust the crop area
          </p>
        </div>
        <button
          onClick={onCancel}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      {/* Crop area */}
      <div
        className="flex-1 w-full max-w-[900px] max-h-[60vh] flex items-center justify-center bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative"
      >
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          className="max-h-[60vh]"
        >
          <img
            ref={imgRef}
            src={imgSrc}
            alt="Crop preview"
            onLoad={onImageLoad}
            style={{
              maxHeight: '60vh',
              maxWidth: '100%',
              objectFit: 'contain',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease',
            }}
          />
        </ReactCrop>
      </div>

      {/* Zoom slider */}
      <div className="w-full max-w-[900px] flex items-center gap-4 mt-4 px-2">
        <span className="text-white/50 text-xs font-medium min-w-[28px]">−</span>
        <input
          type="range"
          min={50}
          max={200}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-white h-1 cursor-pointer"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ${((zoom - 50) / 150) * 100}%, rgba(255,255,255,0.15) ${((zoom - 50) / 150) * 100}%, rgba(255,255,255,0.15) 100%)`,
            borderRadius: 4,
            WebkitAppearance: 'none',
            appearance: 'none',
            outline: 'none',
          }}
        />
        <span className="text-white/50 text-xs font-medium min-w-[28px] text-right">+</span>
        <span className="text-white/40 text-xs min-w-[40px] text-right">{zoom}%</span>
      </div>

      {/* Actions */}
      <div className="w-full max-w-[900px] flex items-center justify-between mt-6">
        <button
          onClick={handleSkip}
          className="px-5 py-2.5 text-white/60 text-sm font-medium hover:text-white/90 transition-colors"
        >
          Skip (use original)
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl font-medium text-sm transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={processing || !completedCrop}
            className="px-6 py-2.5 bg-white text-[#0f0f0f] rounded-xl font-semibold text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" />
                Processing…
              </>
            ) : (
              'Apply Crop'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
