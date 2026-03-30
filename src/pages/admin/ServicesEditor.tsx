import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext.tsx'
import type { ServicesContent, ServiceItem } from '../../data/siteContent.ts'
import InlineImageUpload from './InlineImageUpload.tsx'

export default function ServicesEditor() {
  const { siteContent, updateSiteContent } = useAdmin()
  const [form, setForm] = useState<ServicesContent>({ ...siteContent.services, items: siteContent.services.items.map(i => ({ ...i, tags: [...i.tags] })) })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateSiteContent('services', form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateItem = (idx: number, field: keyof ServiceItem, value: any) => {
    const items = [...form.items]
    items[idx] = { ...items[idx], [field]: value }
    setForm({ ...form, items })
  }

  const addItem = () => {
    const num = String(form.items.length + 1)
    setForm({ ...form, items: [...form.items, { name: '', num, desc: '', tags: [] }] })
  }

  const removeItem = (idx: number) => {
    const items = form.items.filter((_, i) => i !== idx).map((item, i) => ({ ...item, num: String(i + 1) }))
    setForm({ ...form, items })
  }

  const updateTag = (itemIdx: number, tagIdx: number, value: string) => {
    const items = [...form.items]
    const tags = [...items[itemIdx].tags]
    tags[tagIdx] = value
    items[itemIdx] = { ...items[itemIdx], tags }
    setForm({ ...form, items })
  }

  const addTag = (itemIdx: number) => {
    const items = [...form.items]
    items[itemIdx] = { ...items[itemIdx], tags: [...items[itemIdx].tags, ''] }
    setForm({ ...form, items })
  }

  const removeTag = (itemIdx: number, tagIdx: number) => {
    const items = [...form.items]
    items[itemIdx] = { ...items[itemIdx], tags: items[itemIdx].tags.filter((_, i) => i !== tagIdx) }
    setForm({ ...form, items })
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#e8e8e8]">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none mb-2">Services Section</h1>
          <p className="text-[0.9375rem] text-[#666]">{form.items.length} services configured</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addItem} className="px-5 py-2.5 bg-white border border-[#e8e8e8] text-[#0f0f0f] rounded-xl text-sm font-semibold hover:bg-[#f5f5f5] transition-colors">+ Add service</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#0f0f0f] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="max-w-[800px] flex flex-col gap-6">
        {form.items.map((item, i) => (
          <div key={i} className="bg-white border border-[#e8e8e8] rounded-[24px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between bg-[#f9f9f9] px-8 py-4 border-b border-[#e8e8e8]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#888] bg-white px-2 py-1 rounded border border-[#e8e8e8]">#{item.num}</span>
                <span className="font-bold text-[#0f0f0f]">{item.name || 'Untitled Service'}</span>
              </div>
              {form.items.length > 1 && (
                <button onClick={() => removeItem(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors">✕</button>
              )}
            </div>
            <div className="p-8 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Service Name</label>
                  <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="e.g. Brand Identity" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Number</label>
                  <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={item.num} onChange={(e) => updateItem(i, 'num', e.target.value)} placeholder="1" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Description</label>
                <textarea rows={3} className="w-full p-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors resize-y" value={item.desc} onChange={(e) => updateItem(i, 'desc', e.target.value)} placeholder="Describe this service..." />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Tags</label>
                  <button type="button" onClick={() => addTag(i)} className="text-xs font-semibold text-[#3b5bdb] hover:bg-[#eff3ff] px-2 py-1 rounded transition-colors">+ Add tag</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, t) => (
                    <div key={t} className="flex items-center gap-1 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg pl-3 pr-1 py-1">
                      <input className="bg-transparent text-xs font-medium text-[#0f0f0f] outline-none w-[120px]" value={tag} onChange={(e) => updateTag(i, t, e.target.value)} placeholder="Tag name" />
                      <button onClick={() => removeTag(i, t)} className="w-5 h-5 flex items-center justify-center rounded text-[#888] hover:text-red-600 text-xs">✕</button>
                    </div>
                  ))}
                </div>
              </div>
              <InlineImageUpload assetKey={`project_${i + 1}`} label="Thumbnail Image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
