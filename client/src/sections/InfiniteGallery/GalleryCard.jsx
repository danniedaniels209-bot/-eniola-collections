import { useState } from 'react'
import { Link } from 'react-router-dom'
import { asset, formatNaira } from '../../services/api'

export default function GalleryCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const price = product.discountPrice ?? product.price

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative mx-3 h-[300px] w-[230px] flex-shrink-0 overflow-hidden rounded-luxe md:h-[380px] md:w-[290px]"
      style={{
        transform: hovered ? 'scale(1.05) translateZ(0)' : 'scale(1) translateZ(0)',
        boxShadow: hovered ? '0 30px 60px -20px rgba(0,0,0,0.8)' : '0 10px 30px -15px rgba(0,0,0,0.6)',
        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)',
        zIndex: hovered ? 20 : 1,
      }}
    >
      <img
        src={asset(product.images?.[0], 600)}
        alt={product.name}
        loading="lazy"
        draggable={false}
        className="h-full w-full object-cover"
      />

      <div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.92), rgba(5,5,5,0.3) 60%, transparent)',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div>
          <p className="text-[10px] uppercase tracking-luxe text-gold">{product.category}</p>
          <h3 className="mt-1 font-display text-lg font-medium text-white">{product.name}</h3>
          <p className="text-sm text-muted">{formatNaira(price)}</p>
        </div>
        <Link
          to={`/product/${product.slug}`}
          className="glass w-fit rounded-full px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/15"
        >
          View Product
        </Link>
      </div>
    </div>
  )
}
