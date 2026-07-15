import { v2 as cloudinary } from 'cloudinary'

// Env values pasted into dashboards often arrive with stray quotes/whitespace.
const clean = (v) => (v || '').trim().replace(/^["']|["']$/g, '')

const cloudName = clean(process.env.CLOUDINARY_CLOUD_NAME)
const apiKey = clean(process.env.CLOUDINARY_API_KEY)
const apiSecret = clean(process.env.CLOUDINARY_API_SECRET)
const url = clean(process.env.CLOUDINARY_URL)

// Only take the discrete-vars path when ALL THREE are present — a missing secret
// there silently produces "Invalid Signature" on every upload. Otherwise fall
// back to CLOUDINARY_URL, which carries all three in one string.
const hasDiscrete = Boolean(cloudName && apiKey && apiSecret)
export const cloudinaryEnabled = hasDiscrete || Boolean(url)

if (hasDiscrete) {
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
  console.log(`☁️  Cloudinary configured (cloud: ${cloudName}, key: ${apiKey})`)
} else if (url) {
  cloudinary.config({ secure: true }) // SDK parses CLOUDINARY_URL itself
  console.log('☁️  Cloudinary configured from CLOUDINARY_URL')
} else {
  console.log('💾 Cloudinary not configured — uploads use local disk')
  if (cloudName || apiKey || apiSecret) {
    console.warn(
      `   ⚠️  Partial config ignored — missing: ${[
        !cloudName && 'CLOUDINARY_CLOUD_NAME',
        !apiKey && 'CLOUDINARY_API_KEY',
        !apiSecret && 'CLOUDINARY_API_SECRET',
      ]
        .filter(Boolean)
        .join(', ')}`
    )
  }
}

// Verified once at boot so /health can report whether the credentials actually
// work, rather than merely whether they were supplied.
export const cloudinaryStatus = { checked: false, valid: null, error: null }

export async function verifyCloudinary() {
  if (!cloudinaryEnabled) return
  try {
    await cloudinary.api.ping()
    cloudinaryStatus.valid = true
    console.log('☁️  Cloudinary credentials verified')
  } catch (e) {
    cloudinaryStatus.valid = false
    cloudinaryStatus.error = e.error?.message || e.message
    console.error('❌ Cloudinary credentials REJECTED:', cloudinaryStatus.error)
    console.error('   Check CLOUDINARY_API_SECRET — uploads will fail with "Invalid Signature".')
  } finally {
    cloudinaryStatus.checked = true
  }
}

export { cloudinary }
