import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner, Empty } from '../components/ui'

const ICONS = {
  order: '🛍️',
  payment: '💳',
  review: '⭐',
  'low-stock': '🔔',
  'out-of-stock': '⚠️',
  customer: '👤',
}

export default function Notifications() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/admin/notifications').then(setData)
  }, [])

  if (!data) return <Spinner />

  const c = data.counts

  return (
    <div>
      <PageHeader title="Notifications" subtitle="New orders, reviews, stock alerts and customers." />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <Count label="Recent Orders" value={c.orders} />
        <Count label="Pending Reviews" value={c.reviews} />
        <Count label="Low Stock" value={c.lowStock} />
        <Count label="Out of Stock" value={c.outOfStock} />
        <Count label="New Customers" value={c.customers} />
      </div>

      {data.items.length === 0 ? (
        <Empty>You're all caught up.</Empty>
      ) : (
        <div className="card divide-y divide-line">
          {data.items.map((n, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <span className="text-xl">{ICONS[n.type] || '•'}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                <p className="text-xs text-slate">{n.meta}</p>
              </div>
              {n.at && <span className="text-xs text-slate">{new Date(n.at).toLocaleDateString()}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Count({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-2xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-slate">{label}</p>
    </div>
  )
}
