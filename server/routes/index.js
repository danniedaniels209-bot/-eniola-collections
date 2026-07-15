import { Router } from 'express'
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

import * as auth from '../controllers/auth.controller.js'
import * as products from '../controllers/product.controller.js'
import * as categories from '../controllers/category.controller.js'
import * as orders from '../controllers/order.controller.js'
import * as users from '../controllers/user.controller.js'
import * as reviews from '../controllers/review.controller.js'
import * as misc from '../controllers/misc.controller.js'
import * as extra from '../controllers/extra.controller.js'
import { uploadFiles } from '../controllers/upload.controller.js'

const r = Router()
const admin = [protect, adminOnly]

/* ---------- Auth ---------- */
r.post('/auth/register', auth.register)
r.post('/auth/login', auth.login)
r.post('/auth/admin/login', auth.adminLogin)
r.get('/auth/me', protect, auth.me)
r.put('/auth/profile', protect, auth.updateProfile)
r.put('/auth/password', protect, auth.changePassword)
r.post('/auth/forgot-password', auth.forgotPassword)
r.post('/auth/reset-password', auth.resetPassword)

/* ---------- Public storefront ---------- */
r.get('/products', products.listProducts)
r.get('/products/:slug', products.getProduct)
r.get('/categories', categories.listCategories)
r.get('/reviews/product/:productId', reviews.listProductReviews)
r.get('/coupons/validate/:code', misc.validateCoupon)
r.get('/settings', misc.getSettings)
r.get('/homepage', misc.getHomepage)

/* ---------- Customer (auth) ---------- */
r.post('/orders', optionalAuth, orders.createOrder)
r.get('/orders/mine', protect, orders.myOrders)
r.put('/orders/:id/cancel', protect, orders.cancelMyOrder)
r.post('/reviews/product/:productId', protect, reviews.createReview)
r.post('/wishlist/toggle', protect, users.toggleWishlist)
r.get('/wishlist', protect, users.getWishlist)

/* ---------- Admin: products ---------- */
r.get('/admin/products', ...admin, products.adminListProducts)
r.post('/admin/products', ...admin, products.createProduct)
r.get('/admin/products/:id', ...admin, products.getProductById)
r.put('/admin/products/:id', ...admin, products.updateProduct)
r.delete('/admin/products/:id', ...admin, products.deleteProduct)
r.post('/admin/products/:id/duplicate', ...admin, products.duplicateProduct)

/* ---------- Admin: categories ---------- */
r.get('/admin/categories', ...admin, (req, res, next) => {
  req.query.all = '1'
  categories.listCategories(req, res, next)
})
r.post('/admin/categories', ...admin, categories.createCategory)
r.put('/admin/categories/reorder', ...admin, categories.reorderCategories)
r.put('/admin/categories/:id', ...admin, categories.updateCategory)
r.delete('/admin/categories/:id', ...admin, categories.deleteCategory)

/* ---------- Admin: orders ---------- */
r.get('/admin/orders', ...admin, orders.listOrders)
r.get('/admin/orders/:id', ...admin, orders.getOrder)
r.put('/admin/orders/:id/status', ...admin, orders.updateOrderStatus)

/* ---------- Admin: customers ---------- */
r.get('/admin/customers', ...admin, users.listCustomers)
r.get('/admin/customers/:id', ...admin, users.getCustomer)
r.put('/admin/customers/:id/suspend', ...admin, users.suspendCustomer)
r.put('/admin/customers/:id', ...admin, users.updateCustomer)
r.delete('/admin/customers/:id', ...admin, users.deleteCustomer)

/* ---------- Admin: reviews ---------- */
r.get('/admin/reviews', ...admin, reviews.listAllReviews)
r.put('/admin/reviews/:id', ...admin, reviews.moderateReview)
r.delete('/admin/reviews/:id', ...admin, reviews.deleteReview)

/* ---------- Admin: coupons ---------- */
r.get('/admin/coupons', ...admin, misc.listCoupons)
r.post('/admin/coupons', ...admin, misc.createCoupon)
r.put('/admin/coupons/:id', ...admin, misc.updateCoupon)
r.delete('/admin/coupons/:id', ...admin, misc.deleteCoupon)

/* ---------- Admin: settings + homepage ---------- */
r.put('/admin/settings', ...admin, misc.updateSettings)
r.put('/admin/homepage', ...admin, misc.updateHomepage)

/* ---------- Admin: inventory ---------- */
r.get('/admin/inventory', ...admin, misc.inventory)
r.put('/admin/inventory/:id', ...admin, misc.updateStock)

/* ---------- Admin: dashboard, analytics, media, notifications ---------- */
r.get('/admin/dashboard', ...admin, misc.dashboardStats)
r.get('/admin/analytics', ...admin, extra.analytics)
r.get('/admin/media', ...admin, extra.listMedia)
r.delete('/admin/media', ...admin, extra.deleteMedia)
r.get('/admin/notifications', ...admin, extra.notifications)

/* ---------- Uploads ---------- */
r.post('/admin/upload', ...admin, upload.array('files', 10), uploadFiles)

export default r
