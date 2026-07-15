import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Account() {
  const { user, ready, updateProfile, changePassword, logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState({ name: '', phone: '' })
  const [addresses, setAddresses] = useState([])
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' })
  const [msg, setMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')

  useEffect(() => {
    if (ready && !user) navigate('/login')
    if (user) {
      setProfile({ name: user.name || '', phone: user.phone || '' })
      setAddresses(user.addresses?.length ? user.addresses : [])
    }
  }, [user, ready, navigate])

  if (!user) return null

  const saveProfile = async (e) => {
    e.preventDefault()
    setMsg('')
    await updateProfile({ ...profile, addresses })
    setMsg('Profile saved ✓')
    setTimeout(() => setMsg(''), 2500)
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPwMsg('')
    try {
      await changePassword(pw.currentPassword, pw.newPassword)
      setPw({ currentPassword: '', newPassword: '' })
      setPwMsg('Password updated ✓')
    } catch (err) {
      setPwMsg(err.message)
    }
  }

  const addAddress = () => setAddresses((a) => [...a, { label: 'Home', line1: '', city: '', state: '', country: 'Nigeria', phone: '' }])
  const setAddr = (i, k, v) => setAddresses((a) => a.map((x, idx) => (idx === i ? { ...x, [k]: v } : x)))
  const removeAddr = (i) => setAddresses((a) => a.filter((_, idx) => idx !== i))

  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-luxe text-gold">My Account</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Hello, {user.name.split(' ')[0]}</h1>
          <p className="mt-2 text-sm text-muted">
            Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
          </p>
        </div>
        <Link to="/account/orders" className="rounded-full border border-white/15 px-6 py-3 text-sm text-white hover:border-gold hover:text-gold">
          My Orders →
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile */}
        <form onSubmit={saveProfile} className="rounded-luxe border border-white/10 bg-surface p-6">
          <h2 className="mb-5 font-display text-lg text-white">Profile Details</h2>
          <div className="space-y-4">
            <Field label="Full name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <Field label="Email" value={user.email} disabled />
            <Field label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-luxe text-muted">Delivery Addresses</h3>
            <button type="button" onClick={addAddress} className="text-xs text-gold hover:underline">+ Add address</button>
          </div>
          <div className="mt-3 space-y-4">
            {addresses.length === 0 && <p className="text-sm text-muted">No saved addresses yet.</p>}
            {addresses.map((a, i) => (
              <div key={i} className="rounded-lg border border-white/10 p-3">
                <div className="mb-2 flex justify-between">
                  <input value={a.label} onChange={(e) => setAddr(i, 'label', e.target.value)} className="bg-transparent text-sm font-medium text-gold focus:outline-none" />
                  <button type="button" onClick={() => removeAddr(i)} className="text-xs text-muted hover:text-red-400">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Address" value={a.line1} onChange={(e) => setAddr(i, 'line1', e.target.value)} className="col-span-2 rounded border border-white/10 bg-obsidian px-3 py-2 text-sm text-white focus:border-gold focus:outline-none" />
                  <input placeholder="City" value={a.city} onChange={(e) => setAddr(i, 'city', e.target.value)} className="rounded border border-white/10 bg-obsidian px-3 py-2 text-sm text-white focus:border-gold focus:outline-none" />
                  <input placeholder="State" value={a.state} onChange={(e) => setAddr(i, 'state', e.target.value)} className="rounded border border-white/10 bg-obsidian px-3 py-2 text-sm text-white focus:border-gold focus:outline-none" />
                </div>
              </div>
            ))}
          </div>

          {msg && <p className="mt-4 text-sm text-gold">{msg}</p>}
          <button className="mt-5 rounded-full bg-white px-8 py-3 text-sm font-semibold text-obsidian hover:scale-[1.02]">Save Profile</button>
        </form>

        {/* Change password + logout */}
        <div className="space-y-6">
          <form onSubmit={savePassword} className="rounded-luxe border border-white/10 bg-surface p-6">
            <h2 className="mb-5 font-display text-lg text-white">Change Password</h2>
            <div className="space-y-4">
              <Field label="Current password" type="password" value={pw.currentPassword} onChange={(v) => setPw({ ...pw, currentPassword: v })} />
              <Field label="New password" type="password" value={pw.newPassword} onChange={(v) => setPw({ ...pw, newPassword: v })} />
            </div>
            {pwMsg && <p className="mt-4 text-sm text-gold">{pwMsg}</p>}
            <button className="mt-5 rounded-full border border-white/15 px-8 py-3 text-sm text-white hover:border-gold hover:text-gold">Update Password</button>
          </form>

          <div className="rounded-luxe border border-white/10 bg-surface p-6">
            <button onClick={() => { logout(); navigate('/') }} className="text-sm text-muted hover:text-red-400">Log out of your account</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', disabled }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe text-muted">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-obsidian px-4 py-3 text-sm text-white focus:border-gold focus:outline-none disabled:opacity-50"
      />
    </div>
  )
}
