import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const addressSchema = new mongoose.Schema(
  {
    label: String,
    line1: String,
    city: String,
    state: String,
    country: { type: String, default: 'Nigeria' },
    phone: String,
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    phone: String,
    avatar: String,
    addresses: [addressSchema],
    paymentPreference: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    suspended: { type: Boolean, default: false },
    // Password reset (token is stored hashed; raw token only leaves once).
    resetTokenHash: { type: String, select: false },
    resetExpires: { type: Date, select: false },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
