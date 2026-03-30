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
    <section className="max-w-[1560px] mx-auto px-5 md:px-10 py-[42px]" id="about" ref={ref}>
      {/* Meta */}
      <div className="flex items-center justify-between mb-8 reveal">
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">About us</span>
        <span className="text-[0.8125rem] text-[#999999]">(01)</span>
      </div>

      {/* Headline */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 md:gap-10 mb-7">
        <h2 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold tracking-[-0.035em] leading-[1.2] max-w-[700px] reveal">
        Everything is designed. So let me be your designer.{' '}
        </h2>
        <p className="text-[1rem] md:text-[1.125rem] lg:text-[1.35rem] leading-[1.5] tracking-[-0.02em] text-[#555] md:max-w-[360px] md:shrink-0 pt-0 md:pt-1.5 reveal">
          This is your captain, Mohammed Winston Fova here!
        </p>
      </div>

      {/* Showreel */}
      <div className="relative rounded-[20px] overflow-hidden reveal">
        <img
          src={resolveAsset(assets, 'showreel', '/images/placeholder-photo.svg')}
          alt="Showreel"
          className="w-full h-[clamp(280px,42vw,580px)] object-cover grayscale block"
        />
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.6875rem] text-white/45 tracking-[0.04em] whitespace-nowrap">
          © 2025 tirrex
        </span>
      </div>

    </section>
  )
}
