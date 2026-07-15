import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { cloudinary, cloudinaryEnabled } from '../config/cloudinary.js'
import Product from '../models/Product.js'
import Homepage from '../models/Homepage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsRoot = path.join(__dirname, '..', 'uploads')
const clientPublic = path.join(__dirname, '..', '..', 'client', 'public')

// Local-disk paths (/uploads/... or /images/...) can't be served by Render, so
// push each referenced file to Cloudinary and rewrite the record to its URL.
function localFileFor(url) {
  if (url.startsWith('/uploads/')) return path.join(uploadsRoot, url.replace('/uploads/', ''))
  if (url.startsWith('/images/') || url.startsWith('/videos/')) return path.join(clientPublic, url.slice(1))
  return null
}

async function push(url) {
  if (!url || url.startsWith('http')) return url // already remote
  const file = localFileFor(url)
  if (!file || !fs.existsSync(file)) {
    console.warn(`  ⚠️  missing local file for ${url} — left as-is`)
    return url
  }
  const isVideo = /\.(mp4|webm)$/i.test(file)
  const folder = url.includes('/hero/') || url.includes('/videos/') ? 'eniola/hero' : 'eniola/products'
  const res = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: isVideo ? 'video' : 'image',
    public_id: path.basename(file, path.extname(file)),
    overwrite: true,
  })
  console.log(`  ✔ ${url}\n    → ${res.secure_url}`)
  return res.secure_url
}

async function run() {
  if (!cloudinaryEnabled) {
    console.error('Cloudinary is not configured. Set CLOUDINARY_* in server/.env')
    process.exit(1)
  }
  const ok = await connectDB()
  if (!ok) process.exit(1)

  console.log('\n📦 Products')
  const products = await Product.find()
  for (const p of products) {
    if (!p.images?.length) continue
    const next = []
    for (const img of p.images) next.push(await push(img))
    if (JSON.stringify(next) !== JSON.stringify(p.images)) {
      p.images = next
      await p.save()
    }
  }

  console.log('\n🏠 Homepage')
  const hp = await Homepage.getSingleton()
  const video = await push(hp.heroVideo)
  const image = await push(hp.heroImage)
  if (video !== hp.heroVideo || image !== hp.heroImage) {
    hp.heroVideo = video
    hp.heroImage = image
    await hp.save()
  }

  await mongoose.disconnect()
  console.log('\n✅ Migration complete — all media now served from Cloudinary')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
