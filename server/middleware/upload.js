import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { cloudinary, cloudinaryEnabled } from '../config/cloudinary.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsRoot = path.join(__dirname, '..', 'uploads')

const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.mp4', '.webm']
const isVideo = (name) => /\.(mp4|webm)$/i.test(name)

// Route picks the subfolder via ?folder=products|hero|categories|banners|reviews
const folderOf = (req) => (req.query.folder || 'products').replace(/[^a-z]/g, '') || 'products'

/* ---------- Local disk (dev / no Cloudinary) ---------- */
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(uploadsRoot, folderOf(req))
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 40)
    cb(null, `${base}-${Math.random().toString(36).slice(2, 8)}${ext}`)
  },
})

/* ---------- Cloudinary (production) ---------- */
const cloudStorage = cloudinaryEnabled
  ? new CloudinaryStorage({
      cloudinary,
      params: (req, file) => ({
        folder: `eniola/${folderOf(req)}`,
        resource_type: isVideo(file.originalname) ? 'video' : 'image',
        public_id: `${path
          .basename(file.originalname, path.extname(file.originalname))
          .replace(/[^a-z0-9]/gi, '-')
          .toLowerCase()
          .slice(0, 40)}-${Math.random().toString(36).slice(2, 8)}`,
      }),
    })
  : null

export const upload = multer({
  storage: cloudStorage || diskStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) return cb(null, true)
    cb(new Error(`Unsupported file type: ${ext}`))
  },
})
