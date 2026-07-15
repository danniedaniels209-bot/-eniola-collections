import { asyncHandler } from '../middleware/error.js'
import { cloudinaryEnabled } from '../config/cloudinary.js'

// With Cloudinary, multer sets file.path to the absolute secure URL and
// file.filename to the public_id. On local disk we build the /uploads path.
export const uploadFiles = asyncHandler(async (req, res) => {
  const folder = (req.query.folder || 'products').replace(/[^a-z]/g, '') || 'products'
  const files = (req.files || []).map((f) => ({
    url: cloudinaryEnabled ? f.path : `/uploads/${folder}/${f.filename}`,
    publicId: cloudinaryEnabled ? f.filename : undefined,
    name: f.originalname,
    size: f.size,
  }))
  res.status(201).json({ files })
})
