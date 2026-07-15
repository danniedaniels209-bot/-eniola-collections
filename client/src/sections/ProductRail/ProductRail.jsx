import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductCard from '../../components/cards/ProductCard'
import { useProducts } from '../../hooks/useProducts'

const ease = [0.16, 1, 0.3, 1]

export default function ProductRail({ eyebrow, title, query, viewAll }) {
  const { items, loading } = useProducts(query)
  if (!loading && items.length === 0) return null

  return (
    <section className="bg-obsidian py-20 md:py-24">
      <div className="mx-auto max-w-container px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease }}
          className="mb-10 flex items-end justify-between"
        >
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-luxe text-gold">{eyebrow}</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h2>
          </div>
          {viewAll && (
            <Link to={viewAll} className="text-sm font-medium text-white transition-colors hover:text-gold">
              View all →
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {items.slice(0, 4).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
