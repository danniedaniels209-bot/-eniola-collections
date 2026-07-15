import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { PageHeader, Spinner, Empty, DesktopTable, MobileList, MobileRow } from '../components/ui'

const BLANK = { code: '', type: 'percentage', value: 10, minPurchase: '', expiresAt: '', usageLimit: '', active: true }

export default function Coupons() {
  const [items, setItems] = useState(null)
  const [form, setForm] = useState(BLANK)

  const load = () => api.get('/admin/coupons').then((d) => setItems(d.items))
  useEffect(() => {
    load()
  }, [])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const create = async (e) => {
    e.preventDefault()
    await api.post('/admin/coupons', {
      ...form,
      value: Number(form.value),
      minPurchase: form.minPurchase === '' ? 0 : Number(form.minPurchase),
      usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
      expiresAt: form.expiresAt || null,
    })
    setForm(BLANK)
    load()
  }
  const toggle = async (c) => {
    await api.put(`/admin/coupons/${c._id}`, { active: !c.active })
    load()
  }
  const remove = async (id) => {
    if (!confirm('Delete coupon?')) return
    await api.del(`/admin/coupons/${id}`)
    load()
  }

  return (
    <div>
      <PageHeader title="Coupons" subtitle="Discount codes for checkout." />

      <form onSubmit={create} className="card mb-6 grid grid-cols-2 gap-4 p-5 md:grid-cols-6">
        <div>
          <label className="label">Code</label>
          <input className="input uppercase" value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} required />
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={(e) => set('type', e.target.value)}>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed (₦)</option>
          </select>
        </div>
        <div>
          <label className="label">Value</label>
          <input type="number" className="input" value={form.value} onChange={(e) => set('value', e.target.value)} required />
        </div>
        <div>
          <label className="label">Min Purchase (₦)</label>
          <input type="number" className="input" value={form.minPurchase} onChange={(e) => set('minPurchase', e.target.value)} />
        </div>
        <div>
          <label className="label">Expires</label>
          <input type="date" className="input" value={form.expiresAt} onChange={(e) => set('expiresAt', e.target.value)} />
        </div>
        <div className="flex items-end">
          <button className="btn-primary w-full">+ Create</button>
        </div>
      </form>

      {!items ? (
        <Spinner />
      ) : items.length === 0 ? (
        <Empty>No coupons yet.</Empty>
      ) : (
        <>
        <MobileList>
          {items.map((c) => (
            <MobileRow key={c._id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono font-medium text-ink">{c.code}</p>
                  <p className="text-xs text-slate">
                    {c.type === 'percentage' ? `${c.value}% off` : `₦${c.value} off`}
                    {c.minPurchase ? ` · min ₦${c.minPurchase}` : ''}
                  </p>
                  <p className="text-xs text-slate">
                    Used {c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}
                    {c.expiresAt ? ` · expires ${new Date(c.expiresAt).toLocaleDateString()}` : ''}
                  </p>
                </div>
                <span className={`badge ${c.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {c.active ? 'Active' : 'Off'}
                </span>
              </div>
              <div className="mt-3 flex gap-2 border-t border-line pt-3">
                <button onClick={() => toggle(c)} className="btn-ghost flex-1 px-2 py-1.5 text-xs">
                  {c.active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => remove(c._id)} className="btn-danger flex-1 px-2 py-1.5 text-xs">Delete</button>
              </div>
            </MobileRow>
          ))}
        </MobileList>

        <DesktopTable>
            <thead className="border-b border-line bg-canvas text-left text-xs uppercase tracking-wide text-slate">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Used</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.type === 'percentage' ? `${c.value}%` : `₦${c.value}`}</td>
                  <td className="px-4 py-3 text-slate">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="px-4 py-3 text-slate">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.active ? 'Active' : 'Off'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggle(c)} className="btn-ghost px-2.5 py-1 text-xs">
                        {c.active ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => remove(c._id)} className="btn-danger px-2.5 py-1 text-xs">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </DesktopTable>
        </>
      )}
    </div>
  )
}
