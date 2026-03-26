import { useState, useEffect, useRef } from 'react'
import { useAdmin, resolveAsset } from '../context/AdminContext.tsx'

interface NavLink { label: string; num: string; id: string | null }
const navLinks: NavLink[] = [
  { label: 'Home',     num: '01', id: null },
  { label: 'About',   num: '02', id: 'about' },
  { label: 'Projects',num: '03', id: 'work' },
  { label: 'Blog',    num: '04', id: 'blog' },
  { label: 'Contact', num: '05', id: 'contact' },
]

export default function Header() {
  const [time, setTime]             = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [open, setOpen]             = useState(false)
  const [menuExpanded, setMenuExpanded] = useState(false)
  const { assets } = useAdmin()
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(`${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`)
    }
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (open) {
      setMenuExpanded(true)
      return
    }

    closeTimerRef.current = setTimeout(() => {
      setMenuExpanded(false)
      closeTimerRef.current = null
    }, 500)

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [open])

  const scrollTo = (id: string) => {
    setMobileOpen(false); setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[99] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.2)_100%)] backdrop-blur-[0.5px]"
          onClick={() => setOpen(false)}
        />
      )}

      <nav className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-10" style={{ pointerEvents: 'none' }}>
        <div
          className={`w-full bg-[#e8e8e8] overflow-hidden ${menuExpanded ? 'rounded-[24px] shadow-[0_8px_48px_rgba(0,0,0,0.12)]' : 'rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.08)]'}`}
          style={{ maxWidth: 'calc(1560px - 80px)', pointerEvents: 'auto' }}
        >

          {/* Top bar */}
          <div className={`h-[52px] flex items-center justify-between px-5 ${open ? 'border-b border-black/10' : ''}`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-[-0.02em]">tirrex®</span>
              <span className="text-[0.6875rem] text-[#555] whitespace-nowrap">{time}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[0.6875rem] text-[#666] border border-black/15 px-2.5 py-[5px] rounded-[6px] cursor-pointer hover:bg-black/5 transition-colors">
                (Optional Dark version)
              </span>
              {['about', 'work', 'blog'].map((id) => (
                <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }}
                  className="text-[0.8125rem] text-[#555] tracking-[-0.01em] hover:text-[#0f0f0f] transition-colors capitalize no-underline text-inherit">
                  {id === 'work' ? 'Projects' : id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}
                className="text-[0.8125rem] font-medium px-[18px] py-[9px] bg-[#0f0f0f] text-white rounded-full tracking-[-0.01em] whitespace-nowrap hover:bg-[#333] transition-colors no-underline">
                Start a project
              </a>
              <button
                onClick={() => setOpen(!open)}
                className={`w-[30px] h-[30px] border border-black/15 bg-white/60 rounded-full flex items-center justify-center text-lg cursor-pointer shrink-0 hover:bg-white/90 transition-all duration-300 ${open ? 'rotate-45' : 'rotate-0'}`}
                style={{ lineHeight: 1 }}
              >
                +
              </button>
            </div>
          </div>

          {/* Expanded panel */}
          <div
            className="overflow-hidden origin-top transition-[max-height,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ maxHeight: open ? '640px' : '0', opacity: open ? 1 : 0 }}
          >
            <div className={`px-5 pb-7 pt-1 flex flex-col gap-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-y-0' : '-translate-y-4'}`}>
              <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 1.3fr' }}>
                {/* Links */}
                <div className="flex flex-col">
                  {navLinks.map((link) => (
                    <a key={link.label} href={link.id ? `#${link.id}` : '#'}
                      onClick={(e) => { e.preventDefault(); if (link.id) scrollTo(link.id); else { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
                      className="flex items-center justify-between py-[14px] border-b border-black/10 text-[1.0625rem] font-semibold tracking-[-0.02em] text-[#0f0f0f] hover:text-[#666] transition-colors no-underline"
                      style={{ borderTop: navLinks.indexOf(link) === 0 ? '1px solid rgba(0,0,0,0.1)' : undefined }}
                    >
                      {link.label}
                      <span className="text-xs font-normal text-[#888]">({link.num})</span>
                    </a>
                  ))}
                </div>
                {/* Preview image */}
                <div className="rounded-xl overflow-hidden relative" style={{ height: 220 }}>
                  <img
                    src={resolveAsset(assets, 'hero_bg', '/images/placeholder-photo.svg')}
                    alt="Studio"
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 flex flex-col justify-between p-[14px_18px]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)' }}>
                    <span className="text-[0.8125rem] font-semibold text-white tracking-[-0.01em]">tirrex® Studio</span>
                    <span className="text-[0.6875rem] text-white/70 self-center">© 2025 All rights reserved</span>
                  </div>
                </div>
              </div>
              {/* Contact row */}
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-[3px]">
                  <span className="text-[0.8125rem] text-[#0f0f0f]">hello@tirrex.studio</span>
                  <span className="text-[0.75rem] text-[#888]">(123) 456-7890</span>
                </div>
                <div className="flex gap-4">
                  {['Twitter/X', 'Instagram', 'LinkedIn'].map((s) => (
                    <a key={s} href="#" className="text-[0.8125rem] text-[#666] hover:text-[#0f0f0f] transition-colors no-underline">{s}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white z-[99] flex flex-col items-center justify-center gap-9" style={{ paddingTop: 52 }}>
          {['about', 'work', 'services', 'blog', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollTo(id) }}
              className="text-[2.25rem] font-bold tracking-[-0.03em] text-[#0f0f0f] no-underline capitalize">{id}</a>
          ))}
        </div>
      )}
    </>
  )
}
