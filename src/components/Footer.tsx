import { useRef } from 'react'

export default function Footer() {
  const ref = useRef<HTMLElement>(null)

  return (
    <footer id="contact" ref={ref} className="max-w-[1560px] mx-auto px-5 md:px-10 pt-16 pb-10 border-t border-[#e8e8e8]">
      {/* CTA */}
      <p className="text-xs font-semibold tracking-[0.07em] uppercase text-[#999999] mb-5">
        Start a project
      </p>
      <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-extrabold tracking-[-0.045em] leading-[1.05] mb-9">
        Let's create<br />something great.
      </h2>

      {/* Bottom bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-7 border-t border-[#e8e8e8]">
        <span className="text-[0.8125rem] text-[#999999]">© {new Date().getFullYear()} tirrex. All rights reserved.</span>
        <div className="flex gap-6">
          {[
            { name: 'X', url: 'https://x.com' },
            { name: 'Instagram', url: 'https://instagram.com/moahmed016' },
            { name: 'LinkedIn', url: 'https://linkedin.com/in/mohammedwinston' },
            { name: 'Discord', url: ' https://discordapp.com/users/583267582426087430' },
          ].map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[0.8125rem] text-[#999999] tracking-[-0.01em] hover:text-[#0f0f0f] transition-colors no-underline text-inherit">{s.name}</a>
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
