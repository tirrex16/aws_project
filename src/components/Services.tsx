import { useState, useRef, useEffect } from 'react'

interface ServiceItem { name: string; num: string; desc: string; thumb: string; tags: string[] }

const items: ServiceItem[] = [
  { name: 'Brand Identity', num: '1', desc: 'We craft cohesive brand systems that communicate who you are with clarity and intention, from the core idea to every visual expression.', thumb: '/images/project-1.png', tags: ['Logo Design', 'Visual Identity Systems', 'Brand Guidelines', 'Typography & Color Systems', 'Naming & Tone of Voice', 'Brand Strategy'] },
  { name: 'Digital Design', num: '2', desc: 'Creating stunning digital experiences that blend aesthetics with functionality, from responsive websites to interactive applications.', thumb: '/images/project-2.png', tags: ['Web Design', 'UI/UX Design', 'Responsive Design', 'Prototyping', 'Design Systems', 'Interaction Design'] },
  { name: 'Art Direction', num: '3', desc: 'Guiding the visual narrative of your brand through thoughtful creative direction that ensures consistency across all touchpoints.', thumb: '/images/project-3.png', tags: ['Creative Direction', 'Visual Strategy', 'Photography Direction', 'Campaign Design', 'Editorial Design'] },
  { name: 'Strategy & Consulting', num: '4', desc: 'Strategic consulting to help you define your brand positioning, understand your audience, and craft meaningful brand experiences.', thumb: '/images/project-4.png', tags: ['Brand Positioning', 'Market Research', 'Audience Analysis', 'Content Strategy', 'Growth Strategy'] },
]

export default function Services() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

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
    <div className="max-w-[1560px] mx-auto px-10 pb-[120px]" id="services" ref={ref}>
      <div className="bg-[#0f0f0f] rounded-[28px] px-14 py-[52px] reveal">
        {/* Meta */}
        <div className="flex items-center justify-between pb-3 mb-0 border-b border-white/[0.07]">
          <span className="text-[0.8125rem] font-medium text-white/[0.38] tracking-[-0.01em]">/Services</span>
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
                    <img src={s.thumb} alt={s.name} className="w-20 shrink-0 rounded-lg object-cover grayscale" style={{ height: 60 }} />
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
