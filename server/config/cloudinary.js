import { v2 as cloudinary } from 'cloudinary'

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_URL } = process.env

// Enabled when either the three discrete vars OR the single CLOUDINARY_URL is set.
export const cloudinaryEnabled = Boolean(
  (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) || CLOUDINARY_URL
)

if (cloudinaryEnabled) {
  // The SDK reads CLOUDINARY_URL automatically; config() covers the discrete vars.
  if (CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    })
  } else {
    cloudinary.config({ secure: true })
  }
  console.log('☁️  Cloudinary storage enabled')
} else {
  console.log('💾 Cloudinary not configured — uploads use local disk')
}

export { cloudinary }
