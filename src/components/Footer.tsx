import { useRef } from 'react'

export default function Footer() {
  const ref = useRef<HTMLElement>(null)

  return (
    <footer id="contact" ref={ref} className="max-w-[1560px] mx-auto px-10 pt-24 pb-12 border-t border-[#e8e8e8]">
      {/* CTA */}
      <p className="text-xs font-semibold tracking-[0.07em] uppercase text-[#999999] mb-5">
        Start a project
      </p>
      <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] mb-12">
        Let's create<br />something great.
      </h2>
      <form className="flex gap-2.5 mb-24" style={{ maxWidth: 380 }} onSubmit={(e) => e.preventDefault()}>
        <input
          type="email" placeholder="Enter your email" aria-label="Email"
          className="flex-1 px-[18px] py-2.5 border border-[#e8e8e8] rounded-full text-sm text-[#0f0f0f] bg-transparent outline-none placeholder:text-[#999999] focus:border-[#0f0f0f] transition-colors"
        />
        <button type="submit" className="px-5 py-2.5 bg-[#0f0f0f] text-white rounded-full text-sm font-medium tracking-[-0.01em] hover:bg-[#333] transition-colors cursor-pointer border-0">
          Subscribe
        </button>
      </form>

      {/* Bottom bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-7 border-t border-[#e8e8e8]">
        <span className="text-[0.8125rem] text-[#999999]">© {new Date().getFullYear()} Kanso. All rights reserved.</span>
        <div className="flex gap-6">
          {['Twitter', 'Instagram', 'LinkedIn', 'Dribbble'].map((s) => (
            <a key={s} href="#" className="text-[0.8125rem] text-[#999999] tracking-[-0.01em] hover:text-[#0f0f0f] transition-colors no-underline text-inherit">{s}</a>
          ))}
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-[0.8125rem] text-[#999999] tracking-[-0.01em] hover:text-[#0f0f0f] transition-colors cursor-pointer border-0 bg-transparent">
          ↑ Back to top
        </button>
      </div>
    </footer>
  )
}
