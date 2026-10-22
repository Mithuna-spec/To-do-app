/**
 * routes/focusRoutes.js
 */
import { Router } from 'express'
import { listSessions, startSession, updateSession } from '../controllers/focusController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/', listSessions)
router.post('/', startSession)
router.patch('/:id', updateSession)

export default router
