import { motion } from 'framer-motion'
import MarqueeRow from './MarqueeRow'
import { ROW_CONFIG } from '../../constants/products'
import { useProducts } from '../../hooks/useProducts'

const ease = [0.16, 1, 0.3, 1]

// Build a row from the FULL catalogue, rotated so each row looks distinct and
// mixed. Repeat the sequence until the row has enough cards to overflow a wide
// viewport — otherwise a small catalogue leaves gaps and the motion looks frozen
// (the track only travels half its own width per cycle). MarqueeRow then
// duplicates this for the seamless loop.
const MIN_CARDS_PER_ROW = 10

function buildRow(products, rowIndex) {
  if (!products.length) return []
  const offset = rowIndex % products.length
  const rotated = [...products.slice(offset), ...products.slice(0, offset)]
  const row = []
  while (row.length < MIN_CARDS_PER_ROW) row.push(...rotated)
  return row
}

export default function InfiniteGallery() {
  const { items, loading } = useProducts('limit=24')
  const buckets = ROW_CONFIG.map((_, i) => buildRow(items, i))

  return (
    <section id="gallery" className="relative overflow-hidden bg-obsidian py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease }}
        className="mx-auto mb-16 max-w-container px-6 text-center md:px-10"
      >
        <p className="mb-4 text-[11px] uppercase tracking-luxe text-gold">The Showroom</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
          Featured Collections
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm font-light text-muted md:text-base">
          A living exhibition. Pieces glide through the gallery like a flagship window at night —
          hover to pause and step closer.
        </p>
      </motion.div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-obsidian to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-obsidian to-transparent md:w-32" />

      {loading ? (
        <p className="text-center text-sm text-muted">Curating the showroom…</p>
      ) : items.length === 0 ? (
        <p className="text-center text-sm text-muted">Collections coming soon.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
          className="flex flex-col gap-2"
        >
          {ROW_CONFIG.map((row, i) => (
            <MarqueeRow key={row.id} products={buckets[i]} direction={row.direction} duration={row.duration} />
          ))}
        </motion.div>
      )}
    </section>
  )
}
