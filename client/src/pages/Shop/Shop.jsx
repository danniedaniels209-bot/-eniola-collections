import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../services/api'
import ProductCard from '../../components/cards/ProductCard'
import { CATEGORIES } from '../../constants/products'

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'bestsellers', label: 'Best Sellers' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = params.get('category') || ''
  const sort = params.get('sort') || 'newest'
  const search = params.get('search') || ''
  const size = params.get('size') || ''
  const colour = params.get('colour') || ''
  const minPrice = params.get('minPrice') || ''
  const maxPrice = params.get('maxPrice') || ''
  const inStock = params.get('inStock') || ''
  const newArrival = params.get('newArrival') || ''
  const bestSeller = params.get('bestSeller') || ''

  const query = useMemo(() => {
    const q = new URLSearchParams()
    if (category) q.set('category', category)
    if (sort) q.set('sort', sort)
    if (search) q.set('search', search)
    if (size) q.set('size', size)
    if (colour) q.set('colour', colour)
    if (minPrice) q.set('minPrice', minPrice)
    if (maxPrice) q.set('maxPrice', maxPrice)
    if (inStock) q.set('inStock', inStock)
    if (newArrival) q.set('newArrival', newArrival)
    if (bestSeller) q.set('bestSeller', bestSeller)
    q.set('limit', '48')
    return q.toString()
  }, [category, sort, search, size, colour, minPrice, maxPrice, inStock, newArrival, bestSeller])

  useEffect(() => {
    setLoading(true)
    api.get(`/products?${query}`).then((d) => setItems(d.items || [])).finally(() => setLoading(false))
  }, [query])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  // Derive available sizes/colours from the current result set.
  const sizes = [...new Set(items.flatMap((p) => p.sizes || []))]
  const colours = [...new Set(items.flatMap((p) => p.colours || []))]

  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <header className="mb-10">
        <p className="mb-3 text-[11px] uppercase tracking-luxe text-gold">Shop</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
          {category || 'All Pieces'}
        </h1>
      </header>

      {/* Mobile filter toggle — keeps products above the fold on a phone. */}
      <button
        onClick={() => setFiltersOpen((v) => !v)}
        className="mb-5 flex w-full items-center justify-between rounded-full border border-white/15 px-5 py-3 text-sm text-white lg:hidden"
      >
        <span>Filters &amp; Sort</span>
        <span className={`transition-transform duration-300 ${filtersOpen ? 'rotate-180' : ''}`}>⌄</span>
      </button>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        {/* Filters */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} space-y-8 lg:block`}>
          <FilterGroup title="Category">
            <FilterPill active={!category} onClick={() => setParam('category', '')}>All</FilterPill>
            {CATEGORIES.map((c) => (
              <FilterPill key={c.name} active={category === c.name} onClick={() => setParam('category', c.name)}>
                {c.name}
              </FilterPill>
            ))}
          </FilterGroup>

          {sizes.length > 0 && (
            <FilterGroup title="Size">
              <FilterPill active={!size} onClick={() => setParam('size', '')}>Any</FilterPill>
              {sizes.map((s) => (
                <FilterPill key={s} active={size === s} onClick={() => setParam('size', s)}>{s}</FilterPill>
              ))}
            </FilterGroup>
          )}

          {colours.length > 0 && (
            <FilterGroup title="Colour">
              <FilterPill active={!colour} onClick={() => setParam('colour', '')}>Any</FilterPill>
              {colours.map((c) => (
                <FilterPill key={c} active={colour === c} onClick={() => setParam('colour', c)}>{c}</FilterPill>
              ))}
            </FilterGroup>
          )}

          <FilterGroup title="Price (₦)">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                defaultValue={minPrice}
                onBlur={(e) => setParam('minPrice', e.target.value)}
                className="w-20 rounded-lg border border-white/15 bg-surface px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
              />
              <span className="text-muted">–</span>
              <input
                type="number"
                placeholder="Max"
                defaultValue={maxPrice}
                onBlur={(e) => setParam('maxPrice', e.target.value)}
                className="w-20 rounded-lg border border-white/15 bg-surface px-2 py-1.5 text-xs text-white focus:border-gold focus:outline-none"
              />
            </div>
          </FilterGroup>

          <FilterGroup title="Availability">
            <FilterPill active={inStock === 'true'} onClick={() => setParam('inStock', inStock ? '' : 'true')}>
              In stock only
            </FilterPill>
            <FilterPill active={newArrival === 'true'} onClick={() => setParam('newArrival', newArrival ? '' : 'true')}>
              New arrivals
            </FilterPill>
            <FilterPill active={bestSeller === 'true'} onClick={() => setParam('bestSeller', bestSeller ? '' : 'true')}>
              Best sellers
            </FilterPill>
          </FilterGroup>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">{loading ? 'Loading…' : `${items.length} pieces`}</p>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="rounded-full border border-white/15 bg-surface px-4 py-2 text-sm text-white focus:border-gold focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="py-20 text-center text-sm text-muted">Curating…</p>
          ) : items.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted">No pieces match these filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-luxe text-muted">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
        active ? 'border-gold bg-gold text-obsidian' : 'border-white/15 text-muted hover:border-white/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
