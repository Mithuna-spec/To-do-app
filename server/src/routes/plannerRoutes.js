/**
 * routes/plannerRoutes.js
 */
import { Router } from 'express'
import { getRecommendations, createDailyPlan } from '../controllers/plannerController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/recommendations', getRecommendations)
router.post('/daily-plan', createDailyPlan)

export default router
