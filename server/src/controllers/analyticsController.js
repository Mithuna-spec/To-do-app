/**
 * controllers/analyticsController.js
 * Real analytics computed from MongoDB data.
 */
import { Task } from '../models/Task.js'
import { FocusSession } from '../models/FocusSession.js'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// GET /api/analytics/overview
export async function overview(req, res, next) {
  try {
    const userId = req.user._id
    const today = todayStr()

    const tasks = await Task.find({ userId })
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = tasks.filter(t => !t.completed).length
    const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length

    // By category
    const byCategory = { Study: 0, Coding: 0, Personal: 0, Other: 0 }
    for (const t of tasks.filter(t => t.completed)) {
      byCategory[t.category] = (byCategory[t.category] || 0) + 1
    }

    // Total focus time
    const sessions = await FocusSession.find({ userId, status: 'completed' })
    const totalFocusSeconds = sessions.reduce((sum, s) => sum + (s.actualDurationSeconds || 0), 0)

    return res.json({
      total,
      completed,
      pending,
      overdue,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
      byCategory,
      totalFocusMinutes: Math.round(totalFocusSeconds / 60),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/analytics/weekly
export async function weekly(req, res, next) {
  try {
    const userId = req.user._id

    // Build array of last 7 days as YYYY-MM-DD
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
    }

    // Fetch tasks updated in the window that are completed
    const startDate = new Date(days[0] + 'T00:00:00')
    const endDate = new Date(days[6] + 'T23:59:59.999')

    const completedTasks = await Task.find({
      userId,
      completed: true,
      updatedAt: { $gte: startDate, $lte: endDate },
    })

    // Count per day based on updatedAt (when they were marked complete)
    const chart = days.map(day => {
      const count = completedTasks.filter(t => {
        const u = t.updatedAt
        const uStr = `${u.getFullYear()}-${String(u.getMonth() + 1).padStart(2, '0')}-${String(u.getDate()).padStart(2, '0')}`
        return uStr === day
      }).length
      return { date: day, completed: count }
    })

    // Weekly completion rate
    const totalCompletedThisWeek = completedTasks.length
    const allTasks = await Task.countDocuments({ userId })
    const weeklyRate = allTasks === 0 ? 0 : Math.round((totalCompletedThisWeek / allTasks) * 100)

    return res.json({ chart, weeklyRate, totalCompletedThisWeek })
  } catch (err) {
    next(err)
  }
}
