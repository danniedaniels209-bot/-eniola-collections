export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  console.error(err)
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate value', fields: err.keyValue })
  }
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
}

// Wrap async controllers so thrown errors reach errorHandler.
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
