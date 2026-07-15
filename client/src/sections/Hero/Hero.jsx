import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { api, asset } from '../../services/api'

const ease = [0.16, 1, 0.3, 1]

const FALLBACK = {
  heroVideo: '/videos/hero.mp4',
  heroImage: '/images/hero/wardrobe.png',
  headline: 'Style that Speaks Before You Do.',
  subheading: 'Basic Tops · Crop Tops · Sneakers · Abayas · Hijabs · Everyday Essentials',
}

export default function Hero() {
  const [hp, setHp] = useState(FALLBACK)

  useEffect(() => {
    api
      .get('/homepage')
      .then((d) => setHp({ ...FALLBACK, ...d.homepage }))
      .catch(() => {})
  }, [])

  // Render the headline across up to three lines, gilding the final line.
  const lines = hp.headline.split(' ')
  const mid = Math.ceil(lines.length / 2)

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {/* Layer 1 — cinematic video: the site lives inside it */}
      <video
        key={hp.heroVideo}
        className="absolute inset-0 h-full w-full object-cover"
        src={asset(hp.heroVideo)}
        poster={asset(hp.heroImage)}
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Layer 2 — atmospheric overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/20 to-obsidian" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,5,0.65)_100%)]" />

      {/* Layer 3 — interface */}
      <div className="relative z-10 mx-auto flex h-full max-w-container flex-col justify-end px-6 pb-24 md:px-10 md:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="mb-6 text-[11px] uppercase tracking-luxe text-gold"
        >
          Êñiola Collections — Est. Lagos
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease, delay: 0.4 }}
          className="max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-8xl"
        >
          <span>{lines.slice(0, mid).join(' ')}</span>
          <br />
          <span className="text-gold-soft">{lines.slice(mid).join(' ')}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.9 }}
          className="mt-7 max-w-xl text-sm font-light leading-relaxed text-muted md:text-base"
        >
          {hp.subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/shop"
            className="glass rounded-full px-8 py-[15px] text-sm font-medium text-white transition-transform duration-300 ease-luxe hover:scale-[1.03] hover:bg-white/10"
          >
            Shop Now
          </Link>
          <a
            href="#collections"
            className="rounded-full border border-white/25 px-8 py-[15px] text-sm font-light text-white/90 transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            Explore Collection
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-luxe text-white/50">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-8 w-[1px] bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  )
}
