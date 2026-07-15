import GalleryCard from './GalleryCard'

// A single seamless row. The image sequence is duplicated so translating the
// track by -50% (or from -50%) lands exactly on the copy's start — no jump.
export default function MarqueeRow({ images, direction = 'left', duration = 50 }) {
  if (!images?.length) return null
  const sequence = [...images, ...images]

  return (
    <div className="marquee-row group relative overflow-hidden py-3">
      <div
        className={`marquee-track ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {sequence.map((image, i) => (
          <GalleryCard key={`${image}-${i}`} image={image} />
        ))}
      </div>
    </div>
  )
}
