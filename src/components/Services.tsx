import { useState, useRef, useEffect } from 'react'
import { useAdmin, resolveAsset } from '../context/AdminContext.tsx'

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const { assets, siteContent } = useAdmin()
  const items = siteContent.services.items

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

  return (
    <div className="max-w-[1560px] mx-auto px-5 md:px-10 py-[42px]" id="services" ref={ref}>
      <div className="bg-[#0f0f0f] rounded-[20px] md:rounded-[28px] px-5 py-7 md:px-14 md:py-[44px] reveal">
        {/* Meta */}
        <div className="flex items-center justify-between pb-3 mb-0 border-b border-white/[0.07]">
          <span className="text-[0.8125rem] font-medium text-white/[0.38] tracking-[-0.01em]">Services</span>
          <span className="text-[0.8125rem] text-white/25">(04)</span>
        </div>

        {/* List */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {items.map((s, i) => {
            const isActive = activeIndex === i
            return (
              <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }} className={`reveal reveal-d${i + 1}`}>
                <div
                  className="flex items-center justify-between py-[26px] cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => setActiveIndex(isActive ? -1 : i)}
                >
                  <span className="font-extrabold tracking-[-0.04em] text-white leading-none" style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}>
                    {s.name}
                  </span>
                  <span className="text-white leading-none transition-all duration-300"
                    style={{ fontSize: isActive ? '1.5rem' : 'clamp(1.75rem, 4.5vw, 3.5rem)', opacity: isActive ? 0.5 : 0.18 }}>
                    {isActive ? '×' : s.num}
                  </span>
                </div>
                <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isActive ? '400px' : '0', paddingBottom: isActive ? '32px' : '0' }}>
                  <div className="flex items-start gap-5 mb-5">
                    <img
                      src={resolveAsset(assets, `project_${i + 1}`, '/images/placeholder-photo.svg')}
                      alt={s.name}
                      className="w-20 shrink-0 rounded-lg object-cover grayscale"
                      style={{ height: 60 }}
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white tracking-[-0.03em] mb-3">{s.name}</h3>
                      <p className="text-sm text-white/55 leading-[1.65]" style={{ maxWidth: 460, margin: 0 }}>{s.desc}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {s.tags.map((tag, t) => (
                          <span key={t} className="text-xs font-medium text-white/70 border border-white/15 px-3 py-[5px] rounded-full whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 reveal">
          <a href="#contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#0f0f0f] bg-white px-[22px] py-2.5 rounded-full tracking-[-0.01em] hover:bg-[#f0f0f0] transition-colors no-underline">
            See pricing +
          </a>
        </div>
      </div>
    </div>
  )
}
