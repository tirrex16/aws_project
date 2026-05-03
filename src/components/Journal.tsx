import { useRef, useEffect } from 'react'
import { useAdmin, resolveAsset } from '../context/AdminContext.tsx'

export default function Journal() {
  const ref = useRef<HTMLElement>(null)
  const { assets, siteContent } = useAdmin()
  const posts = siteContent.journal.posts

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
    <section className="max-w-[1560px] mx-auto px-5 md:px-10 py-[42px]" id="blog" ref={ref} aria-labelledby="blog-heading">
      {/* Visually hidden H2 for landmark — WCAG 2.4.1 */}
      <h2 id="blog-heading" className="sr-only">Blog &amp; Journal</h2>
      {/* Meta */}
      <div className="flex items-center justify-between mb-8 reveal" aria-hidden="true">
        <span className="text-[0.8125rem] font-medium text-[#999999] tracking-[-0.01em]">Blog</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((p, i) => (
          // WCAG 2.1.1: Wrap in <a> so keyboard users can navigate to posts
          <article key={i} className={`group reveal reveal-d${i + 1}`}>
            <a href="#" aria-label={`Read article: ${p.title}`} className="block no-underline text-inherit cursor-pointer group-hover:opacity-85 transition-opacity">
              <img
                src={resolveAsset(assets, `work_${i + 1}`, '/images/placeholder-photo.svg')}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="w-full aspect-[16/10] object-cover rounded-[14px] block mb-4 transition-opacity"
              />
              <span className="block text-[0.6875rem] font-semibold tracking-[0.07em] uppercase text-[#999999] mb-1.5" aria-hidden="true">{p.tag}</span>
              <h3 className="text-base font-semibold leading-[1.4] tracking-[-0.015em] mb-2">{p.title}</h3>
              <time className="block text-[0.8125rem] text-[#999999]" dateTime={p.date}>{p.date}</time>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
