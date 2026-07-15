import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

export default function AboutBrand() {
  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32">
      <img
        src="/images/hero/wardrobe.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/80 to-obsidian" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-10"
      >
        <p className="mb-6 text-[11px] uppercase tracking-luxe text-gold">Our Story</p>
        <p className="font-display text-2xl font-light leading-snug text-white md:text-4xl md:leading-snug">
          At Êñiola Collections, we believe fashion is a reflection of{' '}
          <span className="text-gold-soft">confidence, identity, and individuality</span> — every
          piece is chosen to make you feel seen before you say a word.
        </p>
        <a
          href="#about"
          className="mt-10 inline-block rounded-full border border-white/25 px-8 py-[15px] text-sm font-light text-white/90 transition-colors duration-300 hover:border-gold hover:text-gold"
        >
          Discover the House
        </a>
      </motion.div>
    </section>
  )
}
