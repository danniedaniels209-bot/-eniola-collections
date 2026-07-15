import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-6">
      <h1 className="mb-2 font-display text-4xl font-bold tracking-tight text-white">Create account</h1>
      <p className="mb-8 text-sm text-muted">Join the Êñiola inner circle.</p>

      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" value={form.name} onChange={(v) => set('name', v)} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => set('email', v)} />
        <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => set('password', v)} />
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <button disabled={busy} className="w-full rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.02] disabled:opacity-50">
          {busy ? 'Creating…' : 'Create Account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-gold hover:underline">Sign in</Link>
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
