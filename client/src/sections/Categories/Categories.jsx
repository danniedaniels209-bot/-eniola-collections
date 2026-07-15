import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../constants/products'

const ease = [0.16, 1, 0.3, 1]
const MotionLink = motion(Link)

export default function Categories() {
  return (
    <section id="collections" className="bg-obsidian py-24 md:py-32">
      <div className="mx-auto max-w-container px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease }}
          className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-luxe text-gold">Browse</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
              The Categories
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light text-muted">
            Eight houses of everyday luxury — from flowing abayas to sculpted corporate shoes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <MotionLink
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease, delay: (i % 3) * 0.1 }}
              className="group relative aspect-[3/4] overflow-hidden rounded-luxe"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 md:p-6">
                <h3 className="font-display text-lg font-medium text-white md:text-2xl">
                  {cat.name}
                </h3>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-500 ease-luxe group-hover:border-gold group-hover:bg-gold group-hover:text-obsidian">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
                    <path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  )
}
