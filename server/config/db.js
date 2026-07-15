import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set — API will run but DB routes will fail until configured.')
    return false
  }
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(uri)
    console.log('✅ MongoDB Atlas connected')
    return true
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    return false
  }
}
