import crypto from 'crypto'
import User from '../models/User.js'
import { signToken } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/error.js'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ message: 'Email already registered' })
  const user = await User.create({ name, email, password, phone })
  res.status(201).json({ token: signToken(user), user: safe(user) })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  if (user.suspended) return res.status(403).json({ message: 'Account suspended' })
  res.json({ token: signToken(user), user: safe(user) })
})

// Admin login endpoint enforces the admin role.
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  if (user.role !== 'admin') return res.status(403).json({ message: 'Not an admin account' })
  res.json({ token: signToken(user), user: safe(user) })
})

export const me = asyncHandler(async (req, res) => {
  res.json({ user: safe(req.user) })
})

// Update own profile (name, phone, avatar, addresses, payment preference).
export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'avatar', 'addresses', 'paymentPreference']
  const patch = {}
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k]
  const user = await User.findByIdAndUpdate(req.user._id, patch, { new: true })
  res.json({ user: safe(user) })
})

// Change password while logged in (requires current password).
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters' })
  const user = await User.findById(req.user._id).select('+password')
  if (!(await user.comparePassword(currentPassword)))
    return res.status(401).json({ message: 'Current password is incorrect' })
  user.password = newPassword
  await user.save()
  res.json({ message: 'Password updated' })
})

// Forgot password → issue a reset token. With no email provider wired, the raw
// token is returned so the flow is testable; in production email it instead.
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  // Always respond 200 so the endpoint can't be used to probe which emails exist.
  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' })

  const raw = crypto.randomBytes(32).toString('hex')
  user.resetTokenHash = crypto.createHash('sha256').update(raw).digest('hex')
  user.resetExpires = new Date(Date.now() + 1000 * 60 * 30) // 30 min
  await user.save()

  res.json({
    message: 'If that email exists, a reset link has been sent.',
    // Remove `devToken` once an email provider is connected.
    devToken: raw,
  })
})

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters' })
  const hash = crypto.createHash('sha256').update(token || '').digest('hex')
  const user = await User.findOne({
    resetTokenHash: hash,
    resetExpires: { $gt: new Date() },
  }).select('+resetTokenHash +resetExpires')
  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' })

  user.password = newPassword
  user.resetTokenHash = undefined
  user.resetExpires = undefined
  await user.save()
  res.json({ token: signToken(user), user: safe(user) })
})

function safe(u) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    phone: u.phone,
    avatar: u.avatar,
    addresses: u.addresses || [],
    paymentPreference: u.paymentPreference,
    createdAt: u.createdAt,
  }
}
