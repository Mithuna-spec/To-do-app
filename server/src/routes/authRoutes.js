/**
 * routes/authRoutes.js
 */
import { Router } from 'express'
import { register, login, logout, getMe } from '../controllers/authController.js'
import { registerSchema, loginSchema, validate } from '../validators/authValidator.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', logout)
router.get('/me', requireAuth, getMe)

export default router
