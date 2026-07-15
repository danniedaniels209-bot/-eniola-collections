import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

export default function About() {
  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease }}
          className="overflow-hidden rounded-luxe"
        >
          <img src="/images/hero/wardrobe.png" alt="Êñiola" className="aspect-[4/5] w-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.15 }}
        >
          <p className="mb-5 text-[11px] uppercase tracking-luxe text-gold">Our Story</p>
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            More than clothing. A way of moving through the world.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
            At Êñiola Collections, we believe fashion is a reflection of confidence, identity, and
            individuality. Each piece is chosen for the woman who wants to be seen before she says a word.
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
            From flowing abayas to sculpted corporate shoes, our collections are curated like an
            exhibition — studio photographed, meticulously finished, and made to last.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
