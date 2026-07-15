import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6">
      <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">Welcome back</h1>
      <p className="mb-8 text-sm text-muted">Sign in to your Êñiola account.</p>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <div className="text-right">
          <Link to="/forgot-password" className="text-xs text-muted hover:text-gold">Forgot password?</Link>
        </div>
        <button disabled={busy} className="w-full rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.02] disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="text-gold hover:underline">Create an account</Link>
      </p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe text-muted">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-surface px-4 py-3 text-sm text-white focus:border-gold focus:outline-none"
      />
    </div>
  )
}
