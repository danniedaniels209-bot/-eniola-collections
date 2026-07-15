import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Coupon from '../models/Coupon.js'
import { asyncHandler } from '../middleware/error.js'

// POST /api/orders — create from cart (auth optional; contact captured either way).
export const createOrder = asyncHandler(async (req, res) => {
  const { items = [], delivery = {}, contact = {}, couponCode, paymentMethod } = req.body
  if (!items.length) return res.status(400).json({ message: 'Cart is empty' })

  // Recompute prices server-side from the DB — never trust client totals.
  let subtotal = 0
  const lineItems = []
  for (const it of items) {
    const product = await Product.findById(it.product)
    if (!product) continue
    const price = product.discountPrice ?? product.price
    subtotal += price * (it.quantity || 1)
    lineItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0],
      price,
      size: it.size,
      colour: it.colour,
      quantity: it.quantity || 1,
    })
  }

  let discount = 0
  let appliedCode
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true })
    const valid =
      coupon &&
      (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
      subtotal >= (coupon.minPurchase || 0)
    if (valid) {
      discount = coupon.type === 'percentage' ? (subtotal * coupon.value) / 100 : coupon.value
      appliedCode = coupon.code
      coupon.usedCount += 1
      await coupon.save()
    }
  }

  const fee = delivery.fee || 0
  const total = Math.max(0, subtotal - discount) + fee

  const order = await Order.create({
    customer: req.user?._id,
    contact,
    items: lineItems,
    delivery,
    subtotal,
    discount,
    couponCode: appliedCode,
    total,
    paymentMethod,
  })

  res.status(201).json({ order })
})

export const listOrders = asyncHandler(async (req, res) => {
  const { status, search } = req.query
  const filter = {}
  if (status) filter.status = status
  if (search) filter.orderNumber = { $regex: search, $options: 'i' }
  const items = await Order.find(filter).sort({ createdAt: -1 }).populate('customer', 'name email')
  res.json({ items })
})

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer', 'name email phone')
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json({ order })
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus } = req.body
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
    { new: true }
  )
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json({ order })
})

export const myOrders = asyncHandler(async (req, res) => {
  const items = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 })
  res.json({ items })
})

// Customer cancels their own order — only while still pending.
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, customer: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  if (order.status !== 'pending')
    return res.status(400).json({ message: 'Only pending orders can be cancelled' })
  order.status = 'cancelled'
  await order.save()
  res.json({ order })
})
