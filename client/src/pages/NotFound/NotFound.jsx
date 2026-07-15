import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-container px-6 py-32 text-center">
      <p className="font-display text-7xl font-bold text-gold">404</p>
      <h1 className="mt-4 font-display text-2xl text-white">This page has slipped off the rail.</h1>
      <Link to="/" className="mt-8 inline-block rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.03]">
        Back to Showroom
      </Link>
    </div>
  )
}
