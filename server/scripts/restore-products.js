import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { cloudinary } from '../config/cloudinary.js'
import Product from '../models/Product.js'

// Re-creates starter products from the photos already in Cloudinary so the
// homepage gallery has something to show. Names/prices are placeholders meant
// to be edited in the admin. Skips any product whose name already exists.
const STARTERS = [
  { key: 'abaya',          name: 'Noir Abaya',            category: 'Abayas',          price: 48000, sizes: ['S','M','L','XL'],        colours: ['Black'],       stock: 12, featured: true,  newArrival: true },
  { key: 'hijab',          name: 'Golden Hour Hijab',     category: 'Hijabs',          price: 15000, sizes: [],                        colours: ['Champagne'],   stock: 30, bestSeller: true },
  { key: 'sneaker-black',  name: 'Gilt Runner',           category: 'Sneakers',        price: 62000, sizes: ['38','39','40','41','42'],colours: ['Black/Gold'],  stock: 8,  featured: true,  bestSeller: true },
  { key: 'sneaker',        name: 'Atelier Sneaker',       category: 'Sneakers',        price: 58000, sizes: ['38','39','40','41'],     colours: ['Ivory'],       stock: 6,  newArrival: true },
  { key: 'handbag',        name: 'Bouclé Leather Bag',    category: 'Handbags',        price: 74000, sizes: [],                        colours: ['Tan'],         stock: 5,  featured: true },
  { key: 'corporate-shoe', name: 'Noir Corporate Pump',   category: 'Corporate Shoes', price: 52000, sizes: ['37','38','39','40'],     colours: ['Black'],       stock: 9,  bestSeller: true },
]

async function run() {
  const ok = await connectDB()
  if (!ok) process.exit(1)

  // Resolve each key to its real Cloudinary URL rather than hardcoding versions.
  const { resources } = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'eniola/products/',
    max_results: 100,
  })
  const urlFor = (key) =>
    resources.find((r) => r.public_id === `eniola/products/${key}`)?.secure_url

  let created = 0
  for (const s of STARTERS) {
    const url = urlFor(s.key)
    if (!url) {
      console.warn(`  ⚠️  no Cloudinary image for "${s.key}" — skipped`)
      continue
    }
    if (await Product.findOne({ name: s.name })) {
      console.log(`  = ${s.name} already exists — skipped`)
      continue
    }
    const { key, ...fields } = s
    await Product.create({
      ...fields,
      description: 'A signature Êñiola piece. Edit this description in the admin.',
      images: [url],
      status: 'published',
    })
    console.log(`  ✔ ${s.name}`)
    created++
  }

  console.log(`\n✅ ${created} product(s) restored — published and visible on the storefront.`)
  console.log('   Names, prices and descriptions are placeholders: edit them in Admin → Products.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
