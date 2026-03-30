import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useAdmin } from '../context/AdminContext.tsx'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const topRef = useRef<HTMLDivElement>(null)
  const { projects } = useAdmin()
  const project = projects.find((p) => p.id === (id ?? ''))
  const related = projects.filter((p) => project?.relatedIds.includes(p.id) ?? false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [project])

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link to="/" className="text-sm font-medium hover:underline">← Back home</Link>
      </div>
    )
  }

  return (
    <div className="pt-[140px] pb-[120px] max-w-[1560px] mx-auto px-10" ref={topRef}>
      {/* ── Hero info ───────────────────────────── */}
      <header className="mb-14 reveal">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05]">{project.name}.</h1>
          </div>
          <div className="lg:max-w-[40%]">
            <p className="text-[1.125rem] md:text-[1.35rem] leading-[1.5] tracking-[-0.02em] text-[#555]">{project.tagline}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-[0.8125rem] border-t border-b border-[#e8e8e8] py-4">
          <div className="flex flex-col gap-1">
            <span className="text-[#999999] font-medium tracking-[-0.01em]">Scope</span>
            <span className="text-[#0f0f0f] font-semibold">{project.type}</span>
          </div>
          <div className="text-[#e8e8e8] text-xl mx-2 font-light">/</div>
          <div className="flex flex-col gap-1">
            <span className="text-[#999999] font-medium tracking-[-0.01em]">Client</span>
            <span className="text-[#0f0f0f] font-semibold">{project.client}</span>
          </div>
          <div className="text-[#e8e8e8] text-xl mx-2 font-light">/</div>
          <div className="flex flex-col gap-1">
            <span className="text-[#999999] font-medium tracking-[-0.01em]">Duration</span>
            <span className="text-[#0f0f0f] font-semibold">{project.duration}</span>
          </div>
          <div className="text-[#e8e8e8] text-xl mx-2 font-light">/</div>
          <div className="flex flex-col gap-1">
            <span className="text-[#999999] font-medium tracking-[-0.01em]">Year</span>
            <span className="text-[#0f0f0f] font-semibold">{project.year}</span>
          </div>
          <div className="ml-auto mt-2 sm:mt-0">
            <a href="#" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-white bg-[#0f0f0f] px-5 py-[10px] rounded-full tracking-[-0.01em] hover:bg-[#333] transition-colors no-underline">Live preview ↗</a>
          </div>
        </div>
      </header>

      {/* ── Hero image ──────────────────────────── */}
      <div className="mb-[120px] rounded-[24px] overflow-hidden reveal">
        <img src={project.heroImg} alt={project.name} className="w-full object-cover max-h-[80vh]" />
      </div>

      {/* ── Sections ────────────────────────────── */}
      {project.sections.map((sec, idx) => (
        <section key={idx} className="mb-[120px] reveal">
          <div className="flex items-center justify-between mb-12">
            <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">/ {sec.label}</span>
            <span className="text-[0.8125rem] text-[#999999]">({sec.num})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-20 mb-16">
            <h2 className="md:col-span-5 text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.035em] leading-[1.2]">{sec.headline}</h2>
            <p className="md:col-span-7 text-[1.0625rem] text-[#555] leading-[1.65] mt-2 whitespace-pre-line">{sec.body}</p>
          </div>

          <div
            className={`grid gap-6 ${
              sec.images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {sec.images.map((src, j) => (
              <div key={j} className="rounded-[20px] overflow-hidden">
                <img
                  src={src}
                  alt={`${project.name} ${sec.label} ${j + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ── Related projects ────────────────────── */}
      <section className="pt-[120px] border-t border-[#e8e8e8] reveal">
        <div className="flex justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-[clamp(2.25rem,6vw,4rem)] font-extrabold tracking-[-0.045em] leading-none mb-3">
              Latest Projects.
            </h2>
            <p className="text-[0.9375rem] text-[#999999] leading-[1.6] max-w-[280px]">
              A curated selection of projects that reflect our commitment to simplicity and purposeful design.
            </p>
          </div>
          <Link to="/#work" className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium tracking-[-0.01em] px-[18px] py-[9px] border border-[#e8e8e8] rounded-full whitespace-nowrap self-start shrink-0 hover:bg-[#0f0f0f] hover:text-white hover:border-transparent transition-all no-underline text-[#0f0f0f]">
            View all projects +
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {related.map((rp, i) => (
            <Link key={i} to={`/projects/${rp.id}`} className="block cursor-pointer overflow-hidden rounded-[18px] bg-[#f5f5f5] border border-[#e8e8e8] no-underline text-[#0f0f0f] group transition-all duration-[400ms] hover:bg-[#0f0f0f] hover:border-[#0f0f0f] reveal reveal-d1">
              <div className="p-2.5 pb-0">
                <img src={rp.img} alt={rp.name} className="w-full aspect-[4/3] object-cover rounded-xl block group-hover:scale-[1.02] transition-transform duration-[400ms]" />
              </div>
              <div className="flex justify-between items-start p-[14px_16px_16px]">
                <div>
                  <div className="text-[0.9375rem] font-semibold tracking-[-0.02em] group-hover:text-white transition-colors duration-[400ms]">{rp.name}</div>
                  <div className="text-[0.8125rem] text-[#999999] mt-[3px] group-hover:text-white/55 transition-colors duration-[400ms]">{rp.type}</div>
                </div>
                <span className="text-[0.8125rem] text-[#999999] group-hover:text-white/45 transition-colors duration-[400ms]">{rp.year}</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-[0.8125rem] text-[#999999] text-center mb-8">© Tirrex Studio</p>
      </section>
    </div>
  )
}
