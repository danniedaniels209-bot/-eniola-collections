import { useEffect, useState } from 'react'
import { api, asset } from '../services/api'
import { PageHeader, Spinner } from '../components/ui'

export default function Inventory() {
  const [data, setData] = useState(null)

  const load = () => api.get('/admin/inventory').then(setData)
  useEffect(() => {
    load()
  }, [])

  const update = async (id, stock) => {
    await api.put(`/admin/inventory/${id}`, { stock: Number(stock) })
    load()
  }

  if (!data) return <Spinner />

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle={`${data.lowStock.length} low-stock · ${data.outOfStock.length} out of stock (threshold ${data.threshold}).`}
      />

      {(data.lowStock.length > 0 || data.outOfStock.length > 0) && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {data.outOfStock.length > 0 && <p>⚠️ {data.outOfStock.length} product(s) out of stock.</p>}
          {data.lowStock.length > 0 && <p>🔔 {data.lowStock.length} product(s) running low.</p>}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-slate">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {data.items.map((p) => (
              <tr key={p._id} className={p.stock === 0 ? 'bg-red-50/40' : ''}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded bg-canvas">
                      {p.images?.[0] && <img src={asset(p.images[0])} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate">{p.sku || '—'}</td>
                <td className="px-4 py-3">
                  <span className={p.stock === 0 ? 'font-semibold text-red-600' : ''}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <form
                    className="flex justify-end gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      update(p._id, e.target.stock.value)
                    }}
                  >
                    <input name="stock" type="number" defaultValue={p.stock} className="input w-24 py-1" />
                    <button className="btn-ghost px-2.5 py-1 text-xs">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
