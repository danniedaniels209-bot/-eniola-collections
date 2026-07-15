import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// Captured so /health can explain a failed deploy without dashboard access.
let dbError = null

// Allow local dev, any onrender.com deployment of this project, and any origins
// explicitly configured via CLIENT_URL / ADMIN_URL (e.g. a custom domain).
// Origin-based CORS is not the security boundary here — JWT auth is — so
// permitting our own Render subdomains keeps the blueprint zero-config.
const allowList = [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean)

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true) // curl / server-to-server
      if (allowList.includes(origin)) return cb(null, true)
      if (/^https?:\/\/localhost(:\d+)?$/i.test(origin)) return cb(null, true)
      if (/^https:\/\/[a-z0-9-]+\.onrender\.com$/i.test(origin)) return cb(null, true)
      cb(new Error(`Not allowed by CORS: ${origin}`))
    },
    credentials: true,
  })
)
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Health check doubles as a deploy diagnostic: it reports whether the DB URI was
// supplied and whether Mongoose actually connected, without ever leaking the URI.
app.get('/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const uri = process.env.MONGODB_URI || ''
  res.json({
    ok: true,
    service: 'eniola-api',
    db: {
      uriConfigured: Boolean(uri),
      uriScheme: uri ? uri.split(':')[0] : null,
      host: uri ? (uri.match(/@([^/?]+)/)?.[1] ?? null) : null,
      state: states[mongoose.connection.readyState] ?? 'unknown',
      lastError: dbError || null,
    },
    cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL),
  })
})
app.use('/api', apiRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
connectDB()
  .then((connected) => {
    if (!connected) dbError = process.env.MONGODB_URI ? 'connection failed' : 'MONGODB_URI not set'
  })
  .catch((e) => {
    dbError = e.message
  })
  .finally(() => {
    app.listen(PORT, () => console.log(`🚀 API on port ${PORT}`))
  })

// Surface later drops/reconnects too, not just the initial attempt.
mongoose.connection.on('error', (e) => {
  dbError = e.message
})
mongoose.connection.on('connected', () => {
  dbError = null
})

export default app
