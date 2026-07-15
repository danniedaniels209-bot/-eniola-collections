import GalleryCard from './GalleryCard'

// A single seamless row. The product sequence is duplicated so translating the
// track by -50% (or from -50%) lands exactly on the copy's start — no jump.
export default function MarqueeRow({ products, direction = 'left', duration = 50 }) {
  if (!products?.length) return null
  const sequence = [...products, ...products]

  return (
    <div className="marquee-row group relative overflow-hidden py-3">
      <div
        className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {sequence.map((product, i) => (
          <GalleryCard key={`${product._id}-${i}`} product={product} />
        ))}
      </div>
    </div>
  )
}
