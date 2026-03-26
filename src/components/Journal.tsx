import { useRef, useEffect } from 'react'
import { useAdmin, resolveAsset } from '../context/AdminContext.tsx'

interface Post { title: string; tag: string; date: string; img: string }

const posts: Post[] = [
  { title: 'The Art of Minimal Design in a Maximalist World', tag: 'Design',   date: 'Mar 10, 2026', img: '/images/work-1.png' },
  { title: 'Building Brands That Stand the Test of Time',     tag: 'Branding', date: 'Feb 24, 2026', img: '/images/work-2.png' },
  { title: 'Why User Experience Is the New Luxury',           tag: 'UX',       date: 'Feb 12, 2026', img: '/images/work-3.png' },
]

export default function Journal() {
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
    <section className="max-w-[1560px] mx-auto px-10 py-[84px]" id="blog" ref={ref}>
      {/* Meta */}
      <div className="flex items-center justify-between mb-8 reveal">
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">/Blog</span>
        <span className="text-[0.8125rem] text-[#999999]">(05)</span>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {posts.map((p, i) => (
          <article key={i} className={`cursor-pointer group reveal reveal-d${i + 1}`}>
            <img
              src={resolveAsset(assets, `work_${i + 1}`, '/images/placeholder-photo.svg')}
              alt={p.title}
              loading="lazy"
              className="w-full aspect-[16/10] object-cover rounded-[14px] block mb-4 group-hover:opacity-85 transition-opacity"
            />
            <span className="block text-[0.6875rem] font-semibold tracking-[0.07em] uppercase text-[#999999] mb-1.5">{p.tag}</span>
            <h3 className="text-base font-semibold leading-[1.4] tracking-[-0.015em] mb-2">{p.title}</h3>
            <span className="block text-[0.8125rem] text-[#999999]">{p.date}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
