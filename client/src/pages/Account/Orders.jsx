import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, asset, formatNaira } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const STATUS_COLOR = {
  pending: 'text-amber-400',
  accepted: 'text-blue-400',
  packed: 'text-blue-400',
  shipped: 'text-indigo-400',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
  refunded: 'text-red-400',
}

export default function Orders() {
  const { user, ready } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState(null)

  const load = () => api.get('/orders/mine').then((d) => setOrders(d.items))

  useEffect(() => {
    if (ready && !user) return navigate('/login')
    if (user) load()
  }, [user, ready, navigate])

  const cancel = async (id) => {
    if (!confirm('Cancel this order?')) return
    await api.put(`/orders/${id}/cancel`)
    load()
  }

  const invoice = (o) => {
    const w = window.open('', '_blank')
    w.document.write(`
      <html><head><title>${o.orderNumber}</title>
      <style>body{font-family:Inter,system-ui,sans-serif;padding:40px;color:#111}h1{margin:0}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border-bottom:1px solid #eee;padding:8px;text-align:left}</style>
      </head><body>
      <h1>Êñiola Collections</h1><p>Invoice ${o.orderNumber} · ${new Date(o.createdAt).toLocaleDateString()}</p>
      <p>${o.contact?.name} · ${o.contact?.phone}<br/>${o.delivery?.line1}, ${o.delivery?.city}, ${o.delivery?.state}</p>
      <table><tr><th>Item</th><th>Qty</th><th>Price</th></tr>
      ${o.items.map((it) => `<tr><td>${it.name} ${it.size ? '· ' + it.size : ''}</td><td>${it.quantity}</td><td>₦${(it.price * it.quantity).toLocaleString()}</td></tr>`).join('')}
      </table>
      <h3 style="text-align:right;margin-top:20px">Total: ₦${o.total.toLocaleString()}</h3>
      </body></html>`)
    w.document.close()
    w.print()
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-container px-6 md:px-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">My Orders</h1>
        <Link to="/account" className="text-sm text-muted hover:text-gold">← Account</Link>
      </div>

      {!orders ? (
        <p className="py-20 text-center text-muted">Loading…</p>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-white px-8 py-[15px] text-sm font-semibold text-obsidian hover:scale-[1.03]">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="rounded-luxe border border-white/10 bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="font-display text-white">{o.orderNumber}</p>
                  <p className="text-xs text-muted">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium capitalize ${STATUS_COLOR[o.status] || 'text-muted'}`}>{o.status}</p>
                  <p className="text-sm text-white">{formatNaira(o.total)}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                {o.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-14 w-12 overflow-hidden rounded-lg bg-obsidian">
                      {it.image && <img src={asset(it.image)} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="text-xs text-muted">
                      <p className="text-white">{it.name}</p>
                      <p>{[it.size, it.colour].filter(Boolean).join(' · ')} × {it.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={() => invoice(o)} className="rounded-full border border-white/15 px-5 py-2 text-xs text-white hover:border-gold hover:text-gold">
                  Download Invoice
                </button>
                {o.status === 'pending' && (
                  <button onClick={() => cancel(o._id)} className="rounded-full border border-red-500/40 px-5 py-2 text-xs text-red-400 hover:bg-red-500/10">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
