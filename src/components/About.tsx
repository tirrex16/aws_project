import { useRef, useEffect } from 'react'

const stats = [
  '15+ Years of Experience', '140+ Projects completed',
  '100+ Customer satisfaction rate', '97% Customer satisfaction rate', '6 Industry awards',
  '15+ Years of Experience', '140+ Projects completed',
  '100+ Customer satisfaction rate', '97% Customer satisfaction rate', '6 Industry awards',
]

export default function About() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const els = ref.current?.querySelectorAll<HTMLElement>('.reveal')
    if (!els) return
    const io = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }) },
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="max-w-[1560px] mx-auto px-10 py-[120px]" id="about" ref={ref}>
      {/* Meta */}
      <div className="flex items-center justify-between mb-12 reveal">
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">/About us</span>
        <span className="text-[0.8125rem] text-[#999999]">(01)</span>
      </div>

      {/* Headline */}
      <div className="flex items-start justify-between gap-10 mb-10">
        <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.2] max-w-[700px] reveal">
          We're a design studio focused on creating{' '}
          <span className="text-[#999999]">simple, purposeful, and elegant solutions.</span>
        </h2>
        <p className="text-[0.9375rem] text-[#3b5bdb] leading-[1.7] max-w-[240px] shrink-0 pt-1.5 reveal">
          Our studio is dedicated to crafting clean, purposeful solutions that cut through the noise.
        </p>
      </div>

      {/* Stats ticker */}
      <div className="border-t border-[#e8e8e8] border-b overflow-hidden py-[13px] mb-10 reveal">
        <div className="flex w-max" style={{ animation: 'ticker-stats 28s linear infinite' }}>
          {stats.map((s, i) => (
            <span key={i} className="text-[0.8125rem] text-[#999999] px-5 border-r border-[#e8e8e8] whitespace-nowrap flex items-center">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Showreel */}
      <div className="relative rounded-[20px] overflow-hidden reveal">
        <img src="/images/showreel.png" alt="Showreel" className="w-full h-[clamp(280px,42vw,580px)] object-cover grayscale block" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer">
          <button className="w-14 h-14 rounded-full bg-white/92 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.18)] text-lg pl-[3px] hover:scale-105 transition-transform cursor-pointer border-0">
            ▶
          </button>
          <span className="text-sm font-medium text-white/90 tracking-[-0.01em]" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
            Play Showreel
          </span>
        </div>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.6875rem] text-white/45 tracking-[0.04em] whitespace-nowrap">
          © 2025 Kanso
        </span>
      </div>
    </section>
  )
}
