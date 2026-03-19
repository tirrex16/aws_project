import { useRef, useEffect } from 'react'

export default function Capabilities() {
  const ref = useRef<HTMLElement>(null)

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
    <section className="max-w-[1560px] mx-auto px-10 py-[120px]" id="why" ref={ref}>
      {/* Meta */}
      <div className="flex items-center justify-between mb-12 reveal">
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">/Why us</span>
        <span className="text-[0.8125rem] text-[#999999]">(03)</span>
      </div>

      <h2 className="text-[clamp(1.5rem,3.2vw,2.5rem)] font-bold tracking-[-0.03em] leading-[1.25] mb-10 max-w-[760px] reveal">
        We cut through noise to create designs that are{' '}
        <span className="text-[#999999]">thoughtful, timeless, and impactful.</span>
      </h2>

      {/* Bento grid */}
      <div className="grid grid-cols-4 gap-3 reveal">

        {/* Col 1 — dark card (spans 2 rows) */}
        <div className="row-span-2 bg-[#1a1a1a] rounded-[20px] overflow-hidden relative min-h-[360px] flex flex-col justify-end p-7">
          <img src="/images/bento-building.png" alt="Studio" className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale" />
          <div className="relative z-10">
            <div className="text-lg font-bold text-white leading-[1.35] mb-5">Purposeful Design<br />for Modern Brands.</div>
            <ul className="flex flex-col gap-1.5 mb-6" style={{ padding: 0, listStyle: 'none', margin: '0 0 24px 0' }}>
              {['Collaborative Approach', 'Quick turnaround', 'Clear Communication', 'Consistent Quality', 'Reliable Support'].map((t, i) => (
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
          <div className="flex items-center">
            {['A', 'B', 'C'].map((l, k) => (
              <div key={k} className={`w-[34px] h-[34px] rounded-full border-2 border-white overflow-hidden shrink-0${k !== 0 ? ' -ml-[9px]' : ''}`}>
                <div className="w-full h-full flex items-center justify-center text-[0.6875rem] font-bold text-white" style={{ background: avGradients[k] }}>{l}</div>
              </div>
            ))}
            <span className="text-sm font-bold ml-2.5">4.9/5 <span className="text-[#f59e0b] text-xs">★</span></span>
          </div>
          <div className="text-[0.8125rem] text-[#999999]">
            <span className="text-[#2f9e44] font-semibold">100+</span> Happy clients worldwide
          </div>
        </div>

        {/* Col 2 row 2 — Testimonial */}
        <div className="border border-[#e8e8e8] rounded-[20px] p-6">
          <div className="text-[#f59e0b] text-[0.8125rem] mb-3">★★★★★</div>
          <p className="text-[0.8125rem] leading-[1.65] text-[#0f0f0f] mb-4" style={{ margin: '0 0 16px 0' }}>
            "Kanso understood our brand better than we did. Their ability to find the essential and express it simply is what sets them apart."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }} />
            <div>
              <div className="text-[0.8125rem] font-semibold tracking-[-0.01em]">Sofia Ford</div>
              <div className="text-xs text-[#999999]">Founder</div>
            </div>
          </div>
        </div>

        {/* Col 3 — 3 feature cards */}
        {[
          { ico: '⚡', title: 'Streamlined Process', desc: 'Our focused, step-by-step approach saves time and keeps projects moving smoothly.' },
          { ico: '↗', title: 'Scalable Design', desc: 'We create systems that grow with your brand and stay effective over time.' },
          { ico: '◎', title: '24/7 Dedicated Support', desc: "We're always here when you need us, ready to answer questions and provide updates." },
        ].map((f, i) => (
          <div key={i} className="border border-[#e8e8e8] rounded-[20px] p-6">
            <div className="w-8 h-8 bg-[#f5f5f5] rounded-lg flex items-center justify-center text-[0.9375rem] mb-3.5">{f.ico}</div>
            <div className="text-[0.9375rem] font-semibold tracking-[-0.015em] mb-2">{f.title}</div>
            <p className="text-[0.8125rem] text-[#999999] leading-[1.6]" style={{ margin: 0 }}>{f.desc}</p>
          </div>
        ))}

        {/* Col 4 — image (spans 3 rows) */}
        <div className="rounded-[20px] overflow-hidden relative min-h-[360px]" style={{ gridColumn: 4, gridRow: '1 / 4' }}>
          <img src="/images/bento-silhouette.png" alt="Design with intent" className="w-full h-full object-cover grayscale" />
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
