import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — API will run but DB routes will fail until configured.')
    return false
  }
  try {
    mongoose.set('strictQuery', true)
    // Fail fast rather than letting queries hang for the default 30s.
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    console.log('✅ MongoDB Atlas connected')
    return true
  } catch (err) {
    // Most common cause in production: the deploy platform's IP isn't allowed in
    // Atlas → Network Access. Surface that hint rather than a bare driver error.
    console.error('❌ MongoDB connection error:', err.message)
    if (/whitelist|not allowed|ETIMEDOUT|ServerSelection/i.test(err.message)) {
      console.error('   Hint: add 0.0.0.0/0 in MongoDB Atlas → Network Access.')
    }
    throw err
  }
}
