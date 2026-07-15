import { Link } from 'react-router-dom'
import { asset, formatNaira } from '../../services/api'
import { useCart } from '../../context/CartContext'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart()

  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <h1 className="mb-10 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.03]">
            Explore the Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {wishlist.map((w) => (
            <div key={w.id} className="group">
              <Link to={w.slug ? `/product/${w.slug}` : '/shop'} className="block overflow-hidden rounded-luxe bg-surface">
                <img src={asset(w.image)} alt={w.name} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </Link>
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-sm text-white">{w.name}</h3>
                  <p className="text-sm text-muted">{formatNaira(w.price)}</p>
                </div>
                <button onClick={() => toggleWishlist({ _id: w.id })} className="text-xs text-muted hover:text-red-400">
                  Remove
                </button>
              </div>
              <button
                onClick={() => addToCart({ _id: w.id, name: w.name, price: w.price, image: w.image })}
                className="mt-3 w-full rounded-full border border-white/15 py-2 text-xs text-white transition-colors hover:border-gold hover:text-gold"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
