import { useEffect, useRef, useState } from 'react'
import { api, asset } from '../services/api'
import { PageHeader, Spinner } from '../components/ui'

export default function Homepage() {
  const [form, setForm] = useState(null)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState('')
  const videoRef = useRef()
  const imageRef = useRef()
  const galleryRef = useRef()

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

  // The sliding gallery is decorative and owner-curated — it is not tied to the
  // product catalogue, so it never empties when products change.
  const addGalleryImages = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading('gallery')
    try {
      const d = await api.upload('products', files)
      set('galleryImages', [...(form.galleryImages || []), ...d.files.map((f) => f.url)])
    } finally {
      setUploading('')
      if (galleryRef.current) galleryRef.current.value = ''
    }
  }
  const removeGalleryImage = (url) =>
    set('galleryImages', (form.galleryImages || []).filter((u) => u !== url))
  const moveGalleryImage = (i, dir) => {
    const next = [...(form.galleryImages || [])]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    set('galleryImages', next)
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

        {/* Infinite sliding gallery */}
        <div className="card space-y-4 p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold">Infinite Sliding Gallery</h2>
              <p className="text-xs text-slate">
                The moving showroom rows on the homepage. These stay exactly as you set them —
                adding or deleting products never changes them.
              </p>
            </div>
            <button type="button" onClick={() => galleryRef.current?.click()} className="btn-ghost text-xs">
              {uploading === 'gallery' ? 'Uploading…' : '+ Add images'}
            </button>
            <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={addGalleryImages} />
          </div>

          {(form.galleryImages?.length ?? 0) === 0 ? (
            <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-slate">
              No gallery images yet. Add a few and they'll slide across the homepage.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
              {form.galleryImages.map((url, i) => (
                <div key={url} className="group relative overflow-hidden rounded-lg border border-line">
                  <img src={asset(url)} alt="" className="aspect-[3/4] w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-1 py-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button type="button" onClick={() => moveGalleryImage(i, -1)} className="text-[10px] text-white">◀</button>
                    <button type="button" onClick={() => removeGalleryImage(url)} className="text-[10px] text-red-300">✕</button>
                    <button type="button" onClick={() => moveGalleryImage(i, 1)} className="text-[10px] text-white">▶</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate">
            {form.galleryImages?.length ?? 0} image(s) — dealt across 3 rows moving in alternating directions.
          </p>
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
