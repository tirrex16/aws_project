import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext.tsx'
import type { PricingContent } from '../../data/siteContent.ts'

export default function PricingEditor() {
  const { siteContent, updateSiteContent } = useAdmin()
  const [form, setForm] = useState<PricingContent>({
    ...siteContent.pricing,
    monthly: { ...siteContent.pricing.monthly },
    project: { ...siteContent.pricing.project },
    features: [...siteContent.pricing.features],
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await updateSiteContent('pricing', form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updatePlan = (plan: 'monthly' | 'project', field: string, value: string) => {
    setForm({ ...form, [plan]: { ...form[plan], [field]: value } })
  }

  const updateFeature = (idx: number, value: string) => {
    const features = [...form.features]
    features[idx] = value
    setForm({ ...form, features })
  }

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ''] })
  }

  const removeFeature = (idx: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) })
  }

  const PlanFields = ({ planKey, label }: { planKey: 'monthly' | 'project'; label: string }) => {
    const plan = form[planKey]
    return (
      <div className="bg-white border border-[#e8e8e8] rounded-[20px] p-6 flex flex-col gap-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <h3 className="text-[1rem] font-bold tracking-[-0.01em] text-[#0f0f0f] border-b border-[#e8e8e8] pb-3">{label}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Plan Type</label>
            <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={plan.type} onChange={(e) => updatePlan(planKey, 'type', e.target.value)} placeholder="e.g. Subscription" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Price</label>
            <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={plan.price} onChange={(e) => updatePlan(planKey, 'price', e.target.value)} placeholder="$2500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Period</label>
            <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={plan.period} onChange={(e) => updatePlan(planKey, 'period', e.target.value)} placeholder="/month" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Delivery Time</label>
            <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={plan.delivery} onChange={(e) => updatePlan(planKey, 'delivery', e.target.value)} placeholder="48 hours" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Description</label>
          <textarea rows={3} className="w-full p-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors resize-y" value={plan.desc} onChange={(e) => updatePlan(planKey, 'desc', e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[0.8125rem] font-semibold text-[#0f0f0f]">Add-on Text</label>
          <input className="w-full h-11 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-[0.9375rem] text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={plan.addon} onChange={(e) => updatePlan(planKey, 'addon', e.target.value)} />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-[#e8e8e8]">
        <div>
          <h1 className="text-[2rem] font-extrabold tracking-[-0.03em] leading-none mb-2">Pricing Section</h1>
          <p className="text-[0.9375rem] text-[#666]">Edit pricing plans and features</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#0f0f0f] text-white rounded-xl text-sm font-semibold hover:bg-[#333] transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save changes'}
        </button>
      </div>

      <div className="max-w-[800px] flex flex-col gap-8">
        <PlanFields planKey="monthly" label="Monthly Plan" />
        <PlanFields planKey="project" label="Project-Based Plan" />

        {/* Features */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3">
            <h2 className="text-[1.25rem] font-bold tracking-[-0.02em]">Included Features</h2>
            <button type="button" onClick={addFeature} className="text-sm font-semibold text-[#3b5bdb] hover:bg-[#eff3ff] px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#c3d2f9]">+ Add feature</button>
          </div>
          {form.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-[#0f0f0f] shrink-0" />
              <input className="flex-1 h-10 px-4 bg-[#f9f9f9] border border-[#e8e8e8] hover:border-[#ccc] rounded-xl text-sm text-[#0f0f0f] outline-none focus:border-[#0f0f0f] focus:bg-white transition-colors" value={f} onChange={(e) => updateFeature(i, e.target.value)} />
              {form.features.length > 1 && (
                <button onClick={() => removeFeature(i)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#888] hover:text-red-600 hover:bg-red-50 transition-colors shrink-0">✕</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
