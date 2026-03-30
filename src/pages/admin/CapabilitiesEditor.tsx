import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext.tsx'
import type { CapabilitiesContent } from '../../data/siteContent.ts'
import InlineImageUpload from './InlineImageUpload.tsx'

export default function CapabilitiesEditor() {
  const { siteContent, updateSiteContent } = useAdmin()
  const [form, setForm] = useState<CapabilitiesContent>({ ...siteContent.capabilities })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateSiteContent('capabilities', form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateFeature = (idx: number, field: keyof typeof form.features[0], value: string) => {
    const features = [...form.features]
    features[idx] = { ...features[idx], [field]: value }
    setForm({ ...form, features })
  }

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, { icon: '★', title: '', desc: '' }] })
  }

  const removeFeature = (idx: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) })
  }

  const updateBullet = (idx: number, value: string) => {
    const bullets = [...form.darkCard.bullets]
    bullets[idx] = value
    setForm({ ...form, darkCard: { ...form.darkCard, bullets } })
  }

  const addBullet = () => {
    setForm({ ...form, darkCard: { ...form.darkCard, bullets: [...form.darkCard.bullets, ''] } })
  }

  const removeBullet = (idx: number) => {
    setForm({ ...form, darkCard: { ...form.darkCard, bullets: form.darkCard.bullets.filter((_, i) => i !== idx) } })
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#e8e8e8]">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none mb-2">Why Us Section</h1>
          <p className="text-[0.9375rem] text-[#666]">Edit the Capabilities / Why Us section content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-[#0f0f0f] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
        </button>
      </div>

      <div className="max-w-[800px] flex flex-col gap-10">
        {/* Headline */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] border-b border-[#e8e8e8] pb-3">Headline</h2>
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Main text</label>
            <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Highlighted text (gray)</label>
            <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={form.headlineHighlight} onChange={(e) => setForm({ ...form, headlineHighlight: e.target.value })} />
          </div>
        </div>

        {/* Dark Card */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] border-b border-[#e8e8e8] pb-3">Dark Card</h2>
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Title (use \n for line break)</label>
            <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={form.darkCard.title} onChange={(e) => setForm({ ...form, darkCard: { ...form.darkCard, title: e.target.value } })} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Bullet Points</label>
              <button type="button" onClick={addBullet} className="text-sm font-semibold text-[#3b5bdb] hover:bg-[#eff3ff] px-3 py-1 rounded-lg transition-colors">+ Add</button>
            </div>
            {form.darkCard.bullets.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="flex-1 h-10 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={b} onChange={(e) => updateBullet(i, e.target.value)} />
                <button onClick={() => removeBullet(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] border-b border-[#e8e8e8] pb-3">Rating Card</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Score</label>
              <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={form.rating.score} onChange={(e) => setForm({ ...form, rating: { ...form.rating, score: e.target.value } })} placeholder="4.9/5" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Client count</label>
              <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={form.rating.clientCount} onChange={(e) => setForm({ ...form, rating: { ...form.rating, clientCount: e.target.value } })} placeholder="100+" />
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] border-b border-[#e8e8e8] pb-3">Testimonial</h2>
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Quote</label>
            <textarea rows={3} className="w-full p-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors resize-y" value={form.testimonial.quote} onChange={(e) => setForm({ ...form, testimonial: { ...form.testimonial, quote: e.target.value } })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Name</label>
              <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={form.testimonial.name} onChange={(e) => setForm({ ...form, testimonial: { ...form.testimonial, name: e.target.value } })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Role</label>
              <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={form.testimonial.role} onChange={(e) => setForm({ ...form, testimonial: { ...form.testimonial, role: e.target.value } })} />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.02em]">Feature Cards</h2>
            <button type="button" onClick={addFeature} className="text-sm font-semibold text-[#3b5bdb] hover:bg-[#eff3ff] px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#c3d2f9]">+ Add card</button>
          </div>
          {form.features.map((f, i) => (
            <div key={i} className="bg-white border border-[#e8e8e8] rounded-[20px] p-6 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#888] bg-[#f5f5f5] px-2 py-1 rounded">CARD {i + 1}</span>
                {form.features.length > 1 && (
                  <button onClick={() => removeFeature(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors">✕</button>
                )}
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Icon</label>
                  <input className="w-full h-11 px-3 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-center text-lg outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={f.icon} onChange={(e) => updateFeature(i, 'icon', e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Title</label>
                  <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={f.title} onChange={(e) => updateFeature(i, 'title', e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Description</label>
                <textarea rows={2} className="w-full p-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors resize-y" value={f.desc} onChange={(e) => updateFeature(i, 'desc', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        {/* Section Images */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] border-b border-[#e8e8e8] pb-3">Section Images</h2>
          <div className="grid grid-cols-2 gap-4">
            <InlineImageUpload assetKey="bento_building" label="Bento Building" />
            <InlineImageUpload assetKey="bento_silhouette" label="Bento Silhouette" />
          </div>
        </div>

        {/* General Site Images */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[1.25rem] font-bold tracking-[-0.02em] border-b border-[#e8e8e8] pb-3">General Site Images</h2>
          <p className="text-[0.8125rem] text-[#888] -mt-2">These images are used in the Header and About sections of the landing page.</p>
          <div className="grid grid-cols-2 gap-4">
            <InlineImageUpload assetKey="hero_bg" label="Nav Overlay Background" />
            <InlineImageUpload assetKey="showreel" label="About Showreel" />
          </div>
        </div>
      </div>
    </div>
  )
}
