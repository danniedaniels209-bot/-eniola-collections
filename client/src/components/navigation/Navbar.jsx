import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?sort=newest' },
  { label: 'Best Sellers', to: '/shop?sort=bestsellers' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Icon({ path }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [acctOpen, setAcctOpen] = useState(false)
  const { count, wishlist } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // Hide on scroll down, reveal on scroll up (after a threshold).
      if (y > last && y > 160) setHidden(true)
      else setHidden(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: hidden ? -120 : 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6"
    >
      <nav
        className={`glass flex w-full max-w-container items-center justify-between rounded-full transition-all duration-600 ease-luxe ${
          scrolled ? 'glass-scrolled px-6 py-2.5' : 'px-7 py-3.5'
        }`}
      >
        {/* Brand */}
        <Link to="/" className="flex items-baseline gap-2 whitespace-nowrap">
          <span className="font-display text-lg font-semibold tracking-wide text-cream">Êñiola</span>
          <span className="hidden text-[10px] uppercase tracking-luxe text-gold sm:inline">
            Collections
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="text-[13px] font-light text-cream/70 transition-colors duration-300 hover:text-gold"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4 text-cream/80">
          <Link to="/shop" aria-label="Search" className="transition-colors hover:text-gold">
            <Icon path="M21 21l-4.3-4.3M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </Link>
          <Link to="/wishlist" aria-label="Wishlist" className="relative hidden transition-colors hover:text-gold sm:block">
            <Icon path="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.3 5 5.5 5 7.5 5 9 6.3 12 9c3-2.7 4.5-4 6.5-4C21.7 5 23.4 8.4 22 11.7 19.5 16.4 12 21 12 21z" />
            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-obsidian">
                {wishlist.length}
              </span>
            )}
          </Link>
          {/* Account */}
          <div className="relative">
            <button
              onClick={() => (user ? setAcctOpen((v) => !v) : navigate('/login'))}
              aria-label="Account"
              className="transition-colors hover:text-gold"
            >
              <Icon path="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </button>
            <AnimatePresence>
              {acctOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  onMouseLeave={() => setAcctOpen(false)}
                  className="glass absolute right-0 top-9 w-48 rounded-2xl p-2"
                >
                  <p className="truncate px-3 py-2 text-xs text-cream/60">{user.name}</p>
                  <Link to="/account" onClick={() => setAcctOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-cream/80 hover:bg-white/5 hover:text-gold">
                    My Profile
                  </Link>
                  <Link to="/account/orders" onClick={() => setAcctOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-cream/80 hover:bg-white/5 hover:text-gold">
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setAcctOpen(false)
                      navigate('/')
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-cream/80 hover:bg-white/5 hover:text-gold"
                  >
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/cart" aria-label="Cart" className="relative transition-colors hover:text-gold">
            <Icon path="M6 6h15l-1.5 9h-12L5 3H2" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-semibold text-obsidian">
                {count}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="transition-colors hover:text-gold lg:hidden"
          >
            <Icon path={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass absolute top-24 flex w-[92%] max-w-container flex-col gap-1 rounded-3xl p-4 lg:hidden"
          >
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-cream/80 transition-colors hover:bg-white/5 hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
