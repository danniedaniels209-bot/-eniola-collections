import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { cloudinary } from '../config/cloudinary.js'
import Homepage from '../models/Homepage.js'

// Seeds the decorative sliding gallery with whatever product photos already live
// in Cloudinary. Safe to re-run: it only fills the gallery when it's empty, so
// it never overwrites the owner's own curation.
async function run() {
  const ok = await connectDB()
  if (!ok) process.exit(1)

  const hp = await Homepage.getSingleton()
  if (hp.galleryImages?.length) {
    console.log(`Gallery already curated (${hp.galleryImages.length} images) — leaving untouched.`)
    await mongoose.disconnect()
    process.exit(0)
  }

  const { resources } = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'eniola/products/',
    max_results: 100,
  })
  const urls = resources.map((r) => r.secure_url)
  if (!urls.length) {
    console.log('No images found under eniola/products/ — nothing to add.')
    await mongoose.disconnect()
    process.exit(0)
  }

  hp.galleryImages = urls
  await hp.save()

  console.log(`✅ Gallery set with ${urls.length} image(s):`)
  resources.forEach((r) => console.log('  -', r.public_id))
  console.log('\nManage these in Admin → Homepage → Infinite Sliding Gallery.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
