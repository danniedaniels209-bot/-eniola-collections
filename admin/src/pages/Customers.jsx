import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner, Empty, naira, DesktopTable, MobileList, MobileRow } from '../components/ui'

export default function Customers() {
  const [items, setItems] = useState(null)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)

  const load = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    api.get(`/admin/customers?${params}`).then((d) => setItems(d.items))
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const open = async (id) => {
    const d = await api.get(`/admin/customers/${id}`)
    setDetail(d)
  }
  const suspend = async (u) => {
    await api.put(`/admin/customers/${u._id}/suspend`, { suspended: !u.suspended })
    load()
    if (detail?.user?._id === u._id) open(u._id)
  }
  const edit = async (u) => {
    const name = prompt('Edit name', u.name)
    if (name == null) return
    const phone = prompt('Edit phone', u.phone || '')
    await api.put(`/admin/customers/${u._id}`, { name, phone: phone ?? u.phone })
    load()
  }
  const remove = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return
    await api.del(`/admin/customers/${u._id}`)
    load()
  }

  return (
    <div>
      <PageHeader title="Customers" subtitle="Registered shoppers, their orders and wishlists." />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          load()
        }}
        className="mb-4 flex gap-2"
      >
        <input className="input w-full sm:w-64" placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn-ghost">Search</button>
      </form>

      {!items ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Empty>No customers yet.</Empty>
      ) : (
        <>
        <MobileList>
          {items.map((u) => (
            <MobileRow key={u._id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{u.name}</p>
                  <p className="truncate text-xs text-slate">{u.email}</p>
                  <p className="text-xs text-slate">{u.phone || 'no phone'}</p>
                </div>
                {u.suspended ? (
                  <span className="badge bg-red-50 text-red-600">Suspended</span>
                ) : (
                  <span className="badge bg-green-50 text-green-700">Active</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                <button onClick={() => open(u._id)} className="btn-ghost flex-1 px-2 py-1.5 text-xs">View</button>
                <button onClick={() => edit(u)} className="btn-ghost flex-1 px-2 py-1.5 text-xs">Edit</button>
                <button onClick={() => suspend(u)} className="btn-ghost flex-1 px-2 py-1.5 text-xs">
                  {u.suspended ? 'Unsuspend' : 'Suspend'}
                </button>
                <button onClick={() => remove(u)} className="btn-danger flex-1 px-2 py-1.5 text-xs">Delete</button>
              </div>
            </MobileRow>
          ))}
        </MobileList>

        <DesktopTable>
            <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((u) => (
                <tr key={u._id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-slate">{u.email}</td>
                  <td className="px-4 py-3 text-slate">{u.phone || '—'}</td>
                  <td className="px-4 py-3">
                    {u.suspended ? (
                      <span className="badge bg-red-50 text-red-600">Suspended</span>
                    ) : (
                      <span className="badge bg-green-50 text-green-700">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => open(u._id)} className="btn-ghost px-2.5 py-1 text-xs">View</button>
                      <button onClick={() => edit(u)} className="btn-ghost px-2.5 py-1 text-xs">Edit</button>
                      <button onClick={() => suspend(u)} className="btn-ghost px-2.5 py-1 text-xs">
                        {u.suspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                      <button onClick={() => remove(u)} className="btn-danger px-2.5 py-1 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </DesktopTable>
        </>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetail(null)}>
          <div className="card max-h-[85vh] w-full max-w-lg overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{detail.user.name}</h2>
              <button onClick={() => setDetail(null)} className="text-slate hover:text-ink">✕</button>
            </div>
            <p className="text-sm text-slate">{detail.user.email} · {detail.user.phone || 'no phone'}</p>

            <h3 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-slate">Order history ({detail.orders.length})</h3>
            {detail.orders.length === 0 ? (
              <p className="text-sm text-slate">No orders.</p>
            ) : (
              <ul className="divide-y divide-line">
                {detail.orders.map((o) => (
                  <li key={o._id} className="flex justify-between py-2 text-sm">
                    <span>{o.orderNumber}</span>
                    <span>{naira(o.total)}</span>
                    <span className="text-slate">{o.status}</span>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-slate">Wishlist ({detail.user.wishlist?.length || 0})</h3>
            <ul className="text-sm text-slate">
              {(detail.user.wishlist || []).map((p) => (
                <li key={p._id}>{p.name} — {naira(p.price)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
