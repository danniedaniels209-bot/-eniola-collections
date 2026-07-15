import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner } from '../components/ui'

export default function Settings() {
  const [s, setS] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/settings').then((d) => setS(d.settings))
  }, [])

  // Set a nested value by path, e.g. set('payments.paystack', true)
  const set = (path, value) => {
    setS((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] ??= {}
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  const save = async (e) => {
    e.preventDefault()
    const d = await api.put('/admin/settings', s)
    setS(d.settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!s) return <Spinner />

  const Toggle = ({ path, label }) => (
    <label className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm">
      {label}
      <input type="checkbox" checked={pathGet(s, path)} onChange={(e) => set(path, e.target.checked)} />
    </label>
  )

  return (
    <form onSubmit={save}>
      <PageHeader
        title="Settings"
        subtitle="Store details, payments, delivery and WhatsApp."
        actions={<button className="btn-primary">{saved ? 'Saved ✓' : 'Save changes'}</button>}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Store */}
        <div className="card space-y-4 p-5">
          <h2 className="font-semibold">Store</h2>
          <Field label="Store Name" value={s.storeName} onChange={(v) => set('storeName', v)} />
          <Field label="Currency" value={s.currency} onChange={(v) => set('currency', v)} />
          <Field label="Business Details" value={s.businessDetails} onChange={(v) => set('businessDetails', v)} />
          <Field label="SEO Title" value={s.seo?.title} onChange={(v) => set('seo.title', v)} />
          <Field label="SEO Description" value={s.seo?.description} onChange={(v) => set('seo.description', v)} />
        </div>

        {/* Contact + social */}
        <div className="card space-y-4 p-5">
          <h2 className="font-semibold">Contact & Social</h2>
          <Field label="Phone" value={s.contact?.phone} onChange={(v) => set('contact.phone', v)} />
          <Field label="Email" value={s.contact?.email} onChange={(v) => set('contact.email', v)} />
          <Field label="Location" value={s.contact?.location} onChange={(v) => set('contact.location', v)} />
          <Field label="Business Hours" value={s.contact?.businessHours} onChange={(v) => set('contact.businessHours', v)} />
          <Field label="Instagram" value={s.social?.instagram} onChange={(v) => set('social.instagram', v)} />
          <Field label="TikTok" value={s.social?.tiktok} onChange={(v) => set('social.tiktok', v)} />
        </div>

        {/* Payments */}
        <div className="card space-y-3 p-5">
          <h2 className="font-semibold">Payment Methods</h2>
          <Toggle path="payments.paystack" label="Paystack" />
          <Toggle path="payments.flutterwave" label="Flutterwave" />
          <Toggle path="payments.cod" label="Cash on Delivery" />
          <Toggle path="payments.bankTransfer" label="Bank Transfer" />
        </div>

        {/* Delivery + WhatsApp */}
        <div className="card space-y-4 p-5">
          <h2 className="font-semibold">Delivery</h2>
          <Field type="number" label="Delivery Fee (₦)" value={s.delivery?.fee} onChange={(v) => set('delivery.fee', Number(v))} />
          <Field type="number" label="Free Shipping Threshold (₦)" value={s.delivery?.freeShippingThreshold} onChange={(v) => set('delivery.freeShippingThreshold', Number(v))} />
          <Field label="Estimated Delivery" value={s.delivery?.estimatedDays} onChange={(v) => set('delivery.estimatedDays', v)} />

          <h2 className="pt-2 font-semibold">WhatsApp</h2>
          <div>
            <Field label="WhatsApp Link" value={s.whatsapp?.link} onChange={(v) => set('whatsapp.link', v)} />
            <p className="mt-1 text-xs text-slate">
              Paste a full link — e.g. <span className="font-mono">https://wa.me/2348031234567</span>,
              a <span className="font-mono">chat.whatsapp.com</span> group link, or a bit.ly link.
              Clicking any WhatsApp button opens it directly.
            </p>
          </div>
          <div>
            <Field label="Business Number (used if no link)" value={s.whatsapp?.number} onChange={(v) => set('whatsapp.number', v)} />
            <p className="mt-1 text-xs text-slate">
              International format, no “+”, spaces or leading zero — e.g. <span className="font-mono">2348031234567</span>.
            </p>
          </div>
          <Field label="Default Order Message" value={s.whatsapp?.defaultMessage} onChange={(v) => set('whatsapp.defaultMessage', v)} />
          <label className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-sm">
            Floating WhatsApp button
            <input type="checkbox" checked={s.whatsapp?.floatingEnabled} onChange={(e) => set('whatsapp.floatingEnabled', e.target.checked)} />
          </label>
        </div>
      </div>
    </form>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function pathGet(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj)
}
