import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, asset } from '../services/api'
import { PageHeader, Spinner } from '../components/ui'

const BLANK = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  sizes: '',
  colours: '',
  stock: 0,
  sku: '',
  tags: '',
  images: [],
  featured: false,
  bestSeller: false,
  newArrival: false,
  status: 'draft',
}

// Comma-joined string <-> array helpers for the tag-like fields.
const toArr = (s) => (s || '').split(',').map((x) => x.trim()).filter(Boolean)
const toStr = (a) => (a || []).join(', ')

export default function ProductForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const fileRef = useRef()

  const [form, setForm] = useState(BLANK)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/categories').then((d) => setCategories(d.items)).catch(() => {})
    if (editing) {
      api
        .get(`/admin/products/${id}`)
        .then((d) => {
          const p = d.product
          setForm({
            ...p,
            sizes: toStr(p.sizes),
            colours: toStr(p.colours),
            tags: toStr(p.tags),
            price: p.price ?? '',
            discountPrice: p.discountPrice ?? '',
          })
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [id, editing])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const onUpload = async (e) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      const d = await api.upload('products', files)
      set('images', [...form.images, ...d.files.map((f) => f.url)])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = (url) => set('images', form.images.filter((u) => u !== url))
  const makeCover = (url) => set('images', [url, ...form.images.filter((u) => u !== url)])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      discountPrice: form.discountPrice === '' ? null : Number(form.discountPrice),
      stock: Number(form.stock) || 0,
      sizes: toArr(form.sizes),
      colours: toArr(form.colours),
      tags: toArr(form.tags),
    }
    try {
      if (editing) await api.put(`/admin/products/${id}`, payload)
      else await api.post('/admin/products', payload)
      navigate('/products')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <form onSubmit={save}>
      <PageHeader
        title={editing ? 'Edit Product' : 'Add Product'}
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => navigate('/products')} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Product'}
            </button>
          </div>
        }
      />

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card space-y-4 p-5">
            <div>
              <label className="label">Product Name</label>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input min-h-[120px]"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price (₦)</label>
                <input type="number" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} required />
              </div>
              <div>
                <label className="label">Discount Price (₦)</label>
                <input type="number" className="input" value={form.discountPrice} onChange={(e) => set('discountPrice', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Sizes (comma separated)</label>
                <input className="input" value={form.sizes} onChange={(e) => set('sizes', e.target.value)} placeholder="S, M, L, XL" />
              </div>
              <div>
                <label className="label">Colours (comma separated)</label>
                <input className="input" value={form.colours} onChange={(e) => set('colours', e.target.value)} placeholder="Black, Cream" />
              </div>
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <input className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="editorial, silk" />
            </div>
          </div>

          {/* Images */}
          <div className="card space-y-4 p-5">
            <div className="flex items-center justify-between">
              <label className="label mb-0">Product Images</label>
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost text-xs">
                {uploading ? 'Uploading…' : '+ Upload images'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onUpload} />
            </div>
            {form.images.length === 0 ? (
              <p className="text-sm text-slate">No images yet. First image becomes the cover.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {form.images.map((url, i) => (
                  <div key={url} className="group relative overflow-hidden rounded-lg border border-line">
                    <img src={asset(url)} alt="" className="aspect-square w-full object-cover" />
                    {i === 0 && (
                      <span className="badge absolute left-1 top-1 bg-brand text-white">Cover</span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {i !== 0 && (
                        <button type="button" onClick={() => makeCover(url)} className="text-[10px] text-white">
                          Set cover
                        </button>
                      )}
                      <button type="button" onClick={() => removeImage(url)} className="text-[10px] text-red-300">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card space-y-4 p-5">
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Stock</label>
                <input type="number" className="input" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
              </div>
              <div>
                <label className="label">SKU</label>
                <input className="input" value={form.sku} onChange={(e) => set('sku', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card space-y-3 p-5">
            <label className="label">Merchandising</label>
            {[
              ['featured', 'Featured Product'],
              ['bestSeller', 'Best Seller'],
              ['newArrival', 'New Arrival'],
            ].map(([k, lbl]) => (
              <label key={k} className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
                {lbl}
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  )
}
