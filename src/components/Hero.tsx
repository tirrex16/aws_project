import { useRef, useEffect } from 'react'

interface SkillItem { kind: 'website' | 'figma' | 'photoshop' | 'illustrator' }
const highlights = [
  '7+ Years of Experience',
  '140+ Projects completed',
  '97% Customer satisfaction rate',
  'Fast Response Time',
]

const skills: SkillItem[] = [
  { kind: 'website' },
  { kind: 'figma' },
  { kind: 'photoshop' },
  { kind: 'illustrator' },
]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

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
    <section style={{ paddingTop: 'calc(52px + 80px)' }} ref={ref}>
      {/* Wordmark row */}
      <div className="flex items-start justify-between max-w-[1560px] mx-auto px-5 md:px-10 pt-8 pb-5 gap-6">
        <h1 className="text-[clamp(72px,13vw,200px)] font-black tracking-[-0.045em] leading-[0.92] text-[#0f0f0f] reveal">
          portfolio
          <span className="sr-only"> — Mohammed Winston, Freelance Designer &amp; Creative Studio</span>
        </h1>
      </div>

      {/* Skills ticker */}
      <div className="max-w-[1560px] mx-auto flex items-center px-5 md:px-10 overflow-hidden reveal" style={{ height: 44 }}>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center w-max" style={{ animation: 'ticker-roll 50s linear infinite' }}>
            {[...skills, ...skills, ...skills].map((item, i) => (
              <div key={`${item.kind}-${i}`} className="flex items-center mx-5 whitespace-nowrap">
                {item.kind === 'website' && (
                  <span className="w-5 h-5 rounded-full bg-[#e8f3ff] border border-[#bfdcff] text-[#2b6cb0] flex items-center justify-center">
                    <span className="w-2.5 h-2.5 border border-current rounded-full relative">
                      <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-current" />
                    </span>
                  </span>
                )}
                {item.kind === 'figma' && (
                  <span className="w-5 h-5 rounded-md bg-white border border-[#ddd] relative overflow-hidden">
                    <span className="absolute left-[3px] top-[2px] w-[6px] h-[6px] rounded-full bg-[#f24e1e]" />
                    <span className="absolute left-[3px] top-[8px] w-[6px] h-[6px] rounded-full bg-[#a259ff]" />
                    <span className="absolute left-[3px] top-[14px] w-[6px] h-[6px] rounded-full bg-[#1abcfe]" />
                    <span className="absolute left-[9px] top-[2px] w-[6px] h-[6px] rounded-full bg-[#ff7262]" />
                    <span className="absolute left-[9px] top-[8px] w-[6px] h-[6px] rounded-full bg-[#0acf83]" />
                  </span>
                )}
                {item.kind === 'photoshop' && (
                  <span className="w-5 h-5 rounded-[5px] bg-[#001e36] border border-[#31a8ff] text-[#31a8ff] text-[0.5rem] font-bold leading-none flex items-center justify-center">
                    Ps
                  </span>
                )}
                {item.kind === 'illustrator' && (
                  <span className="w-5 h-5 rounded-[5px] bg-[#261300] border border-[#ff9a00] text-[#ff9a00] text-[0.5rem] font-bold leading-none flex items-center justify-center">
                    Ai
                  </span>
                )}
              </div>
            ))}
            {[...highlights, ...highlights].map((text, i) => (
              <span key={`${text}-${i}`} className="text-[0.8125rem] text-[#777] mx-5 whitespace-nowrap">
                {text}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex shrink-0 pl-8 flex-col items-end gap-[3px]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#666]">★★★★★</span>
            <span className="text-xs font-semibold text-[#666]">4.9/5</span>
          </div>
          <span className="text-[0.6875rem] text-[#999999] whitespace-nowrap">
            Trusted by <span className="text-[#3b5bdb] font-semibold">30+</span> businesses
          </span>
        </div>
      </div>

      

    </section>
  )
}
