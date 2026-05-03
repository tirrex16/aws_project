import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext.tsx'

export default function SelectedWork() {
  const ref = useRef<HTMLElement>(null)
  const { projects } = useAdmin()

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
    <section className="max-w-[1560px] mx-auto px-5 md:px-10 py-[42px]" id="work" ref={ref} aria-labelledby="work-heading">
      {/* Meta */}
      <div className="flex items-center justify-between mb-8 reveal">
        <span className="text-[0.8125rem] text-[#999999]" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4 sm:gap-6 reveal">
        <div>
          <h2 id="work-heading" className="text-[clamp(2.25rem,6vw,5rem)] font-extrabold tracking-[-0.045em] leading-none">
            Selected Work.
          </h2>
          <p className="text-sm text-[#999999] leading-[1.6] mt-2.5 max-w-[260px]">
            A curated selection of projects that reflect our commitment to simplicity and purposeful design.
          </p>
        </div>
        <a href="#" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium tracking-[-0.01em] px-[18px] py-[9px] border border-[#e8e8e8] rounded-full whitespace-nowrap self-start shrink-0 hover:bg-[#0f0f0f] hover:text-white hover:border-transparent transition-all no-underline text-[#0f0f0f]">
          View all projects +
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <Link
            key={i}
            to={`/projects/${p.id}`}
            className={`block cursor-pointer overflow-hidden rounded-[18px] bg-[#f5f5f5] border border-[#e8e8e8] no-underline text-[#0f0f0f] group transition-all duration-[400ms] hover:bg-[#0f0f0f] hover:border-[#0f0f0f] reveal reveal-d${(i % 4) + 1}`}
          >
            <div className="p-2.5 pb-0">
              <img
                src={p.img} alt={p.name} loading="lazy"
                className="w-full aspect-[4/3] object-cover rounded-xl block group-hover:scale-[1.02] transition-transform duration-[400ms]"
              />
            </div>
            <div className="flex justify-between items-start p-[14px_16px_16px]">
              <div>
                <h3 className="text-[0.9375rem] font-semibold tracking-[-0.02em] group-hover:text-white transition-colors duration-[400ms]">{p.name}</h3>
                <div className="text-[0.8125rem] text-[#999999] mt-[3px] group-hover:text-white/55 transition-colors duration-[400ms]">{p.type}</div>
              </div>
              <span className="text-[0.8125rem] text-[#999999] group-hover:text-white/45 transition-colors duration-[400ms]">{p.year}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
