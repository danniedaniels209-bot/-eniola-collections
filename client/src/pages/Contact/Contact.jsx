import { useEffect, useState } from 'react'
import { api, whatsappUrl } from '../../services/api'

export default function Contact() {
  const [settings, setSettings] = useState(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    api.get('/settings').then((d) => setSettings(d.settings)).catch(() => {})
  }, [])

  const c = settings?.contact || {}
  const s = settings?.social || {}
  const wa = whatsappUrl(settings?.whatsapp)

  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <p className="mb-3 text-[11px] uppercase tracking-luxe text-gold">Contact</p>
      <h1 className="mb-12 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Get in touch</h1>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6 text-sm">
          <Detail label="Phone" value={c.phone || '+234 800 000 0000'} />
          <Detail label="Email" value={c.email || 'hello@eniola.com'} />
          <Detail label="Location" value={c.location || 'Lagos, Nigeria'} />
          <Detail label="Business Hours" value={c.businessHours || 'Mon–Sat, 9am – 7pm'} />
          <div className="flex gap-3 pt-2">
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-5 py-2 text-white hover:border-gold hover:text-gold">
                WhatsApp
              </a>
            )}
            {s.instagram && <a href={s.instagram} className="rounded-full border border-white/15 px-5 py-2 text-white hover:border-gold hover:text-gold">Instagram</a>}
            {s.tiktok && <a href={s.tiktok} className="rounded-full border border-white/15 px-5 py-2 text-white hover:border-gold hover:text-gold">TikTok</a>}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
          className="space-y-4 rounded-luxe border border-white/10 bg-surface p-6"
        >
          {sent ? (
            <p className="py-10 text-center text-gold">Thank you — we'll be in touch shortly.</p>
          ) : (
            <>
              <input required placeholder="Your name" className="w-full rounded-lg border border-white/15 bg-obsidian px-4 py-3 text-sm text-white focus:border-gold focus:outline-none" />
              <input required type="email" placeholder="Your email" className="w-full rounded-lg border border-white/15 bg-obsidian px-4 py-3 text-sm text-white focus:border-gold focus:outline-none" />
              <textarea required placeholder="Message" rows={5} className="w-full rounded-lg border border-white/15 bg-obsidian px-4 py-3 text-sm text-white focus:border-gold focus:outline-none" />
              <button className="w-full rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.02]">Send Message</button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-luxe text-muted">{label}</p>
      <p className="mt-1 text-white">{value}</p>
    </div>
  )
}
