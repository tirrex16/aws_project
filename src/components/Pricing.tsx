import { useState, useRef, useEffect } from 'react'

type PlanKey = 'monthly' | 'project'
interface Plan { type: string; price: string; period: string; desc: string; addon: string; delivery: string }

const plans: Record<PlanKey, Plan> = {
  monthly: { type: 'Subscription', price: '$2500', period: '/month', desc: 'For ongoing support and flexible design needs. Ideal for startups, growing brands, and marketing teams needing consistent creative support.', addon: '($800/m) SEO optimization Add-on.', delivery: '48 hours' },
  project: { type: 'Project Based', price: '$5000', period: '/project', desc: 'For focused, one-time design projects. Perfect for brands that need a complete design solution delivered as a cohesive package.', addon: '($1200) SEO optimization Add-on.', delivery: '2-4 weeks' },
}

const features = [
  'Unlimited design requests', 'One active task at a time', 'Weekly progress calls',
  'Fast turnaround times', 'Brand consistency across all deliverables', 'Priority support', 'Pause or cancel anytime',
]

export default function Pricing() {
  const ref = useRef<HTMLElement>(null)
  const [tab, setTab]         = useState<PlanKey>('monthly')
  const [addonOn, setAddonOn] = useState(false)

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }) },
      { threshold: 0.05 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const plan = plans[tab]

  return (
    <section className="max-w-[1560px] mx-auto px-10 py-[120px]" id="pricing" ref={ref}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12 reveal">
        <div>
          <h2 className="text-[clamp(2.25rem,6vw,5rem)] font-extrabold tracking-[-0.045em] leading-none">Pricing Plans.</h2>
          <p className="text-sm text-[#999999] leading-[1.6] mt-2.5" style={{ maxWidth: 280 }}>
            Simple, transparent plans that grow with your business.
          </p>
        </div>
        <span className="text-[0.8125rem] text-[#999999]">(06)</span>
      </div>

      {/* Tabs */}
      <div className="flex justify-end mb-8 reveal">
        <div className="flex bg-[#f5f5f5] rounded-full p-[3px]">
          {(['monthly', 'project'] as PlanKey[]).map((key) => (
            <button key={key} onClick={() => setTab(key)}
              className={`text-[0.8125rem] font-medium px-5 py-2 rounded-full cursor-pointer transition-all tracking-[-0.01em] whitespace-nowrap border-0 ${
                tab === key ? 'bg-[#0f0f0f] text-white' : 'text-[#999999] hover:text-[#0f0f0f] bg-transparent'
              }`}>
              {key === 'monthly' ? 'Monthly' : 'Project based'}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 border border-[#e8e8e8] rounded-[20px] overflow-hidden reveal">
        {/* Left — price card */}
        <div className="p-9 flex flex-col justify-between border-r border-[#e8e8e8]">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{plan.type}</span>
              <span className="text-[0.8125rem] text-[#999999]">Kanso®</span>
            </div>
            <div className="text-[2.5rem] font-extrabold tracking-[-0.04em] leading-none mb-1">
              {plan.price} <span className="text-base font-normal text-[#999999]">{plan.period}</span>
            </div>
            <p className="text-[0.8125rem] text-[#999999] leading-[1.6] mt-4" style={{ maxWidth: 320, margin: '16px 0 0' }}>{plan.desc}</p>
          </div>
          <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#e8e8e8]">
            <span className="text-xs text-[#999999] flex items-center gap-1.5">◎ {plan.addon}</span>
            <button onClick={() => setAddonOn(!addonOn)} aria-label="Toggle SEO addon"
              className={`relative w-9 h-5 rounded-full transition-colors shrink-0 border-0 cursor-pointer ${addonOn ? 'bg-[#0f0f0f]' : 'bg-[#e8e8e8]'}`}>
              <span className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 bg-white rounded-full transition-transform inline-block ${addonOn ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Right — features */}
        <div className="p-9 flex flex-col justify-between">
          <div>
            <div className="text-[0.8125rem] text-[#999999] mb-5">What's included:</div>
            <div className="flex flex-col gap-3.5">
              {features.map((f, i) => (
                <span key={i} className="text-sm font-medium flex items-center gap-2.5 tracking-[-0.01em]">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#0f0f0f] shrink-0 inline-block" />
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#e8e8e8]">
            <div>
              <div className="text-xs text-[#999999]">Estimated delivery:</div>
              <div className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{plan.delivery}</div>
            </div>
            <button className="inline-flex items-center gap-1.5 text-sm font-medium px-7 py-3 bg-[#999999] text-white rounded-full tracking-[-0.01em] hover:bg-[#0f0f0f] transition-colors cursor-pointer border-0">
              Get started +
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
