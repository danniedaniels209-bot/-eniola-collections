import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

const COLUMNS = [
  { title: 'Shop', links: ['New Arrivals', 'Best Sellers', 'Abayas', 'Sneakers', 'Handbags'] },
  { title: 'House', links: ['Our Story', 'Contact', 'Reviews', 'Wishlist'] },
  { title: 'Support', links: ['Shipping', 'Returns', 'Size Guide', 'FAQ'] },
]

const SOCIALS = ['Instagram', 'TikTok', 'WhatsApp']

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-charcoal">
      {/* Newsletter */}
      <div className="mx-auto max-w-container px-6 py-20 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease }}
          className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end"
        >
          <div>
            <h2 className="max-w-md font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Join the inner circle.
            </h2>
            <p className="mt-4 max-w-sm text-sm font-light text-muted">
              Early access to drops, private previews, and members-only pieces.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md items-center gap-2"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="glass w-full rounded-full px-6 py-[15px] text-sm text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
            />
            <button className="rounded-full bg-gold px-7 py-[15px] text-sm font-semibold text-obsidian transition-transform duration-300 hover:scale-[1.03]">
              Join
            </button>
          </form>
        </motion.div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 pt-16 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-semibold text-white">Êñiola</span>
              <span className="text-[10px] uppercase tracking-luxe text-gold">Collections</span>
            </div>
            <p className="mt-5 max-w-xs text-sm font-light text-muted">
              A luxury fashion house — style that speaks before you do.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-5 text-xs uppercase tracking-luxe text-white/50">{col.title}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm font-light text-muted transition-colors hover:text-gold">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-3 px-6 text-xs text-white/40 md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} Êñiola Collections. All rights reserved.</p>
          <p>Lagos · Mon–Sat, 9am–7pm</p>
        </div>
      </div>
    </footer>
  )
}
