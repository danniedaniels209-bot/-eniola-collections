import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      process.env.ADMIN_URL || 'http://localhost:5174',
    ],
    credentials: true,
  })
)
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/health', (req, res) => res.json({ ok: true, service: 'eniola-api' }))
app.use('/api', apiRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
connectDB().finally(() => {
  app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`))
})

export default app
