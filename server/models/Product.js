import mongoose from 'mongoose'
import slugify from 'slugify'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null, min: 0 },
    category: { type: String, index: true }, // stored as category name/slug for simple filtering
    sizes: [String],
    colours: [String],
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, trim: true },
    tags: [String],
    images: [String], // ordered; images[0] is the cover
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    // Lifecycle: draft/published control public visibility; archived hides everywhere.
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    const base = slugify(this.name, { lower: true, strict: true })
    this.slug = `${base}-${this._id.toString().slice(-5)}`
  }
  next()
})

productSchema.virtual('inStock').get(function () {
  return this.stock > 0
})

productSchema.set('toJSON', { virtuals: true })

export default mongoose.model('Product', productSchema)
