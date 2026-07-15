import Product from '../models/Product.js'
import { asyncHandler } from '../middleware/error.js'

// GET /api/products — public listing with filters, sort, pagination.
export const listProducts = asyncHandler(async (req, res) => {
  const {
    category, size, colour, search, sort, featured, bestSeller, newArrival,
    minPrice, maxPrice, inStock, page = 1, limit = 24,
  } = req.query

  const filter = { status: 'published' }
  if (category) filter.category = category
  if (size) filter.sizes = size
  if (colour) filter.colours = colour
  if (featured) filter.featured = featured === 'true'
  if (bestSeller) filter.bestSeller = bestSeller === 'true'
  if (newArrival) filter.newArrival = newArrival === 'true'
  if (inStock === 'true') filter.stock = { $gt: 0 }
  if (minPrice || maxPrice) {
    filter.price = {}
    if (minPrice) filter.price.$gte = Number(minPrice)
    if (maxPrice) filter.price.$lte = Number(maxPrice)
  }
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { tags: { $regex: search, $options: 'i' } },
  ]

  const sortMap = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    popularity: { ratingCount: -1 },
    bestsellers: { bestSeller: -1, ratingCount: -1 },
  }

  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ])

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

// GET /api/products/:slug — public single product.
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: 'published',
  }).limit(4)
  res.json({ product, related })
})

// ---- Admin ----
export const adminListProducts = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query
  const filter = {}
  if (status) filter.status = status
  if (search) filter.name = { $regex: search, $options: 'i' }
  const skip = (Number(page) - 1) * Number(limit)
  const [items, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ])
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
})

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json({ product })
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ product })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ message: 'Deleted' })
})

// Duplicate creates a fresh draft copy.
export const duplicateProduct = asyncHandler(async (req, res) => {
  const orig = await Product.findById(req.params.id)
  if (!orig) return res.status(404).json({ message: 'Product not found' })
  const copy = orig.toObject()
  delete copy._id
  delete copy.slug
  delete copy.createdAt
  delete copy.updatedAt
  copy.name = `${orig.name} (Copy)`
  copy.status = 'draft'
  const product = await Product.create(copy)
  res.status(201).json({ product })
})
