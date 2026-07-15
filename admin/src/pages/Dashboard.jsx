import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner, StatusBadge, naira } from '../components/ui'

const STAT_CARDS = [
  { key: 'totalProducts', label: 'Total Products' },
  { key: 'totalCategories', label: 'Categories' },
  { key: 'activeProducts', label: 'Active Products' },
  { key: 'outOfStock', label: 'Out of Stock' },
  { key: 'lowStock', label: 'Low Stock' },
  { key: 'orders', label: 'Total Orders' },
  { key: 'pendingOrders', label: 'Pending Orders' },
  { key: 'completedOrders', label: 'Completed' },
  { key: 'customers', label: 'Customers' },
  { key: 'revenue', label: 'Revenue', money: true },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/dashboard').then(setData).catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!data) return <Spinner />

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Store performance at a glance." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map((c) => (
          <div key={c.key} className="card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">
              {c.money ? naira(data.stats[c.key]) : data.stats[c.key]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Recent Orders</h2>
          {data.recentOrders.length === 0 && <p className="text-sm text-slate">No orders yet.</p>}
          <ul className="divide-y divide-line">
            {data.recentOrders.map((o) => (
              <li key={o._id} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium">{o.orderNumber}</span>
                <span className="text-slate">{o.customer?.name || o.contact?.name || 'Guest'}</span>
                <span>{naira(o.total)}</span>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Recent Reviews</h2>
          {data.recentReviews.length === 0 && <p className="text-sm text-slate">No reviews yet.</p>}
          <ul className="divide-y divide-line">
            {data.recentReviews.map((r) => (
              <li key={r._id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="text-gold">{'★'.repeat(r.rating)}</span>
                <span className="flex-1 truncate text-slate">{r.text || '—'}</span>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Recent Customers</h2>
          {(data.recentCustomers?.length ?? 0) === 0 && <p className="text-sm text-slate">No customers yet.</p>}
          <ul className="divide-y divide-line">
            {(data.recentCustomers || []).map((u) => (
              <li key={u._id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-medium">{u.name}</span>
                <span className="truncate text-slate">{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
