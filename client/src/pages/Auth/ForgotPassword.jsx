import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [devToken, setDevToken] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    const d = await api.post('/auth/forgot-password', { email })
    setSent(true)
    // In dev (no email provider) the API returns the token so you can proceed.
    if (d.devToken) setDevToken(d.devToken)
  }

  return (
    <div className="mx-auto max-w-md px-6">
      <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">Forgot password</h1>
      <p className="mb-8 text-sm text-muted">Enter your email and we'll send a reset link.</p>

      {sent ? (
        <div className="rounded-luxe border border-white/10 bg-surface p-6 text-sm text-muted">
          <p>If that email exists, a reset link has been sent.</p>
          {devToken && (
            <p className="mt-4">
              Dev token (no email configured):{' '}
              <Link to={`/reset-password?token=${devToken}`} className="break-all text-gold hover:underline">
                Reset now →
              </Link>
            </p>
          )}
          <Link to="/login" className="mt-4 inline-block text-gold hover:underline">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
          />
          <button className="w-full rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.02]">
            Send Reset Link
          </button>
          <Link to="/login" className="block text-center text-sm text-muted hover:text-gold">Back to sign in</Link>
        </form>
      )}
    </div>
  )
}
