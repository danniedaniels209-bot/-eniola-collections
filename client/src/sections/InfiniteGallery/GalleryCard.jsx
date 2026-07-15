import { useState } from 'react'
import { asset } from '../../services/api'

// Purely decorative showroom imagery — no name, price or CTA. It lifts gently on
// hover; the surrounding row dims via the parent's group-hover rule.
export default function GalleryCard({ image }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative mx-3 h-[300px] w-[230px] flex-shrink-0 overflow-hidden rounded-luxe md:h-[380px] md:w-[290px]"
      style={{
        transform: hovered ? 'scale(1.04) translateZ(0)' : 'scale(1) translateZ(0)',
        boxShadow: hovered
          ? '0 30px 60px -20px rgba(0,0,0,0.8)'
          : '0 10px 30px -15px rgba(0,0,0,0.6)',
        transition:
          'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)',
        zIndex: hovered ? 20 : 1,
      }}
    >
      <img
        src={asset(image, 600)}
        alt=""
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
