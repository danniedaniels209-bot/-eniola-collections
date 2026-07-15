import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, formatNaira } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const PAY_LABELS = {
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
  cod: 'Cash on Delivery',
  bankTransfer: 'Bank Transfer',
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [settings, setSettings] = useState(null)
  const [contact, setContact] = useState({ name: user?.name || '', email: user?.email || '', phone: '' })
  const [delivery, setDelivery] = useState({ line1: '', city: '', state: '', country: 'Nigeria' })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/settings').then((d) => {
      setSettings(d.settings)
      const first = Object.entries(d.settings.payments || {}).find(([, on]) => on)?.[0]
      if (first) setPaymentMethod(first === 'bankTransfer' ? 'bank_transfer' : first)
    })
  }, [])

  const fee = subtotal >= (settings?.delivery?.freeShippingThreshold ?? Infinity) ? 0 : settings?.delivery?.fee ?? 0
  const discount = coupon ? (coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value) : 0
  const total = Math.max(0, subtotal - discount) + fee

  const applyCoupon = async () => {
    setCouponError('')
    try {
      const d = await api.get(`/coupons/validate/${couponCode}`)
      setCoupon(d.coupon)
    } catch (e) {
      setCoupon(null)
      setCouponError(e.message)
    }
  }

  const placeOrder = async (e) => {
    e.preventDefault()
    setPlacing(true)
    setError('')
    try {
      const d = await api.post('/orders', {
        items: items.map((it) => ({ product: it.id, size: it.size, colour: it.colour, quantity: it.quantity })),
        contact,
        delivery: { ...delivery, fee },
        couponCode: coupon ? couponCode : undefined,
        paymentMethod,
      })
      clearCart()
      setDone(d.order)
    } catch (err) {
      setError(err.message)
      setPlacing(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl text-obsidian">✓</div>
        <h1 className="font-display text-3xl font-bold text-white">Order Confirmed</h1>
        <p className="mt-3 text-muted">
          Thank you, {done.contact?.name}. Your order <span className="text-gold">{done.orderNumber}</span> has been received.
        </p>
        <p className="mt-1 text-sm text-muted">Total: {formatNaira(done.total)} · {PAY_LABELS[done.paymentMethod] || done.paymentMethod}</p>
        <Link to="/shop" className="mt-8 inline-block rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.03]">
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-container px-6 py-20 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian">Shop Now</Link>
      </div>
    )
  }

  const enabledPayments = Object.entries(settings?.payments || { cod: true })
    .filter(([, on]) => on)
    .map(([k]) => (k === 'bankTransfer' ? 'bank_transfer' : k))

  return (
    <form onSubmit={placeOrder} className="mx-auto max-w-container px-6 md:px-10">
      <h1 className="mb-10 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Checkout</h1>

      {error && <p className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <Section title="Contact">
            <Input label="Full name" value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} required />
              <Input label="Phone" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} required />
            </div>
          </Section>

          <Section title="Delivery Address">
            <Input label="Address" value={delivery.line1} onChange={(v) => setDelivery({ ...delivery, line1: v })} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" value={delivery.city} onChange={(v) => setDelivery({ ...delivery, city: v })} required />
              <Input label="State" value={delivery.state} onChange={(v) => setDelivery({ ...delivery, state: v })} required />
            </div>
            {settings?.delivery?.estimatedDays && (
              <p className="text-xs text-muted">Estimated delivery: {settings.delivery.estimatedDays}</p>
            )}
          </Section>

          <Section title="Payment">
            <div className="space-y-2">
              {enabledPayments.map((m) => (
                <label
                  key={m}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                    paymentMethod === m ? 'border-gold text-white' : 'border-white/15 text-muted'
                  }`}
                >
                  <input type="radio" name="pay" checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                  {PAY_LABELS[m] || PAY_LABELS[m === 'bank_transfer' ? 'bankTransfer' : m]}
                </label>
              ))}
            </div>
            {['paystack', 'flutterwave'].includes(paymentMethod) && (
              <p className="text-xs text-muted">
                You'll be redirected to complete payment securely. (Gateway keys are configured in production.)
              </p>
            )}
          </Section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-luxe border border-white/10 bg-surface p-6">
          <h2 className="font-display text-lg text-white">Your Order</h2>
          <div className="mt-4 max-h-52 space-y-3 overflow-auto">
            {items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted">{it.name} ×{it.quantity}</span>
                <span className="text-white">{formatNaira(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <input
              className="w-full rounded-full border border-white/15 bg-obsidian px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-gold focus:outline-none"
              placeholder="Promo code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            <button type="button" onClick={applyCoupon} className="rounded-full border border-white/15 px-4 text-sm text-white hover:border-gold">
              Apply
            </button>
          </div>
          {couponError && <p className="mt-2 text-xs text-red-400">{couponError}</p>}
          {coupon && <p className="mt-2 text-xs text-gold">Coupon {coupon.code} applied.</p>}

          <div className="mt-5 space-y-2 border-t border-white/10 pt-5 text-sm">
            <Row label="Subtotal" value={formatNaira(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`−${formatNaira(discount)}`} />}
            <Row label="Delivery" value={fee === 0 ? 'Free' : formatNaira(fee)} />
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="mt-6 w-full rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {placing ? 'Placing order…' : 'Complete Purchase'}
          </button>
        </aside>
      </div>
    </form>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-luxe border border-white/10 bg-surface p-6">
      <h2 className="mb-4 font-display text-lg text-white">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
function Input({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-luxe text-muted">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/15 bg-obsidian px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
      />
    </div>
  )
}
function Row({ label, value }) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  )
}
