/**
 * routes/taskRoutes.js
 */
import { Router } from 'express'
import { listTasks, createTask, getTask, updateTask, toggleComplete, deleteTask } from '../controllers/taskController.js'
import { validateTask, validateTaskUpdate } from '../validators/taskValidator.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/', listTasks)
router.post('/', validateTask, createTask)
router.get('/:id', getTask)
router.patch('/:id', validateTaskUpdate, updateTask)
router.patch('/:id/complete', toggleComplete)
router.delete('/:id', deleteTask)

export default router
