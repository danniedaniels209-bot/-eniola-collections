import User from '../models/User.js'
import Order from '../models/Order.js'
import { asyncHandler } from '../middleware/error.js'

// Admin: customer management
export const listCustomers = asyncHandler(async (req, res) => {
  const { search } = req.query
  const filter = { role: 'customer' }
  if (search)
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  const items = await User.find(filter).sort({ createdAt: -1 })
  res.json({ items })
})

export const getCustomer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('wishlist', 'name price images')
  if (!user) return res.status(404).json({ message: 'Customer not found' })
  const orders = await Order.find({ customer: user._id }).sort({ createdAt: -1 })
  res.json({ user, orders })
})

export const suspendCustomer = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { suspended: req.body.suspended ?? true },
    { new: true }
  )
  if (!user) return res.status(404).json({ message: 'Customer not found' })
  res.json({ user })
})

export const updateCustomer = asyncHandler(async (req, res) => {
  const allowed = ['name', 'email', 'phone']
  const patch = {}
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k]
  const user = await User.findByIdAndUpdate(req.params.id, patch, { new: true })
  if (!user) return res.status(404).json({ message: 'Customer not found' })
  res.json({ user })
})

export const deleteCustomer = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).json({ message: 'Customer not found' })
  res.json({ message: 'Deleted' })
})

// Customer: wishlist toggle
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body
  const user = await User.findById(req.user._id)
  const idx = user.wishlist.findIndex((p) => p.toString() === productId)
  if (idx >= 0) user.wishlist.splice(idx, 1)
  else user.wishlist.push(productId)
  await user.save()
  res.json({ wishlist: user.wishlist })
})

// Customer: full wishlist with product details
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist')
  res.json({ items: user.wishlist })
})
