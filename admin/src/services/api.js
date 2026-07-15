// Normalises whatever VITE_API_URL contains (with/without protocol, with or
// without a trailing "/api" or slash) down to the server root. Render injects
// the API's RENDER_EXTERNAL_URL automatically — see render.yaml.
function serverRoot() {
  let raw = import.meta.env.VITE_API_URL || import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000'
  raw = raw.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`
  return raw.replace(/\/api$/i, '')
}

const ROOT = serverRoot()
const API_URL = `${ROOT}/api`
export const UPLOADS_URL = ROOT

// Resolve a stored image path (e.g. /uploads/products/x.png) to an absolute URL.
export const asset = (p) => (!p ? '' : p.startsWith('http') ? p : `${UPLOADS_URL}${p}`)

function token() {
  return localStorage.getItem('eniola_admin_token')
}

async function request(path, { method = 'GET', body, isForm } = {}) {
  const headers = {}
  const t = token()
  if (t) headers.Authorization = `Bearer ${t}`
  if (!isForm && body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`
    if (res.status === 401) {
      localStorage.removeItem('eniola_admin_token')
    }
    throw new Error(msg)
  }
  return data
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  del: (p, body) => request(p, { method: 'DELETE', body }),
  upload: (folder, files) => {
    const form = new FormData()
    ;[...files].forEach((f) => form.append('files', f))
    return request(`/admin/upload?folder=${folder}`, { method: 'POST', body: form, isForm: true })
  },
}
