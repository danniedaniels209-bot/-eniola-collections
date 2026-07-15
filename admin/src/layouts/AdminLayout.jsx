import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const NAV = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/orders', label: 'Orders' },
  { to: '/customers', label: 'Customers' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/coupons', label: 'Coupons' },
  { to: '/homepage', label: 'Homepage' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/media', label: 'Media Library' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/settings', label: 'Settings' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  // Close the drawer whenever navigation happens on mobile.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-panel px-4 py-3 lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="text-ink">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-ink">Êñiola</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">Admin</span>
        </div>
        <span className="w-6" />
      </header>

      {/* Backdrop (mobile only) */}
      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
      )}

      {/* Sidebar: drawer under lg, fixed rail from lg up */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-panel transition-transform duration-300 lg:w-60 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-ink">Êñiola</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold">Admin</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-slate lg:hidden">
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand text-white' : 'text-slate hover:bg-canvas hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
          <p className="truncate text-xs text-slate">{user?.email}</p>
          <button onClick={handleLogout} className="btn-ghost mt-3 w-full">
            Sign out
          </button>
        </div>
      </aside>

      {/* Content: full width on mobile, offset by the rail from lg up */}
      <main className="p-4 sm:p-6 lg:ml-60 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
