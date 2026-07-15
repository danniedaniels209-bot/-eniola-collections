import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

const REVIEWS = [
  {
    quote: 'Quality beyond expectations. The abaya draped like something from a runway.',
    name: 'Aisha O.',
    location: 'Lagos',
  },
  {
    quote: 'The packaging alone felt like a gift. This is luxury done right.',
    name: 'Zainab M.',
    location: 'Abuja',
  },
  {
    quote: 'I get compliments every single time. The sneakers are unreal.',
    name: 'Temi A.',
    location: 'Port Harcourt',
  },
]

function Stars() {
  return (
    <div className="flex gap-1 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7L12 17.8 5.7 21.5l1.7-7L2 9.8l7.1-.6L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  return (
    <section className="bg-obsidian py-24 md:py-32">
      <div className="mx-auto max-w-container px-6 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease }}
          className="mb-14 text-center font-display text-4xl font-bold tracking-tight text-white md:text-6xl"
        >
          Loved By Many
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease, delay: i * 0.12 }}
              className="glass flex flex-col gap-6 rounded-luxe p-8"
            >
              <Stars />
              <blockquote className="font-display text-lg font-light leading-relaxed text-white/90">
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-auto text-sm text-muted">
                <span className="text-white">{r.name}</span> · {r.location}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
