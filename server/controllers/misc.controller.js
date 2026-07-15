import Coupon from '../models/Coupon.js'
import Category from '../models/Category.js'
import Settings from '../models/Settings.js'
import Homepage from '../models/Homepage.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Review from '../models/Review.js'
import { asyncHandler } from '../middleware/error.js'

/* ---------- Coupons ---------- */
export const listCoupons = asyncHandler(async (req, res) => {
  res.json({ items: await Coupon.find().sort({ createdAt: -1 }) })
})
export const createCoupon = asyncHandler(async (req, res) => {
  res.status(201).json({ coupon: await Coupon.create(req.body) })
})
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!coupon) return res.status(404).json({ message: 'Coupon not found' })
  res.json({ coupon })
})
export const deleteCoupon = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})
export const validateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: (req.params.code || '').toUpperCase(), active: true })
  if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date())) {
    return res.status(404).json({ message: 'Invalid or expired coupon' })
  }
  res.json({ coupon: { code: coupon.code, type: coupon.type, value: coupon.value } })
})

/* ---------- Settings ---------- */
export const getSettings = asyncHandler(async (req, res) => {
  res.json({ settings: await Settings.getSingleton() })
})
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate({ key: 'store' }, req.body, {
    new: true,
    upsert: true,
  })
  res.json({ settings })
})

/* ---------- Homepage ---------- */
export const getHomepage = asyncHandler(async (req, res) => {
  res.json({ homepage: await Homepage.getSingleton() })
})
export const updateHomepage = asyncHandler(async (req, res) => {
  const homepage = await Homepage.findOneAndUpdate({ key: 'home' }, req.body, {
    new: true,
    upsert: true,
  })
  res.json({ homepage })
})

/* ---------- Dashboard stats ---------- */
export const dashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    activeProducts,
    outOfStock,
    lowStock,
    totalCategories,
    orders,
    pendingOrders,
    completedOrders,
    customers,
    recentOrders,
    recentCustomers,
    recentReviews,
    paidAgg,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: 'published' }),
    Product.countDocuments({ stock: 0 }),
    Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
    Category.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'delivered' }),
    User.countDocuments({ role: 'customer' }),
    Order.find().sort({ createdAt: -1 }).limit(6).populate('customer', 'name'),
    User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(6).select('name email createdAt'),
    Review.find().sort({ createdAt: -1 }).limit(6).populate('product', 'name'),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$total' } } },
    ]),
  ])

  res.json({
    stats: {
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      totalCategories,
      orders,
      pendingOrders,
      completedOrders,
      customers,
      revenue: paidAgg[0]?.revenue || 0,
    },
    recentOrders,
    recentCustomers,
    recentReviews,
  })
})

/* ---------- Inventory ---------- */
export const inventory = asyncHandler(async (req, res) => {
  const threshold = Number(req.query.threshold || 5)
  const items = await Product.find().select('name sku stock status images').sort({ stock: 1 })
  const lowStock = items.filter((p) => p.stock > 0 && p.stock <= threshold)
  const outOfStock = items.filter((p) => p.stock === 0)
  res.json({ items, lowStock, outOfStock, threshold })
})
export const updateStock = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock: req.body.stock },
    { new: true }
  )
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
})
