import Category from '../models/Category.js'
import { asyncHandler } from '../middleware/error.js'

export const listCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all ? {} : { hidden: false }
  const items = await Category.find(filter).sort({ order: 1, createdAt: 1 })
  res.json({ items })
})

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body)
  res.status(201).json({ category })
})

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!category) return res.status(404).json({ message: 'Category not found' })
  res.json({ category })
})

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id)
  if (!category) return res.status(404).json({ message: 'Category not found' })
  res.json({ message: 'Deleted' })
})

// Bulk reorder: [{ id, order }, ...]
export const reorderCategories = asyncHandler(async (req, res) => {
  const updates = req.body.order || []
  await Promise.all(updates.map((u) => Category.findByIdAndUpdate(u.id, { order: u.order })))
  res.json({ message: 'Reordered' })
})
