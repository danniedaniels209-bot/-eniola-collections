import { useEffect, useRef, useState } from 'react'
import { api, asset } from '../services/api'
import { PageHeader, Spinner } from '../components/ui'

export default function Homepage() {
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState('')
  const videoRef = useRef()
  const imageRef = useRef()

  useEffect(() => {
    api.get('/homepage').then((d) => setForm(d.homepage))
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const uploadOne = async (folder, file, key) => {
    setUploading(key)
    try {
      const d = await api.upload(folder, [file])
      set(key, d.files[0].url)
    } finally {
      setUploading('')
    }
  }

  const save = async (e) => {
    e.preventDefault()
    const d = await api.put('/admin/homepage', form)
    setForm(d.homepage)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!form) return <Spinner />

  return (
    <form onSubmit={save}>
      <PageHeader
        title="Homepage Manager"
        subtitle="Update the storefront hero and content — no code required."
        actions={
          <button className="btn-primary">{saved ? 'Saved ✓' : 'Save changes'}</button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4 p-5">
          <h2 className="font-semibold">Hero</h2>
          <div>
            <label className="label">Headline</label>
            <input className="input" value={form.headline || ''} onChange={(e) => set('headline', e.target.value)} />
          </div>
          <div>
            <label className="label">Subheading</label>
            <textarea className="input" value={form.subheading || ''} onChange={(e) => set('subheading', e.target.value)} />
          </div>

          <div>
            <label className="label">Hero Video</label>
            {form.heroVideo && (
              <video src={asset(form.heroVideo)} className="mb-2 h-40 w-full rounded-lg object-cover" muted loop autoPlay />
            )}
            <button type="button" onClick={() => videoRef.current?.click()} className="btn-ghost text-xs">
              {uploading === 'heroVideo' ? 'Uploading…' : 'Replace video'}
            </button>
            <input ref={videoRef} type="file" accept="video/mp4,video/webm" hidden
              onChange={(e) => e.target.files[0] && uploadOne('hero', e.target.files[0], 'heroVideo')} />
          </div>

          <div>
            <label className="label">Hero Image (fallback)</label>
            {form.heroImage && <img src={asset(form.heroImage)} alt="" className="mb-2 h-40 w-full rounded-lg object-cover" />}
            <button type="button" onClick={() => imageRef.current?.click()} className="btn-ghost text-xs">
              {uploading === 'heroImage' ? 'Uploading…' : 'Replace image'}
            </button>
            <input ref={imageRef} type="file" accept="image/*" hidden
              onChange={(e) => e.target.files[0] && uploadOne('hero', e.target.files[0], 'heroImage')} />
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="font-semibold">Category Order</h2>
          <p className="text-sm text-slate">Comma-separated category names in display order.</p>
          <textarea
            className="input min-h-[80px]"
            value={(form.categoryOrder || []).join(', ')}
            onChange={(e) => set('categoryOrder', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />

          <h2 className="pt-2 font-semibold">Promotional Banner</h2>
          <input
            className="input"
            placeholder="Promo title"
            value={form.promos?.[0]?.title || ''}
            onChange={(e) => set('promos', [{ ...(form.promos?.[0] || {}), title: e.target.value, active: true }])}
          />
          <input
            className="input"
            placeholder="Promo subtitle"
            value={form.promos?.[0]?.subtitle || ''}
            onChange={(e) => set('promos', [{ ...(form.promos?.[0] || {}), subtitle: e.target.value, active: true }])}
          />
        </div>
      </div>
    </form>
  )
}
