import { useEffect, useState } from 'react'
import { api, asset } from '../services/api'
import { PageHeader, Spinner } from '../components/ui'

export default function Categories() {
  const [items, setItems] = useState(null)
  const [name, setName] = useState('')

  const load = () => api.get('/admin/categories').then((d) => setItems(d.items))
  useEffect(() => {
    load()
  }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    await api.post('/admin/categories', { name, order: items.length })
    setName('')
    load()
  }
  const rename = async (c) => {
    const next = prompt('Rename category', c.name)
    if (next && next !== c.name) {
      await api.put(`/admin/categories/${c._id}`, { name: next })
      load()
    }
  }
  const toggleHide = async (c) => {
    await api.put(`/admin/categories/${c._id}`, { hidden: !c.hidden })
    load()
  }
  const remove = async (c) => {
    if (!confirm(`Delete "${c.name}"?`)) return
    await api.del(`/admin/categories/${c._id}`)
    load()
  }
  const move = async (idx, dir) => {
    const next = [...items]
    const j = idx + dir
    if (j < 0 || j >= next.length) return
    ;[next[idx], next[j]] = [next[j], next[idx]]
    setItems(next)
    await api.put('/admin/categories/reorder', {
      order: next.map((c, i) => ({ id: c._id, order: i })),
    })
  }

  return (
    <div>
      <PageHeader title="Categories" subtitle="Create, rename, reorder and hide categories." />

      <form onSubmit={add} className="card mb-6 flex gap-2 p-4">
        <input className="input" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary whitespace-nowrap">+ Add</button>
      </form>

      {!items ? (
        <Spinner />
      ) : (
        <div className="card divide-y divide-line">
          {items.map((c, i) => (
            <div key={c._id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} className="text-xs text-slate hover:text-ink">▲</button>
                <button onClick={() => move(i, 1)} className="text-xs text-slate hover:text-ink">▼</button>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-lg bg-canvas">
                {c.image && <img src={asset(c.image)} alt="" className="h-full w-full object-cover" />}
              </div>
              <span className={`flex-1 font-medium ${c.hidden ? 'text-slate line-through' : ''}`}>{c.name}</span>
              <button onClick={() => rename(c)} className="btn-ghost px-2.5 py-1 text-xs">Rename</button>
              <button onClick={() => toggleHide(c)} className="btn-ghost px-2.5 py-1 text-xs">
                {c.hidden ? 'Show' : 'Hide'}
              </button>
              <button onClick={() => remove(c)} className="btn-danger px-2.5 py-1 text-xs">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
