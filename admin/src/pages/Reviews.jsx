import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner, StatusBadge, Empty } from '../components/ui'

export default function Reviews() {
  const [items, setItems] = useState(null)
  const [status, setStatus] = useState('')

  const load = () => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    api.get(`/admin/reviews?${params}`).then((d) => setItems(d.items))
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const moderate = async (id, patch) => {
    await api.put(`/admin/reviews/${id}`, patch)
    load()
  }
  const remove = async (id) => {
    if (!confirm('Delete this review?')) return
    await api.del(`/admin/reviews/${id}`)
    load()
  }
  const reply = async (r) => {
    const text = prompt('Reply to customer', r.reply || '')
    if (text !== null) moderate(r._id, { reply: text })
  }

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Approve, reject, feature and reply to reviews." />

      <div className="mb-4 flex gap-2">
        <select className="input w-48" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {!items ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Empty>No reviews yet.</Empty>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r._id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gold">{'★'.repeat(r.rating)}<span className="text-line">{'★'.repeat(5 - r.rating)}</span></span>
                    <span className="text-sm font-medium">{r.name || 'Anonymous'}</span>
                    <StatusBadge status={r.status} />
                    {r.featured && <span className="badge bg-gold/20 text-gold">Featured</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate">on {r.product?.name || 'product'}</p>
                  <p className="mt-2 text-sm">{r.text}</p>
                  {r.reply && <p className="mt-2 rounded-lg bg-canvas px-3 py-2 text-sm text-slate">↳ {r.reply}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  {r.status !== 'approved' && (
                    <button onClick={() => moderate(r._id, { status: 'approved' })} className="btn-ghost px-2.5 py-1 text-xs">Approve</button>
                  )}
                  {r.status !== 'rejected' && (
                    <button onClick={() => moderate(r._id, { status: 'rejected' })} className="btn-ghost px-2.5 py-1 text-xs">Reject</button>
                  )}
                  <button onClick={() => moderate(r._id, { featured: !r.featured })} className="btn-ghost px-2.5 py-1 text-xs">
                    {r.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button onClick={() => reply(r)} className="btn-ghost px-2.5 py-1 text-xs">Reply</button>
                  <button onClick={() => remove(r._id)} className="btn-danger px-2.5 py-1 text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
