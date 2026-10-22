/**
 * routes/analyticsRoutes.js
 */
import { Router } from 'express'
import { overview, weekly } from '../controllers/analyticsController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/overview', overview)
router.get('/weekly', weekly)

export default router
