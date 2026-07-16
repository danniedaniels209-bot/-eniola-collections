import mongoose from 'mongoose'

// Single-document store settings.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'store', unique: true },
    storeName: { type: String, default: 'Êñiola Collections' },
    logo: String,
    favicon: String,
    currency: { type: String, default: 'NGN' },
    businessDetails: String,
    social: {
      instagram: String,
      tiktok: String,
      whatsapp: String,
    },
    contact: {
      phone: String,
      email: String,
      location: String,
      businessHours: String,
    },
    seo: {
      title: String,
      description: String,
    },
    payments: {
      paystack: { type: Boolean, default: true },
      flutterwave: { type: Boolean, default: true },
      cod: { type: Boolean, default: true },
      bankTransfer: { type: Boolean, default: false },
    },
    // Shown to customers who choose Bank Transfer at checkout.
    bankDetails: {
      accountNumber: { type: String, default: '' },
      accountName: { type: String, default: '' },
      bankName: { type: String, default: '' },
      instructions: {
        type: String,
        default: 'Send your payment receipt via WhatsApp to confirm your order.',
      },
    },
    delivery: {
      fee: { type: Number, default: 2500 },
      freeShippingThreshold: { type: Number, default: 100000 },
      regions: [String],
      estimatedDays: { type: String, default: '2–5 days' },
    },
    whatsapp: {
      // Owner supplies EITHER a full link (wa.me / bit.ly / chat.whatsapp.com)
      // OR a plain number. No fake defaults — empty means "not configured yet".
      link: { type: String, default: '' },
      number: { type: String, default: '' },
      defaultMessage: {
        type: String,
        default: "Hello Êñiola Collections! I'd love to place an order.",
      },
      floatingEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
)

settingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'store' })
  if (!doc) doc = await this.create({ key: 'store' })
  return doc
}

export default mongoose.model('Settings', settingsSchema)
