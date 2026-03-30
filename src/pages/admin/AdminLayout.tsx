import { type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SESSION_KEY = 'tirrex_admin_auth'

interface AdminLayoutProps {
  children: ReactNode
  onLogout: () => void
}

const navItems = [
  { label: 'Projects', icon: '◼', path: '/admin/projects' },
  { label: 'Capabilities', icon: '◆', path: '/admin/capabilities' },
  { label: 'Services', icon: '◇', path: '/admin/services' },
  { label: 'Pricing', icon: '◈', path: '/admin/pricing' },
  { label: 'Journal', icon: '◉', path: '/admin/journal' },
]

export default function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const location = useLocation()

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    onLogout()
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex max-w-[1560px] mx-auto">
      {/* Sidebar */}
      <aside className="w-[280px] shrink-0 border-r border-[#e8e8e8] flex flex-col justify-between py-10 px-8 sticky top-0 h-screen overflow-y-auto">
        <div>
          <div className="flex items-center gap-3.5 mb-12">
            <span className="w-10 h-10 bg-[#0f0f0f] rounded-xl flex items-center justify-center text-white font-black text-xl">t</span>
            <div>
              <div className="text-[0.9375rem] font-bold tracking-[-0.01em] leading-tight">tirrex dashboard</div>
              <div className="text-[0.6875rem] font-medium text-[#666] tracking-[0.02em] uppercase mt-0.5">Admin Panel</div>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.9375rem] font-medium transition-all no-underline ${active ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#0f0f0f] border border-[#e8e8e8]' : 'text-[#666] hover:bg-black/5 hover:text-[#0f0f0f] border border-transparent'}`}
              >
                <span className={`text-[1.125rem] ${active ? 'text-[#0f0f0f]' : 'text-[#999]'}`}>{item.icon}</span>
                {item.label}
              </Link>
            )})}
          </nav>
        </div>

        <div className="flex flex-col gap-3 pt-8 border-t border-[#e8e8e8]">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[0.8125rem] font-medium text-[#666] px-4 py-2 rounded-lg hover:bg-black/5 transition-colors no-underline"
          >
            ↗ View site
          </a>
          <button className="flex items-center gap-2 text-[0.8125rem] font-medium text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-left" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-14 py-12 max-w-[1000px] overflow-hidden">
        {children}
      </main>
    </div>
  )
}
