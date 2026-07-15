import { Link } from 'react-router-dom'
import { asset, formatNaira } from '../../services/api'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, lineKey } = useCart()

  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <h1 className="mb-10 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Your Cart</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted">Your cart is empty.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.03]">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-white/10">
            {items.map((it) => {
              const key = lineKey(it)
              return (
                <div key={key} className="flex gap-4 py-5">
                  <div className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                    <img src={asset(it.image)} alt={it.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-display text-white">{it.name}</h3>
                        <p className="text-xs text-muted">
                          {[it.size, it.colour].filter(Boolean).join(' · ') || 'One size'}
                        </p>
                      </div>
                      <p className="text-white">{formatNaira(it.price * it.quantity)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-white/15 text-sm text-white">
                        <button onClick={() => updateQty(key, it.quantity - 1)} className="px-3 py-1.5">−</button>
                        <span className="w-8 text-center">{it.quantity}</span>
                        <button onClick={() => updateQty(key, it.quantity + 1)} className="px-3 py-1.5">+</button>
                      </div>
                      <button onClick={() => removeItem(key)} className="text-xs text-muted hover:text-red-400">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-luxe border border-white/10 bg-surface p-6">
            <h2 className="font-display text-lg text-white">Order Summary</h2>
            <div className="mt-5 flex justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span className="text-white">{formatNaira(subtotal)}</span>
            </div>
            <p className="mt-2 text-xs text-muted">Delivery calculated at checkout.</p>
            <Link
              to="/checkout"
              className="mt-6 block rounded-full bg-white px-8 py-[15px] text-center text-sm font-semibold text-obsidian transition-transform hover:scale-[1.02]"
            >
              Proceed to Checkout
            </Link>
            <Link to="/shop" className="mt-3 block text-center text-sm text-muted hover:text-gold">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
