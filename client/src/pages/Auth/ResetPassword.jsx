import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { api, setToken } from '../../services/api'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [token, setTok] = useState(params.get('token') || '')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const d = await api.post('/auth/reset-password', { token, newPassword })
      setToken(d.token)
      navigate('/account')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6">
      <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">Reset password</h1>
      <p className="mb-8 text-sm text-muted">Choose a new password for your account.</p>

      <form onSubmit={submit} className="space-y-4">
        {!params.get('token') && (
          <input
            required
            placeholder="Reset token"
            value={token}
            onChange={(e) => setTok(e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
          />
        )}
        <input
          type="password"
          required
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
        />
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.02] disabled:opacity-50">
          {busy ? 'Resetting…' : 'Reset Password'}
        </button>
        <Link to="/login" className="block text-center text-sm text-muted hover:text-gold">Back to sign in</Link>
      </form>
    </div>
  )
}
