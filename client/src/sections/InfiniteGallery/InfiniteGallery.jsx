import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MarqueeRow from './MarqueeRow'
import { ROW_CONFIG } from '../../constants/products'
import { api } from '../../services/api'

const ease = [0.16, 1, 0.3, 1]

// Build a row from the FULL image set, rotated so each row looks distinct.
// Repeat until the row overflows a wide viewport — otherwise a short track
// leaves gaps and the motion looks frozen (it travels half its own width per
// cycle). MarqueeRow then duplicates this for the seamless loop.
const MIN_CARDS_PER_ROW = 10

function buildRow(images, rowIndex) {
  if (!images.length) return []
  const offset = rowIndex % images.length
  const rotated = [...images.slice(offset), ...images.slice(0, offset)]
  const row = []
  while (row.length < MIN_CARDS_PER_ROW) row.push(...rotated)
  return row
}

export default function InfiniteGallery() {
  const [images, setImages] = useState(null)

  useEffect(() => {
    api
      .get('/homepage')
      .then((d) => setImages(d.homepage?.galleryImages || []))
      .catch(() => setImages([]))
  }, [])

  // Curated by the owner in Admin → Homepage; independent of the catalogue.
  if (images && images.length === 0) return null
  const buckets = ROW_CONFIG.map((_, i) => buildRow(images || [], i))

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
          A living exhibition — pieces drifting through the gallery like a flagship window at night.
        </p>
      </motion.div>

      {/* Edge fades so cards dissolve rather than clip */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-obsidian to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-obsidian to-transparent md:w-32" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
        className="flex flex-col gap-2"
      >
        {ROW_CONFIG.map((row, i) => (
          <MarqueeRow key={row.id} images={buckets[i]} direction={row.direction} duration={row.duration} />
        ))}
      </motion.div>
    </section>
  )
}
