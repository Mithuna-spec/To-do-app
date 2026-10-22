/**
 * controllers/plannerController.js
 * Smart Planner: recommendations + daily plan generation.
 */
import { Task } from '../models/Task.js'
import { rankTasks, generateDailyPlan } from '../services/priorityEngine.js'

// GET /api/planner/recommendations
export async function getRecommendations(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.user._id })
    const ranked = rankTasks(tasks.map(t => t.toJSON()))
    return res.json({ recommendations: ranked.slice(0, 10) })
  } catch (err) {
    next(err)
  }
}

// POST /api/planner/daily-plan
export async function createDailyPlan(req, res, next) {
  try {
    const budgetMinutes = Number(req.body.budgetMinutes)
    if (!budgetMinutes || budgetMinutes < 10 || budgetMinutes > 1440) {
      return res.status(400).json({ error: 'budgetMinutes must be between 10 and 1440' })
    }

    const tasks = await Task.find({ userId: req.user._id })
    const plan = generateDailyPlan(tasks.map(t => t.toJSON()), budgetMinutes)

    return res.json(plan)
  } catch (err) {
    next(err)
  }
}
