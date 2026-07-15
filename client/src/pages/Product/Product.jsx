import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api, asset, formatNaira, whatsappUrl } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import ProductCard from '../../components/cards/ProductCard'
import ReviewForm from './ReviewForm'

export default function Product() {
  const { slug } = useParams()
  const { addToCart, toggleWishlist, inWishlist } = useCart()
  const { user } = useAuth()

  const [data, setData] = useState(null)
  const [reviews, setReviews] = useState([])
  const [settings, setSettings] = useState(null)
  const [active, setActive] = useState(0)
  const [size, setSize] = useState('')
  const [colour, setColour] = useState('')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    setData(null)
    api.get(`/products/${slug}`).then((d) => {
      setData(d)
      setActive(0)
      setSize(d.product.sizes?.[0] || '')
      setColour(d.product.colours?.[0] || '')
      api.get(`/reviews/product/${d.product._id}`).then((r) => setReviews(r.items)).catch(() => {})
    }).catch((e) => setError(e.message))
    api.get('/settings').then((d) => setSettings(d.settings)).catch(() => {})
  }, [slug])

  if (error) return <p className="mx-auto max-w-container px-6 text-center text-muted">{error}</p>
  if (!data) return <p className="mx-auto max-w-container px-6 py-20 text-center text-muted">Loading…</p>

  const p = data.product
  const price = p.discountPrice ?? p.price
  const images = p.images?.length ? p.images : ['']

  const add = () => {
    addToCart(p, { size, colour, quantity: qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  // Pre-fill product details only works with a plain number; a custom link opens as-is.
  const orderMsg = `Hello Êñiola Collections! I'd like to order:\n\n*${p.name}*\nSize: ${size || '—'} · Colour: ${colour || '—'} · Qty: ${qty}\nPrice: ${formatNaira(price)}`
  const waUrl = whatsappUrl(settings?.whatsapp, orderMsg)

  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-luxe bg-surface">
            <img src={asset(images[active], 1200)} alt={p.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-20 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                    active === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={asset(img, 160)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:pt-4">
          <p className="mb-3 text-[11px] uppercase tracking-luxe text-gold">{p.category}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">{p.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl text-white">{formatNaira(price)}</span>
            {p.discountPrice && <span className="text-lg text-muted line-through">{formatNaira(p.price)}</span>}
          </div>

          {p.ratingCount > 0 && (
            <p className="mt-2 text-sm text-gold">
              {'★'.repeat(Math.round(p.ratingAvg))}
              <span className="ml-2 text-muted">{p.ratingAvg} · {p.ratingCount} reviews</span>
            </p>
          )}

          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">{p.description || 'A signature Êñiola piece.'}</p>

          {p.colours?.length > 0 && (
            <Options label="Colour" options={p.colours} value={colour} onChange={setColour} />
          )}
          {p.sizes?.length > 0 && (
            <Options label="Size" options={p.sizes} value={size} onChange={setSize} />
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-luxe text-muted">Quantity</p>
            <div className="inline-flex items-center rounded-full border border-white/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-white">−</button>
              <span className="w-10 text-center text-white">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-white">+</button>
            </div>
          </div>

          <p className={`mt-4 text-sm ${p.stock > 0 ? 'text-muted' : 'text-red-400'}`}>
            {p.stock > 0 ? `In stock · ${p.stock} available` : 'Out of stock'}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={add}
              disabled={p.stock === 0}
              className="rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian transition-transform duration-300 hover:scale-[1.03] disabled:opacity-40"
            >
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#25D366] px-8 py-[15px] text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
              >
                Order on WhatsApp
              </a>
            )}
            <button
              onClick={() => toggleWishlist(p)}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/15 text-gold transition-colors hover:border-gold"
              aria-label="Wishlist"
            >
              <svg viewBox="0 0 24 24" fill={inWishlist(p._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4" className="h-5 w-5">
                <path d="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.3 5 5.5 5 7.5 5 9 6.3 12 9c3-2.7 4.5-4 6.5-4C21.7 5 23.4 8.4 22 11.7 19.5 16.4 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-24">
        <h2 className="mb-8 font-display text-2xl font-bold text-white md:text-3xl">Customer Reviews</h2>

        <div className="mb-10">
          {user ? (
            <ReviewForm
              productId={p._id}
              onSubmitted={() => api.get(`/reviews/product/${p._id}`).then((r) => setReviews(r.items))}
            />
          ) : (
            <p className="rounded-luxe border border-white/10 bg-surface p-5 text-sm text-muted">
              <Link to="/login" className="text-gold hover:underline">Sign in</Link> to leave a review.
            </p>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-muted">No reviews yet — be the first to share yours.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map((r) => (
              <div key={r._id} className="glass rounded-luxe p-6">
                <div className="flex items-center justify-between">
                  <span className="text-gold">{'★'.repeat(r.rating)}</span>
                  {r.verified && <span className="text-[10px] uppercase tracking-luxe text-gold">Verified</span>}
                </div>
                <p className="mt-3 text-sm text-white/90">{r.text}</p>
                <p className="mt-3 text-xs text-muted">
                  {r.name} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
                {r.reply && <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-muted">↳ {r.reply}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {data.related?.length > 0 && (
        <section className="mt-24">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">You May Also Like</h2>
            <Link to="/shop" className="text-sm text-white hover:text-gold">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {data.related.map((rp) => (
              <ProductCard key={rp._id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Options({ label, options, value, onChange }) {
  return (
    <div className="mt-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-luxe text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              value === o ? 'border-gold bg-gold text-obsidian' : 'border-white/15 text-white hover:border-white/40'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
