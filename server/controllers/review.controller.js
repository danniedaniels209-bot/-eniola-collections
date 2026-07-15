import Review from '../models/Review.js'
import Product from '../models/Product.js'
import { asyncHandler } from '../middleware/error.js'

async function recalcRating(productId) {
  const approved = await Review.find({ product: productId, status: 'approved' })
  const count = approved.length
  const avg = count ? approved.reduce((s, r) => s + r.rating, 0) / count : 0
  await Product.findByIdAndUpdate(productId, {
    ratingAvg: Math.round(avg * 10) / 10,
    ratingCount: count,
  })
}

// Public: reviews for a product (approved only)
export const listProductReviews = asyncHandler(async (req, res) => {
  const items = await Review.find({ product: req.params.productId, status: 'approved' }).sort({
    createdAt: -1,
  })
  res.json({ items })
})

// Customer: submit a review (pending moderation)
export const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create({
    product: req.params.productId,
    customer: req.user?._id,
    name: req.body.name || req.user?.name,
    rating: req.body.rating,
    text: req.body.text,
    photos: req.body.photos,
  })
  res.status(201).json({ review })
})

// Admin
export const listAllReviews = asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {}
  const items = await Review.find(filter).sort({ createdAt: -1 }).populate('product', 'name')
  res.json({ items })
})

export const moderateReview = asyncHandler(async (req, res) => {
  const { status, featured, reply } = req.body
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(featured !== undefined && { featured }), ...(reply !== undefined && { reply }) },
    { new: true }
  )
  if (!review) return res.status(404).json({ message: 'Review not found' })
  await recalcRating(review.product)
  res.json({ review })
})

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) return res.status(404).json({ message: 'Review not found' })
  await recalcRating(review.product)
  res.json({ message: 'Deleted' })
})
