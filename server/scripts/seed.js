import 'dotenv/config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Settings from '../models/Settings.js'
import Homepage from '../models/Homepage.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..', '..')
const uploadsProducts = path.join(__dirname, '..', 'uploads', 'products')

// Map the real studio PNGs (in project root) → served upload paths.
const ASSETS = {
  'abaya.png': 'Abayas of elegance in luxury setting.png',
  'handbag.png': 'Cozy elegance_ leather handbag on boucle chair.png',
  'corporate-shoe.png': 'Elegant black pump on neutral background.png',
  'sneaker-black.png': 'Elegant black sneaker with gold details.png',
  'hijab.png': 'Elegant hijab collection in golden ambiance.png',
  'sneaker.png': 'Elegant sneakers in a luxurious setting.png',
}

function copyAssets() {
  fs.mkdirSync(uploadsProducts, { recursive: true })
  for (const [dest, src] of Object.entries(ASSETS)) {
    const from = path.join(projectRoot, src)
    const to = path.join(uploadsProducts, dest)
    if (fs.existsSync(from)) fs.copyFileSync(from, to)
  }
}

const img = (name) => `/uploads/products/${name}`

const CATEGORIES = [
  'Basic Tops',
  'Crop Tops',
  'Abayas',
  'Hijabs',
  'Sneakers',
  'Corporate Shoes',
  'Handbags',
  'Accessories',
]

const PRODUCTS = [
  { name: 'Noir Abaya', category: 'Abayas', price: 48000, images: [img('abaya.png')], sizes: ['S', 'M', 'L', 'XL'], colours: ['Black'], stock: 12, featured: true, newArrival: true, status: 'published' },
  { name: 'Golden Hour Hijab', category: 'Hijabs', price: 15000, images: [img('hijab.png')], colours: ['Champagne', 'Cream'], stock: 30, bestSeller: true, status: 'published' },
  { name: 'Gilt Runner', category: 'Sneakers', price: 62000, images: [img('sneaker-black.png')], sizes: ['38', '39', '40', '41', '42'], colours: ['Black/Gold'], stock: 8, featured: true, bestSeller: true, status: 'published' },
  { name: 'Atelier Sneaker', category: 'Sneakers', price: 58000, images: [img('sneaker.png')], sizes: ['38', '39', '40', '41'], colours: ['Ivory'], stock: 6, newArrival: true, status: 'published' },
  { name: 'Bouclé Leather Bag', category: 'Handbags', price: 74000, images: [img('handbag.png')], colours: ['Tan'], stock: 5, featured: true, status: 'published' },
  { name: 'Noir Corporate Pump', category: 'Corporate Shoes', price: 52000, images: [img('corporate-shoe.png')], sizes: ['37', '38', '39', '40'], colours: ['Black'], stock: 0, status: 'published' },
]

async function run() {
  const ok = await connectDB()
  if (!ok) {
    console.error('Cannot seed without MONGODB_URI. Set it in server/.env')
    process.exit(1)
  }

  copyAssets()

  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@eniola.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin123!'
  await User.deleteOne({ email })
  await User.create({ name: 'Store Owner', email, password, role: 'admin' })
  console.log(`👤 Admin: ${email} / ${password}`)

  // Categories
  await Category.deleteMany({})
  await Category.create(
    CATEGORIES.map((name, i) => ({ name, order: i, image: '' }))
  )
  console.log(`🗂️  ${CATEGORIES.length} categories`)

  // Products
  await Product.deleteMany({})
  for (const p of PRODUCTS) await Product.create(p)
  console.log(`👗 ${PRODUCTS.length} products`)

  // Singletons
  await Settings.getSingleton()
  await Homepage.getSingleton()
  console.log('⚙️  Settings + homepage initialised')

  await mongoose.disconnect()
  console.log('✅ Seed complete')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
