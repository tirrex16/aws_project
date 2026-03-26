import { useRef, useEffect } from 'react'
import { useAdmin, resolveAsset } from '../context/AdminContext.tsx'

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const { assets } = useAdmin()

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
    <section className="max-w-[1560px] mx-auto px-10 py-[84px]" id="about" ref={ref}>
      {/* Meta */}
      <div className="flex items-center justify-between mb-8 reveal">
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">/About us</span>
        <span className="text-[0.8125rem] text-[#999999]">(01)</span>
      </div>

      {/* Headline */}
      <div className="flex items-start justify-between gap-10 mb-7">
        <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.2] max-w-[700px] reveal">
        Everything is designed. So let me be your designer.{' '}
        </h2>
        <p className="text-[1.125rem] md:text-[1.35rem] leading-[1.5] tracking-[-0.02em] text-[#555] max-w-[360px] shrink-0 pt-1.5 reveal">
          Our studio is dedicated to crafting clean, purposeful solutions that cut through the noise.
        </p>
      </div>

      {/* Showreel */}
      <div className="relative rounded-[20px] overflow-hidden reveal">
        <img
          src={resolveAsset(assets, 'showreel', '/images/placeholder-photo.svg')}
          alt="Showreel"
          className="w-full h-[clamp(280px,42vw,580px)] object-cover grayscale block"
        />
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
