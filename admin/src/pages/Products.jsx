import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, asset } from '../services/api'
import { PageHeader, Spinner, StatusBadge, Empty, naira } from '../components/ui'

export default function Products() {
  const [items, setItems] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const load = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    api.get(`/admin/products?${params}`).then((d) => setItems(d.items))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const remove = async (id) => {
    if (!confirm('Delete this product permanently?')) return
    await api.del(`/admin/products/${id}`)
    load()
  }
  const duplicate = async (id) => {
    await api.post(`/admin/products/${id}/duplicate`)
    load()
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Create, edit, publish and organise your catalogue."
        actions={
          <Link to="/products/new" className="btn-primary">
            + Add Product
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            load()
          }}
          className="flex gap-2"
        >
          <input
            className="input w-64"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-ghost">Search</button>
        </form>
        <select className="input w-40" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {!items ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Empty>
          No products yet.
          <Link to="/products/new" className="btn-primary mt-3">
            Add your first product
          </Link>
        </Empty>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((p) => (
                <tr key={p._id} className="hover:bg-canvas/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-lg bg-canvas">
                        {p.images?.[0] && (
                          <img src={asset(p.images[0])} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-slate">{p.sku || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate">{p.category || '—'}</td>
                  <td className="px-4 py-3">{naira(p.discountPrice ?? p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? 'text-red-600' : ''}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/products/${p._id}`} className="btn-ghost px-2.5 py-1 text-xs">
                        Edit
                      </Link>
                      <button onClick={() => duplicate(p._id)} className="btn-ghost px-2.5 py-1 text-xs">
                        Duplicate
                      </button>
                      <button onClick={() => remove(p._id)} className="btn-danger px-2.5 py-1 text-xs">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
