import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => load('eniola_cart', []))
  const [wishlist, setWishlist] = useState(() => load('eniola_wishlist', []))

  useEffect(() => {
    localStorage.setItem('eniola_cart', JSON.stringify(items))
  }, [items])
  useEffect(() => {
    localStorage.setItem('eniola_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // A cart line is unique per product + size + colour combination.
  const lineKey = (p) => `${p.id}|${p.size || ''}|${p.colour || ''}`

  const addToCart = (product, { size, colour, quantity = 1 } = {}) => {
    setItems((prev) => {
      const entry = {
        id: product._id || product.id,
        name: product.name,
        price: product.discountPrice ?? product.price,
        image: product.images?.[0] || product.image,
        size,
        colour,
        quantity,
      }
      const key = lineKey(entry)
      const existing = prev.find((it) => lineKey(it) === key)
      if (existing) {
        return prev.map((it) => (lineKey(it) === key ? { ...it, quantity: it.quantity + quantity } : it))
      }
      return [...prev, entry]
    })
  }

  const updateQty = (key, quantity) =>
    setItems((prev) => prev.map((it) => (lineKey(it) === key ? { ...it, quantity: Math.max(1, quantity) } : it)))

  const removeItem = (key) => setItems((prev) => prev.filter((it) => lineKey(it) !== key))
  const clearCart = () => setItems([])

  const toggleWishlist = (product) => {
    const id = product._id || product.id
    setWishlist((prev) =>
      prev.some((w) => w.id === id)
        ? prev.filter((w) => w.id !== id)
        : [...prev, { id, name: product.name, price: product.discountPrice ?? product.price, image: product.images?.[0] || product.image, slug: product.slug }]
    )
  }
  const inWishlist = (id) => wishlist.some((w) => w.id === id)

  const count = useMemo(() => items.reduce((s, it) => s + it.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        toggleWishlist,
        inWishlist,
        count,
        subtotal,
        lineKey,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
