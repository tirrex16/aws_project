import { useRef, useEffect } from 'react'
import { useAdmin, resolveAsset } from '../context/AdminContext.tsx'

export default function Capabilities() {
  const ref = useRef<HTMLElement>(null)
  const { assets, siteContent } = useAdmin()
  const content = siteContent.capabilities

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }) },
      { threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const avGradients = [
    'linear-gradient(135deg,#818cf8,#6366f1)',
    'linear-gradient(135deg,#fb923c,#f97316)',
    'linear-gradient(135deg,#34d399,#10b981)',
  ]

  return (
    <section className="max-w-[1560px] mx-auto px-5 md:px-10 py-[42px]" id="why" ref={ref}>
      {/* Meta */}
      <div className="flex items-center justify-between mb-8 reveal">
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">Why us</span>
      </div>

      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold tracking-[-0.03em] leading-[1.25] mb-7 max-w-[760px] reveal">
        {content.headline}{' '}
        <span className="text-[#999999]">{content.headlineHighlight}</span>
      </h2>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 reveal">

        {/* Col 1 — dark card (spans 2 rows) */}
        <div className="lg:row-span-2 bg-[#1a1a1a] rounded-[20px] overflow-hidden relative min-h-[280px] lg:min-h-[360px] flex flex-col justify-end p-5 md:p-7">
          <img
            src={resolveAsset(assets, 'bento_building', '/images/placeholder-photo.svg')}
            alt="Studio"
            className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale"
          />
          <div className="relative z-10">
            <div className="text-lg font-bold text-white leading-[1.35] mb-5" dangerouslySetInnerHTML={{ __html: content.darkCard.title.replace(/\n/g, '<br/>') }} />
            <ul className="flex flex-col gap-1.5 mb-6" style={{ padding: 0, listStyle: 'none', margin: '0 0 24px 0' }}>
              {content.darkCard.bullets.map((t, i) => (
                <li key={i} className="text-xs text-white/65 flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full bg-white/35 shrink-0 inline-block" />{t}
                </li>
              ))}
            </ul>
            <a href="#contact" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-white bg-white/[0.12] border border-white/[0.18] px-4 py-[9px] rounded-full tracking-[-0.01em] hover:bg-white/20 transition-colors no-underline">
              Get started +
            </a>
            <div className="text-[0.625rem] text-white/30 mt-4 tracking-[0.04em]">© 2025</div>
          </div>
        </div>

        {/* Col 2 row 1 — Rating */}
        <div className="border border-[#e8e8e8] rounded-[20px] p-7 flex flex-col gap-3">
          {/* WCAG 1.1.1: aria-label on avatar group, aria-hidden on decorative initials */}
          <div className="flex items-center" aria-label="Customer avatars">
            {['A', 'B', 'C'].map((l, k) => (
              <div key={k} aria-hidden="true" className={`w-[34px] h-[34px] rounded-full border-2 border-white overflow-hidden shrink-0${k !== 0 ? ' -ml-[9px]' : ''}`}>
                <div className="w-full h-full flex items-center justify-center text-[0.6875rem] font-bold text-white" style={{ background: avGradients[k] }}>{l}</div>
              </div>
            ))}
            {/* WCAG 1.3.1: Semantic rating — SR reads "4.9 out of 5 stars" */}
            <span className="text-sm font-bold ml-2.5">
              {content.rating.score}
              <span aria-label="out of 5 stars" className="text-[#f59e0b] text-xs" aria-hidden="false"> ★</span>
              <span className="sr-only">out of 5 stars</span>
            </span>
          </div>
          <div className="text-[0.8125rem] text-[#999999]">
            <span className="text-[#2f9e44] font-semibold">{content.rating.clientCount}</span> Happy clients worldwide
          </div>
        </div>

        {/* Col 2 row 2 — Testimonial */}
        <div className="border border-[#e8e8e8] rounded-[20px] p-6">
          {/* aria-hidden on decorative stars; aria-label gives SR the semantic value */}
          <div className="text-[#f59e0b] text-[0.8125rem] mb-3" aria-label="5 out of 5 stars" role="img">
            <span aria-hidden="true">★★★★★</span>
          </div>
          <p className="text-[0.8125rem] leading-[1.65] text-[#0f0f0f] mb-4" style={{ margin: '0 0 16px 0' }}>
            {content.testimonial.quote}
          </p>
          <div className="flex items-center gap-2.5">
            {/* Decorative avatar placeholder */}
            <div aria-hidden="true" className="w-8 h-8 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }} />
            <div>
              <div className="text-[0.8125rem] font-semibold tracking-[-0.01em]">{content.testimonial.name}</div>
              <div className="text-xs text-[#999999]">{content.testimonial.role}</div>
            </div>
          </div>
        </div>

        {/* Col 3 — feature cards */}
        {content.features.map((f, i) => (
          <div key={i} className="border border-[#e8e8e8] rounded-[20px] p-6">
            {/* WCAG 1.1.1: emoji icon needs aria-hidden + text fallback */}
            <div aria-hidden="true" className="w-8 h-8 bg-[#f5f5f5] rounded-lg flex items-center justify-center text-[0.9375rem] mb-3.5">{f.icon}</div>
            <div className="text-[0.9375rem] font-semibold tracking-[-0.015em] mb-2">{f.title}</div>
            <p className="text-[0.8125rem] text-[#999999] leading-[1.6]" style={{ margin: 0 }}>{f.desc}</p>
          </div>
        ))}

        {/* Col 4 — image (spans 3 rows) */}
        <div className="md:col-span-2 lg:col-span-1 lg:col-start-4 lg:row-start-1 lg:row-end-4 rounded-[20px] overflow-hidden relative min-h-[200px] md:min-h-[280px] lg:min-h-[360px]">
          <img
            src={resolveAsset(assets, 'bento_silhouette', '/images/placeholder-photo.svg')}
            alt="Design with intent"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 45%)' }}>
            <span className="text-[0.6875rem] text-white/45 tracking-[0.08em] mb-[5px]">tirrex</span>
            <div className="text-lg font-bold text-white tracking-[-0.02em] mb-1">Design with intent.</div>
            <div className="text-[0.8125rem] text-white/55">No excess, no fluff.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
