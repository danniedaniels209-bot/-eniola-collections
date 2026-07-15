// Accepts any shape Render or a human might supply and normalises it to the
// server root: with/without protocol, with/without a trailing "/api" or slash.
// Render injects the API's RENDER_EXTERNAL_URL automatically (see render.yaml),
// so no URL needs to be typed by hand in production.
function serverRoot() {
  let raw = import.meta.env.VITE_API_URL || import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000'
  raw = raw.trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`
  return raw.replace(/\/api$/i, '')
}

const ROOT = serverRoot()
const API_URL = `${ROOT}/api`
export const UPLOADS_URL = ROOT

// Resolve a stored media path to an absolute URL. Local /images assets (shipped
// in public/) are served by the client itself, so pass those through untouched.
//
// For Cloudinary URLs we inject `f_auto,q_auto` so it negotiates the best format
// (WebP/AVIF) and quality per browser — a ~2MB PNG drops to ~150KB. `w_` caps
// the delivered width so we never ship a 4000px image into a 290px card.
export const asset = (p, width) => {
  if (!p) return ''
  if (p.includes('res.cloudinary.com') && p.includes('/upload/')) {
    const t = ['f_auto', 'q_auto', width && `w_${width}`, width && 'c_limit'].filter(Boolean).join(',')
    return p.replace('/upload/', `/upload/${t}/`)
  }
  if (p.startsWith('http') || p.startsWith('/images') || p.startsWith('/videos')) return p
  return `${UPLOADS_URL}${p}`
}

const tokenKey = 'eniola_token'
export const getToken = () => localStorage.getItem(tokenKey)
export const setToken = (t) => localStorage.setItem(tokenKey, t)
export const clearToken = () => localStorage.removeItem(tokenKey)

async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  const t = getToken()
  if (t) headers.Authorization = `Bearer ${t}`
  if (body) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  let data = null
  try {
    data = await res.json()
  } catch {
    /* no body */
  }
  if (!res.ok) {
    if (res.status === 401) clearToken()
    throw new Error(data?.message || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  del: (p) => request(p, { method: 'DELETE' }),
}

// Build a WhatsApp URL from admin settings. Returns null when nothing is
// configured (so buttons can hide instead of linking to a fake number).
// A custom link (wa.me / bit.ly / chat.whatsapp.com) wins and is used as-is;
// a message can only be pre-filled when a plain number is used.
export const whatsappUrl = (whatsapp, message) => {
  if (!whatsapp) return null
  if (whatsapp.link) return whatsapp.link.startsWith('http') ? whatsapp.link : `https://${whatsapp.link}`
  const number = (whatsapp.number || '').replace(/[^\d]/g, '')
  if (!number) return null
  const text = message || whatsapp.defaultMessage || ''
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export const formatNaira = (n) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(
    n || 0
  )
