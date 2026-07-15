import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner, StatusBadge, Empty, naira } from '../components/ui'

const STATUSES = ['pending', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function Orders() {
  const [items, setItems] = useState(null)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)

  const load = () => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    api.get(`/admin/orders?${params}`).then((d) => setItems(d.items))
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const setOrderStatus = async (id, next) => {
    await api.put(`/admin/orders/${id}/status`, { status: next })
    load()
    if (selected?._id === id) setSelected((s) => ({ ...s, status: next }))
  }

  return (
    <div>
      <PageHeader title="Orders" subtitle="Accept, ship, deliver and track orders." />

      <div className="mb-4 flex gap-2">
        <select className="input w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All orders</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {!items ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Empty>No orders yet.</Empty>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((o) => (
                <tr key={o._id} className="cursor-pointer hover:bg-canvas/60" onClick={() => setSelected(o)}>
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-slate">{o.customer?.name || o.contact?.name || 'Guest'}</td>
                  <td className="px-4 py-3">{naira(o.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      className="input w-32 py-1 text-right"
                      value={o.status}
                      onChange={(e) => setOrderStatus(o._id, e.target.value)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="card max-h-[85vh] w-full max-w-lg overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)} className="text-slate hover:text-ink">✕</button>
            </div>
            <div className="space-y-1 text-sm text-slate">
              <p><span className="font-medium text-ink">Customer:</span> {selected.contact?.name} · {selected.contact?.email} · {selected.contact?.phone}</p>
              <p><span className="font-medium text-ink">Deliver to:</span> {selected.delivery?.line1}, {selected.delivery?.city}, {selected.delivery?.state}</p>
              <p><span className="font-medium text-ink">Payment:</span> {selected.paymentMethod} ({selected.paymentStatus})</p>
            </div>
            <div className="mt-4 divide-y divide-line border-y border-line">
              {selected.items?.map((it, i) => (
                <div key={i} className="flex items-center justify-between py-2 text-sm">
                  <span>{it.name} {it.size ? `· ${it.size}` : ''} ×{it.quantity}</span>
                  <span>{naira(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between text-slate"><span>Subtotal</span><span>{naira(selected.subtotal)}</span></div>
              {selected.discount > 0 && <div className="flex justify-between text-slate"><span>Discount</span><span>−{naira(selected.discount)}</span></div>}
              <div className="flex justify-between text-slate"><span>Delivery</span><span>{naira(selected.delivery?.fee)}</span></div>
              <div className="flex justify-between border-t border-line pt-2 font-semibold"><span>Total</span><span>{naira(selected.total)}</span></div>
            </div>
            <button onClick={() => window.print()} className="btn-ghost mt-5 w-full">Print invoice</button>
          </div>
        </div>
      )}
    </div>
  )
}
