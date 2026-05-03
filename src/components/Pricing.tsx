import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '../context/AdminContext.tsx'

type PlanKey = 'monthly' | 'project'

export default function Pricing() {
  const ref = useRef<HTMLElement>(null)
  const [tab, setTab]         = useState<PlanKey>('monthly')
  const [addonOn, setAddonOn] = useState(false)
  const { siteContent } = useAdmin()
  const content = siteContent.pricing

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

  const plan = content[tab]
  const planLabel = tab === 'monthly' ? 'Monthly' : 'Project based'

  return (
    <section className="max-w-[1560px] mx-auto px-5 md:px-10 py-[42px]" id="pricing" ref={ref} aria-labelledby="pricing-heading">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 reveal">
        <div>
          <h2 id="pricing-heading" className="text-[clamp(2.25rem,6vw,5rem)] font-extrabold tracking-[-0.045em] leading-none">Pricing Plans.</h2>
          <p className="text-sm text-[#999999] leading-[1.6] mt-2.5" style={{ maxWidth: 280 }}>
            Simple, transparent plans that grow with your business.
          </p>
        </div>
      </div>

      {/* Tabs — WCAG 4.1.2: role=tablist/tab/tabpanel */}
      <div className="flex justify-end mb-8 reveal">
        <div role="tablist" aria-label="Pricing plan type" className="flex bg-[#f5f5f5] rounded-full p-[3px]">
          {(['monthly', 'project'] as PlanKey[]).map((key) => (
            <button
              key={key}
              role="tab"
              id={`tab-${key}`}
              aria-selected={tab === key}
              aria-controls={`tabpanel-pricing`}
              onClick={() => setTab(key)}
              className={`text-[0.8125rem] font-medium px-5 py-2 rounded-full cursor-pointer transition-all tracking-[-0.01em] whitespace-nowrap border-0 ${
                tab === key ? 'bg-[#0f0f0f] text-white' : 'text-[#999999] hover:text-[#0f0f0f] bg-transparent'
              }`}
            >
              {key === 'monthly' ? 'Monthly' : 'Project based'}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid — WCAG 4.1.2: tabpanel */}
      <div
        id="tabpanel-pricing"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="grid grid-cols-1 md:grid-cols-2 border border-[#e8e8e8] rounded-[20px] overflow-hidden reveal"
      >
        {/* Left — price card */}
        <div className="p-6 md:p-9 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#e8e8e8]">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{plan.type}</span>
              {/* aria-hidden: decorative brand name */}
              <span aria-hidden="true" className="text-[0.8125rem] text-[#999999]">tirrex®</span>
            </div>
            <div className="text-[2.5rem] font-extrabold tracking-[-0.04em] leading-none mb-1">
              {plan.price} <span className="text-base font-normal text-[#999999]">{plan.period}</span>
            </div>
            <p className="text-[0.8125rem] text-[#999999] leading-[1.6] mt-4" style={{ maxWidth: 320, margin: '16px 0 0' }}>{plan.desc}</p>
          </div>
          <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#e8e8e8]">
            {/* Associate label text with toggle via id */}
            <span id="addon-label" className="text-xs text-[#999999] flex items-center gap-1.5">
              <span aria-hidden="true">◎</span> {plan.addon}
            </span>
            {/* WCAG 4.1.2: role=switch + aria-checked for toggle */}
            <button
              role="switch"
              aria-checked={addonOn}
              aria-labelledby="addon-label"
              onClick={() => setAddonOn(!addonOn)}
              className={`relative w-9 h-5 rounded-full transition-colors shrink-0 border-0 cursor-pointer ${addonOn ? 'bg-[#0f0f0f]' : 'bg-[#e8e8e8]'}`}
            >
              <span className={`absolute top-[3px] left-[3px] w-3.5 h-3.5 bg-white rounded-full transition-transform inline-block ${addonOn ? 'translate-x-4' : 'translate-x-0'}`} aria-hidden="true" />
              {/* SR-only state announcement */}
              <span className="sr-only">{addonOn ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>
        </div>

        {/* Right — features */}
        <div className="p-6 md:p-9 flex flex-col justify-between">
          <div>
            <div className="text-[0.8125rem] text-[#999999] mb-5" id="features-label">What's included:</div>
            <ul className="flex flex-col gap-3.5" aria-labelledby="features-label">
              {content.features.map((f, i) => (
                <li key={i} className="text-sm font-medium flex items-center gap-2.5 tracking-[-0.01em]">
                  {/* Decorative dot: aria-hidden */}
                  <span aria-hidden="true" className="w-[6px] h-[6px] rounded-full bg-[#0f0f0f] shrink-0 inline-block" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-5 border-t border-[#e8e8e8]">
            <div>
              <div className="text-xs text-[#999999]">Estimated delivery:</div>
              <div className="text-[0.9375rem] font-semibold tracking-[-0.01em]">{plan.delivery}</div>
            </div>
            {/* WCAG 2.4.6: Descriptive button label */}
            <button
              aria-label={`Get started with the ${planLabel} plan`}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-7 py-3 bg-[#999999] text-white rounded-full tracking-[-0.01em] hover:bg-[#0f0f0f] transition-colors cursor-pointer border-0"
            >
              Get started +
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
