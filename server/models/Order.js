import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    size: String,
    colour: String,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    contact: {
      name: String,
      email: String,
      phone: String,
    },
    items: [orderItemSchema],
    delivery: {
      line1: String,
      city: String,
      state: String,
      country: { type: String, default: 'Nigeria' },
      fee: { type: Number, default: 0 },
    },
    subtotal: Number,
    discount: { type: Number, default: 0 },
    couponCode: String,
    total: Number,
    paymentMethod: {
      type: String,
      enum: ['paystack', 'flutterwave', 'cod', 'bank_transfer'],
      default: 'cod',
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    // Time-independent enough for readability; uniqueness enforced by index.
    this.orderNumber = 'ENI-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  }
  next()
})

export default mongoose.model('Order', orderSchema)
