import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'
import User from '../models/User.js'
import { asyncHandler } from '../middleware/error.js'
import { cloudinary, cloudinaryEnabled } from '../config/cloudinary.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsRoot = path.join(__dirname, '..', 'uploads')

/* ---------- Analytics ---------- */
export const analytics = asyncHandler(async (req, res) => {
  const [byStatus, topProducts, paidOrders, revenueByMethod] = await Promise.all([
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', qty: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { qty: -1 } },
      { $limit: 8 },
    ]),
    Order.find({ paymentStatus: 'paid' }).select('total createdAt').sort({ createdAt: 1 }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$total' } } },
    ]),
  ])

  // Revenue grouped by calendar month (YYYY-MM), derived from the stored timestamps.
  const monthly = {}
  for (const o of paidOrders) {
    const key = o.createdAt.toISOString().slice(0, 7)
    monthly[key] = (monthly[key] || 0) + o.total
  }
  const revenueByMonth = Object.entries(monthly).map(([month, total]) => ({ month, total }))

  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0)
  const avgOrderValue = paidOrders.length ? totalRevenue / paidOrders.length : 0

  res.json({
    ordersByStatus: byStatus,
    topProducts,
    revenueByMonth,
    revenueByMethod,
    totals: { totalRevenue, avgOrderValue, paidOrders: paidOrders.length },
  })
})

/* ---------- Media Library ---------- */
const FOLDERS = ['products', 'hero', 'categories', 'banners', 'reviews']

export const listMedia = asyncHandler(async (req, res) => {
  const folder = FOLDERS.includes(req.query.folder) ? req.query.folder : null
  const search = (req.query.search || '').toLowerCase()
  const folders = folder ? [folder] : FOLDERS
  const files = []

  if (cloudinaryEnabled) {
    for (const f of folders) {
      // Cloudinary paginates; 100 per folder is plenty for a media library view.
      const [images, videos] = await Promise.all([
        cloudinary.api.resources({ type: 'upload', prefix: `eniola/${f}/`, max_results: 100 }).catch(() => ({ resources: [] })),
        cloudinary.api
          .resources({ type: 'upload', resource_type: 'video', prefix: `eniola/${f}/`, max_results: 100 })
          .catch(() => ({ resources: [] })),
      ])
      for (const r of [...images.resources, ...videos.resources]) {
        const name = r.public_id.split('/').pop() + '.' + r.format
        if (search && !name.toLowerCase().includes(search)) continue
        files.push({
          folder: f,
          name,
          url: r.secure_url,
          publicId: r.public_id,
          resourceType: r.resource_type,
          size: r.bytes,
          modified: new Date(r.created_at).getTime(),
        })
      }
    }
  } else {
    for (const f of folders) {
      const dir = path.join(uploadsRoot, f)
      if (!fs.existsSync(dir)) continue
      for (const name of fs.readdirSync(dir)) {
        if (search && !name.toLowerCase().includes(search)) continue
        const stat = fs.statSync(path.join(dir, name))
        if (!stat.isFile()) continue
        files.push({ folder: f, name, url: `/uploads/${f}/${name}`, size: stat.size, modified: stat.mtimeMs })
      }
    }
  }

  files.sort((a, b) => b.modified - a.modified)
  res.json({ files, folders: FOLDERS })
})

export const deleteMedia = asyncHandler(async (req, res) => {
  const { folder, name, publicId, resourceType } = req.body

  if (cloudinaryEnabled && publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType || 'image' })
    return res.json({ message: 'Deleted' })
  }

  if (!FOLDERS.includes(folder)) return res.status(400).json({ message: 'Invalid folder' })
  // Prevent path traversal — only a bare filename is allowed.
  if (!name || name.includes('/') || name.includes('\\') || name.includes('..')) {
    return res.status(400).json({ message: 'Invalid filename' })
  }
  const filePath = path.join(uploadsRoot, folder, name)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  res.json({ message: 'Deleted' })
})

/* ---------- Notifications (derived, no separate collection) ---------- */
export const notifications = asyncHandler(async (req, res) => {
  const [recentOrders, paidOrders, pendingReviews, lowStock, outOfStock, newCustomers] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(5).select('orderNumber total status createdAt'),
    Order.find({ paymentStatus: 'paid' }).sort({ updatedAt: -1 }).limit(5).select('orderNumber total updatedAt'),
    Review.find({ status: 'pending' }).sort({ createdAt: -1 }).limit(5).populate('product', 'name'),
    Product.find({ stock: { $gt: 0, $lte: 5 } }).select('name stock').limit(10),
    Product.find({ stock: 0 }).select('name').limit(10),
    User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
  ])

  const items = []
  recentOrders.forEach((o) =>
    items.push({ type: 'order', title: `New order ${o.orderNumber}`, meta: `₦${o.total} · ${o.status}`, at: o.createdAt })
  )
  paidOrders.forEach((o) =>
    items.push({ type: 'payment', title: `Payment received ${o.orderNumber}`, meta: `₦${o.total}`, at: o.updatedAt })
  )
  pendingReviews.forEach((r) =>
    items.push({ type: 'review', title: `Review awaiting approval`, meta: `on ${r.product?.name || 'product'}`, at: r.createdAt })
  )
  lowStock.forEach((p) =>
    items.push({ type: 'low-stock', title: `Low stock: ${p.name}`, meta: `${p.stock} left`, at: null })
  )
  outOfStock.forEach((p) => items.push({ type: 'out-of-stock', title: `Out of stock: ${p.name}`, meta: '0 left', at: null }))
  newCustomers.forEach((u) =>
    items.push({ type: 'customer', title: `New customer: ${u.name}`, meta: u.email, at: u.createdAt })
  )

  res.json({
    counts: {
      orders: recentOrders.length,
      payments: paidOrders.length,
      reviews: pendingReviews.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      customers: newCustomers.length,
    },
    items,
  })
})
