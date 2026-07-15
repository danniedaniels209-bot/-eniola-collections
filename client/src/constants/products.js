// Static category metadata (names + local fallback imagery shipped in /public).
// Live product data now comes from the API; the admin's category images can
// override these once uploaded.

export const CATEGORIES = [
  { name: 'Abayas', image: '/images/products/abaya.png' },
  { name: 'Hijabs', image: '/images/products/hijab.png' },
  { name: 'Sneakers', image: '/images/products/sneaker.png' },
  { name: 'Corporate Shoes', image: '/images/products/corporate-shoe.png' },
  { name: 'Handbags', image: '/images/products/handbag.png' },
  { name: 'Accessories', image: '/images/products/sneaker-black.png' },
]

// Row motion config for the infinite gallery. Products are distributed across
// these rows at runtime from the live catalogue.
export const ROW_CONFIG = [
  { id: 'row-1', direction: 'left', duration: 46 },
  { id: 'row-2', direction: 'right', duration: 54 },
  { id: 'row-3', direction: 'left', duration: 62 },
]
