import { useRef, useEffect } from 'react'

interface Logo { name: string; src: string }

const logos: Logo[] = [
  { name: 'Notion',    src: '/images/notion.svg' },
  { name: 'Linear',   src: '/images/linear.svg' },
  { name: 'Vercel',   src: '/images/vercel.svg' },
  { name: 'Raycast',  src: '/images/raycast.svg' },
  { name: 'Loom',     src: '/images/loom.svg' },
  { name: 'Stripe',   src: '/images/stripe.svg' },
  { name: 'Supabase', src: '/images/supabase.svg' },
  { name: 'Framer',   src: '/images/framer.svg' },
  { name: 'Webflow',  src: '/images/webflow.svg' },
  { name: 'Figma',    src: '/images/figma.svg' },
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
      <div className="flex items-start justify-between max-w-[1560px] mx-auto px-10 pt-8 pb-5 gap-6">
        <h1 className="text-[clamp(72px,13vw,200px)] font-black tracking-[-0.045em] leading-[0.92] text-[#0f0f0f] reveal">
          tirrex
        </h1>
        <p className="text-[0.9375rem] text-[#3b5bdb] leading-[1.65] max-w-[230px] mt-2 shrink-0 text-right reveal">
          Everything is designed. So let me be your designer.
        </p>
      </div>

      {/* Logo ticker */}
      <div className="max-w-[1560px] mx-auto flex items-center border-t border-[#e8e8e8] border-b px-10 overflow-hidden reveal" style={{ height: 44 }}>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center w-max" style={{ animation: 'ticker-roll 22s linear infinite' }}>
            {[...logos, ...logos].map((l, i) => (
              <img
                key={i} src={l.src} alt={l.name}
                style={{ height: 24, width: 'auto', marginLeft: 24, marginRight: 24, filter: 'grayscale(100%) opacity(0.35)', display: 'block' }}
              />
            ))}
          </div>
        </div>
        <div className="shrink-0 pl-8 flex flex-col items-end gap-[3px]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#666]">★★★★★</span>
            <span className="text-xs font-semibold text-[#666]">4.9/5</span>
          </div>
          <span className="text-[0.6875rem] text-[#999999] whitespace-nowrap">
            Trusted by <span className="text-[#3b5bdb] font-semibold">100+</span> businesses
          </span>
        </div>
      </div>

      {/* Hero image */}
      <div className="max-w-[1560px] mx-auto px-10 pt-5 reveal">
        <img
          src="/images/hero-bw.png" alt="Kanso studio"
          className="w-full object-cover rounded-[20px] grayscale block"
          style={{ height: 'clamp(320px, 52vw, 680px)' }}
        />
        <p className="text-center mt-3 text-[0.6875rem] text-[#999999] tracking-[0.04em]">© 2025 Kanso</p>
      </div>
    </section>
  )
}
