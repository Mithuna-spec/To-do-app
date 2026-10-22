/**
 * services/priorityEngine.js
 *
 * Deterministic Smart Priority Engine.
 *
 * SCORING FORMULA (max ~100):
 *   score = urgencyScore + importanceScore + durationBonus
 *
 * urgencyScore (0-50):
 *   - Overdue tasks: 50  (maximum urgency)
 *   - Due today:     40
 *   - Due in 1 day:  35
 *   - Due in 2 days: 30
 *   - Due in 3 days: 25
 *   - Due in 4-7 days: 15-20 (linear)
 *   - Due in 8-14 days: 8-14  (linear)
 *   - Due later: 5
 *   - No due date:  3
 *
 * importanceScore (0-30):
 *   importance(1-5) * 6
 *
 * durationBonus (0-20):
 *   Shorter tasks get a small bonus to encourage quick wins.
 *   20 - min(estimatedMinutes / 6, 20)
 *
 * NOTE: Completed tasks are excluded before scoring.
 * This is NOT AI or machine learning — it is a deterministic heuristic.
 */

/**
 * Returns today as YYYY-MM-DD using local calendar.
 */
function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Number of calendar days from today to dateStr (YYYY-MM-DD).
 * Negative means overdue. Uses local dates to avoid timezone bugs.
 */
function daysUntil(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const target = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}

function urgencyScore(dueDate) {
  if (!dueDate) return 3
  const days = daysUntil(dueDate)
  if (days < 0) return 50   // overdue
  if (days === 0) return 40  // due today
  if (days === 1) return 35
  if (days === 2) return 30
  if (days === 3) return 25
  if (days <= 7) return Math.round(20 - (days - 4) * (5 / 3))
  if (days <= 14) return Math.round(14 - (days - 8) * (6 / 6))
  return 5
}

function importanceScore(importance) {
  return (importance || 3) * 6 // 6-30
}

function durationBonus(estimatedMinutes) {
  const mins = estimatedMinutes || 30
  return Math.max(0, 20 - Math.min(mins / 6, 20))
}

/**
 * Compute a priority score for a single task.
 * Returns { score, explanation, urgencyLabel }
 */
export function computePriorityScore(task) {
  const u = urgencyScore(task.dueDate)
  const i = importanceScore(task.importance)
  const d = durationBonus(task.estimatedMinutes)
  const score = Math.round(u + i + d)

  // Build explanation
  const parts = []
  if (!task.dueDate) {
    parts.push('No deadline set')
  } else {
    const days = daysUntil(task.dueDate)
    if (days < 0) parts.push(`Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`)
    else if (days === 0) parts.push('Due today')
    else if (days === 1) parts.push('Due tomorrow')
    else parts.push(`Due in ${days} days`)
  }
  parts.push(`Importance: ${task.importance || 3}/5`)
  if ((task.estimatedMinutes || 30) <= 15) parts.push('Quick task')

  let urgencyLabel = 'low'
  if (score >= 70) urgencyLabel = 'critical'
  else if (score >= 50) urgencyLabel = 'high'
  else if (score >= 30) urgencyLabel = 'medium'

  return { score, explanation: parts.join(' · '), urgencyLabel }
}

/**
 * Score and rank an array of tasks.
 * Excludes completed tasks. Returns sorted (highest score first).
 */
export function rankTasks(tasks) {
  return tasks
    .filter(t => !t.completed)
    .map(t => {
      const scoring = computePriorityScore(t)
      return { ...t, ...scoring }
    })
    .sort((a, b) => b.score - a.score)
}

/**
 * Generate a daily plan within a time budget.
 *
 * @param {Array} tasks — all user tasks
 * @param {number} budgetMinutes — total available minutes
 * @returns {{ scheduled, unscheduled, totalMinutes, budgetMinutes, conflicts }}
 */
export function generateDailyPlan(tasks, budgetMinutes) {
  const ranked = rankTasks(tasks)
  const scheduled = []
  const unscheduled = []
  let totalMinutes = 0

  for (const task of ranked) {
    const est = task.estimatedMinutes || 30
    if (totalMinutes + est <= budgetMinutes) {
      scheduled.push(task)
      totalMinutes += est
    } else {
      unscheduled.push(task)
    }
  }

  // Detect conflicts: multiple high-urgency tasks sharing a deadline
  const conflicts = []
  const deadlineGroups = {}
  for (const t of ranked.filter(t => t.urgencyLabel === 'critical' || t.urgencyLabel === 'high')) {
    const key = t.dueDate || 'none'
    if (!deadlineGroups[key]) deadlineGroups[key] = []
    deadlineGroups[key].push(t)
  }
  for (const [date, group] of Object.entries(deadlineGroups)) {
    if (group.length >= 2 && date !== 'none') {
      conflicts.push({
        date,
        count: group.length,
        message: `${group.length} high-priority tasks share the deadline ${date}`,
      })
    }
  }

  return { scheduled, unscheduled, totalMinutes, budgetMinutes, conflicts }
}
