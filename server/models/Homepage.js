import mongoose from 'mongoose'

// Single-document homepage content, editable from the admin Homepage Manager.
const homepageSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'home', unique: true },
    heroVideo: { type: String, default: '/videos/hero.mp4' },
    heroImage: { type: String, default: '/images/hero/wardrobe.png' },
    headline: { type: String, default: 'Style that Speaks Before You Do.' },
    subheading: {
      type: String,
      default: 'Basic Tops · Crop Tops · Sneakers · Abayas · Hijabs · Everyday Essentials',
    },
    featuredProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // Decorative imagery for the infinite sliding gallery. Deliberately NOT tied
    // to products: it is a permanent showroom display the owner curates, so it
    // never empties when the catalogue changes.
    galleryImages: [String],
    categoryOrder: [String],
    banners: [
      {
        image: String,
        title: String,
        link: String,
      },
    ],
    promos: [
      {
        title: String,
        subtitle: String,
        active: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
)

homepageSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'home' })
  if (!doc) doc = await this.create({ key: 'home' })
  return doc
}

export default mongoose.model('Homepage', homepageSchema)
