import { Link } from 'react-router-dom'
import { asset, formatNaira } from '../../services/api'
import { useCart } from '../../context/CartContext'

export default function ProductCard({ product }) {
  const { toggleWishlist, inWishlist } = useCart()
  const price = product.discountPrice ?? product.price
  const saved = inWishlist(product._id)

  return (
    <div className="group relative">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-luxe bg-surface">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={asset(product.images?.[0])}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-105"
          />
          {product.discountPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-semibold text-obsidian">
              Sale
            </span>
          )}
          {product.newArrival && !product.discountPrice && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-obsidian">
              New
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass text-white transition-colors hover:text-gold"
      >
        <svg viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4" className="h-4 w-4 text-gold">
          <path d="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.3 5 5.5 5 7.5 5 9 6.3 12 9c3-2.7 4.5-4 6.5-4C21.7 5 23.4 8.4 22 11.7 19.5 16.4 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-luxe text-gold">{product.category}</p>
          <Link to={`/product/${product.slug}`} className="font-display text-sm text-white hover:text-gold">
            {product.name}
          </Link>
        </div>
        <div className="text-right">
          <p className="text-sm text-white">{formatNaira(price)}</p>
          {product.discountPrice && <p className="text-xs text-muted line-through">{formatNaira(product.price)}</p>}
        </div>
      </div>
    </div>
  )
}
