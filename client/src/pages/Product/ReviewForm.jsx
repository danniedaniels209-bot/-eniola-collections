import { useState } from 'react'
import { api } from '../../services/api'

export default function ReviewForm({ productId, onSubmitted }) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.post(`/reviews/product/${productId}`, { rating, text })
      setDone(true)
      setText('')
      onSubmitted?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (done)
    return (
      <div className="rounded-luxe border border-white/10 bg-surface p-5 text-sm text-gold">
        Thank you! Your review has been submitted and will appear once approved.
      </div>
    )

  return (
    <form onSubmit={submit} className="rounded-luxe border border-white/10 bg-surface p-5">
      <p className="mb-3 text-sm font-medium text-white">Write a review</p>
      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className={`text-2xl ${(hover || rating) >= n ? 'text-gold' : 'text-white/20'}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        required
        rows={3}
        placeholder="Share your thoughts…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-obsidian px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <button disabled={busy} className="mt-3 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-obsidian hover:scale-[1.02] disabled:opacity-50">
        {busy ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
