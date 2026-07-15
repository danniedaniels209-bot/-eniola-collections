import { useEffect, useRef, useState } from 'react'
import { api, asset } from '../services/api'
import { PageHeader, Spinner, Empty } from '../components/ui'

const FOLDERS = ['products', 'hero', 'categories', 'banners', 'reviews']

export default function MediaLibrary() {
  const [files, setFiles] = useState(null)
  const [folder, setFolder] = useState('')
  const [search, setSearch] = useState('')
  const [uploadFolder, setUploadFolder] = useState('products')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  const load = () => {
    const params = new URLSearchParams()
    if (folder) params.set('folder', folder)
    if (search) params.set('search', search)
    api.get(`/admin/media?${params}`).then((d) => setFiles(d.files))
  }
  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder])

  const onUpload = async (e) => {
    if (!e.target.files?.length) return
    setUploading(true)
    try {
      await api.upload(uploadFolder, e.target.files)
      load()
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const remove = async (f) => {
    if (!confirm(`Delete ${f.name}?`)) return
    await api.del('/admin/media', {
      folder: f.folder,
      name: f.name,
      publicId: f.publicId,
      resourceType: f.resourceType,
    })
    load()
  }

  const copyUrl = (f) => {
    navigator.clipboard?.writeText(f.url)
  }

  const isVideo = (name) => /\.(mp4|webm)$/i.test(name)

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle="All uploaded assets. Reuse across products, categories and homepage."
        actions={
          <div className="flex items-center gap-2">
            <select className="input w-32" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)}>
              {FOLDERS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <button onClick={() => fileRef.current?.click()} className="btn-primary">
              {uploading ? 'Uploading…' : '+ Upload'}
            </button>
            <input ref={fileRef} type="file" multiple hidden accept="image/*,video/mp4,video/webm" onChange={onUpload} />
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setFolder('')} className={`btn ${folder === '' ? 'btn-primary' : 'btn-ghost'}`}>
          All
        </button>
        {FOLDERS.map((f) => (
          <button key={f} onClick={() => setFolder(f)} className={`btn capitalize ${folder === f ? 'btn-primary' : 'btn-ghost'}`}>
            {f}
          </button>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            load()
          }}
          className="ml-auto flex gap-2"
        >
          <input className="input w-56" placeholder="Search filename…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-ghost">Search</button>
        </form>
      </div>

      {!files ? (
        <Spinner />
      ) : files.length === 0 ? (
        <Empty>No media yet. Upload images or videos above.</Empty>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {files.map((f) => (
            <div key={`${f.folder}/${f.name}`} className="card group overflow-hidden">
              <div className="relative aspect-square bg-canvas">
                {isVideo(f.name) ? (
                  <video src={asset(f.url)} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={asset(f.url)} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => copyUrl(f)} className="rounded bg-white/90 px-2 py-1 text-xs">Copy URL</button>
                  <button onClick={() => remove(f)} className="rounded bg-red-500 px-2 py-1 text-xs text-white">Delete</button>
                </div>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium">{f.name}</p>
                <p className="text-[10px] uppercase text-slate">{f.folder} · {(f.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
