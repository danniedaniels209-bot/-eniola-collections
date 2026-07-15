import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner, naira } from '../components/ui'

export default function Analytics() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/admin/analytics').then(setData)
  }, [])

  if (!data) return <Spinner />

  const maxMonth = Math.max(1, ...data.revenueByMonth.map((m) => m.total))
  const maxProd = Math.max(1, ...data.topProducts.map((p) => p.qty))

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Revenue, orders and best sellers." />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat label="Total Revenue" value={naira(data.totals.totalRevenue)} />
        <Stat label="Avg Order Value" value={naira(data.totals.avgOrderValue)} />
        <Stat label="Paid Orders" value={data.totals.paidOrders} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by month */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Revenue by Month</h2>
          {data.revenueByMonth.length === 0 ? (
            <p className="text-sm text-slate">No paid orders yet.</p>
          ) : (
            <div className="space-y-3">
              {data.revenueByMonth.map((m) => (
                <div key={m.month}>
                  <div className="mb-1 flex justify-between text-xs text-slate">
                    <span>{m.month}</span>
                    <span>{naira(m.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-canvas">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${(m.total / maxMonth) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Top Products (by units sold)</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-slate">No sales yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((p) => (
                <div key={p._id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-ink">{p._id}</span>
                    <span className="text-slate">{p.qty} sold · {naira(p.revenue)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-canvas">
                    <div className="h-2 rounded-full bg-gold" style={{ width: `${(p.qty / maxProd) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Orders by Status</h2>
          <div className="flex flex-wrap gap-3">
            {data.ordersByStatus.length === 0 && <p className="text-sm text-slate">No orders yet.</p>}
            {data.ordersByStatus.map((s) => (
              <div key={s._id} className="rounded-lg border border-line px-4 py-3 text-center">
                <p className="text-2xl font-semibold">{s.count}</p>
                <p className="text-xs capitalize text-slate">{s._id}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by method */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold">Revenue by Payment Method</h2>
          {data.revenueByMethod.length === 0 ? (
            <p className="text-sm text-slate">No paid orders yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.revenueByMethod.map((m) => (
                <li key={m._id} className="flex justify-between py-2 text-sm">
                  <span className="capitalize">{m._id}</span>
                  <span className="font-medium">{naira(m.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  )
}
