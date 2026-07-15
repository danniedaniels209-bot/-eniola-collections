import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

const STORIES = [
  {
    eyebrow: 'Abayas',
    title: 'Grace In\nEvery Layer.',
    body: 'Flowing silhouettes cut from premium fabric. Designed to move with you, and to be remembered long after you leave the room.',
    cta: 'Explore Abayas',
    image: '/images/products/abaya.png',
    reverse: false,
  },
  {
    eyebrow: 'Sneakers',
    title: 'Designed For\nEveryday Movement.',
    body: 'Studio-crafted comfort with a quiet gold signature. The everyday piece that never feels ordinary.',
    cta: 'Explore Sneakers',
    image: '/images/products/sneaker-black.png',
    reverse: true,
  },
  {
    eyebrow: 'Corporate Shoes',
    title: 'Confidence From\nThe Ground Up.',
    body: 'Sculpted leather pumps for the woman who leads. Polished, poised, and made to command the room.',
    cta: 'Explore Corporate',
    image: '/images/products/corporate-shoe.png',
    reverse: false,
  },
]

function Story({ eyebrow, title, body, cta, image, reverse }) {
  return (
    <div
      className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.06, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.4, ease }}
        className="overflow-hidden rounded-luxe"
      >
        <img src={image} alt={eyebrow} loading="lazy" className="aspect-[4/5] w-full object-cover" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease, delay: 0.15 }}
      >
        <p className="mb-5 text-[11px] uppercase tracking-luxe text-gold">{eyebrow}</p>
        <h2 className="whitespace-pre-line font-display text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl">
          {title}
        </h2>
        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-muted md:text-base">
          {body}
        </p>
        <a
          href="#gallery"
          className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-gold"
        >
          {cta}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>
    </div>
  )
}

export default function CollectionStory() {
  return (
    <section className="bg-obsidian py-24 md:py-32">
      <div className="mx-auto flex max-w-container flex-col gap-24 px-6 md:gap-luxe md:px-10">
        {STORIES.map((s) => (
          <Story key={s.eyebrow} {...s} />
        ))}
      </div>
    </section>
  )
}
