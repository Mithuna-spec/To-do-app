/**
 * taskUtils.js
 * Pure utility functions for task data operations.
 */

// ─── Priority helpers ────────────────────────────────────────────────────────

export const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 }
export const PRIORITIES = ['High', 'Medium', 'Low']
export const CATEGORIES = ['Study', 'Coding', 'Personal', 'Other']

// ─── Date helpers ────────────────────────────────────────────────────────────

/**
 * Returns today's date as a YYYY-MM-DD string using local calendar.
 */
export function todayString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Compares two YYYY-MM-DD strings lexicographically (works because format is zero-padded ISO).
 * Returns negative if a < b, 0 if equal, positive if a > b.
 */
export function compareDateStrings(a, b) {
  if (!a && !b) return 0
  if (!a) return 1   // no date → sort after
  if (!b) return -1
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Returns true when a task is overdue:
 *  - not completed
 *  - has a valid dueDate
 *  - dueDate is strictly before today (local calendar)
 */
export function isOverdue(task) {
  if (task.completed) return false
  if (!task.dueDate) return false
  return task.dueDate < todayString()
}

/**
 * Returns true when a task is due today (local calendar).
 */
export function isDueToday(task) {
  if (!task.dueDate) return false
  return task.dueDate === todayString()
}

// ─── Task factory ────────────────────────────────────────────────────────────

/**
 * Creates a new task object with sensible defaults.
 */
export function createTask({ title, description = '', category = 'Personal', priority = 'Medium', dueDate = '' }) {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: title.trim(),
    description: description.trim(),
    category,
    priority,
    dueDate: dueDate || '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Returns an updated copy of task with new field values.
 * Preserves id and createdAt; updates updatedAt.
 */
export function updateTask(task, fields) {
  return {
    ...task,
    ...fields,
    title: (fields.title ?? task.title).trim(),
    description: (fields.description ?? task.description).trim(),
    id: task.id,
    createdAt: task.createdAt,
    updatedAt: new Date().toISOString(),
  }
}

// ─── ID generation ───────────────────────────────────────────────────────────

export function generateId() {
  // Simple unique ID without external dep
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ─── Task validation ─────────────────────────────────────────────────────────

const VALID_PRIORITIES = new Set(['High', 'Medium', 'Low'])
const VALID_CATEGORIES = new Set(['Study', 'Coding', 'Personal', 'Other'])

/**
 * Returns true when obj looks like a valid task.
 */
export function isValidTask(obj) {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.id !== 'string' || !obj.id) return false
  if (typeof obj.title !== 'string' || !obj.title.trim()) return false
  if (!VALID_PRIORITIES.has(obj.priority)) return false
  if (!VALID_CATEGORIES.has(obj.category)) return false
  if (typeof obj.completed !== 'boolean') return false
  return true
}

// ─── Filtering and sorting ────────────────────────────────────────────────────

/**
 * Filters and sorts a task array according to the given options.
 * Does NOT mutate the original array.
 */
export function applyFilters(tasks, { search = '', status = 'all', category = 'all', priority = 'all', sort = 'createdAt', view = 'all' }) {
  const today = todayString()
  const q = search.toLowerCase().trim()

  let result = tasks.filter(task => {
    // Search
    if (q) {
      const inTitle = task.title.toLowerCase().includes(q)
      const inDesc = (task.description || '').toLowerCase().includes(q)
      if (!inTitle && !inDesc) return false
    }

    // View (sidebar navigation)
    if (view === 'today') {
      if (task.dueDate !== today) return false
    } else if (view === 'upcoming') {
      if (!task.dueDate || task.dueDate <= today || task.completed) return false
    } else if (view === 'completed') {
      if (!task.completed) return false
    }

    // Status filter (within view)
    if (status === 'pending') {
      if (task.completed) return false
    } else if (status === 'completed') {
      if (!task.completed) return false
    } else if (status === 'overdue') {
      if (!isOverdue(task)) return false
    }

    // Category
    if (category !== 'all' && task.category !== category) return false

    // Priority
    if (priority !== 'all' && task.priority !== priority) return false

    return true
  })

  // Sort (create new array to avoid mutation)
  result = [...result].sort((a, b) => {
    if (sort === 'dueDate') {
      return compareDateStrings(a.dueDate, b.dueDate)
    }
    if (sort === 'priority') {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    }
    // Default: recently created (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return result
}

// ─── Statistics ───────────────────────────────────────────────────────────────

/**
 * Computes summary statistics from all tasks.
 */
export function computeStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = tasks.filter(t => !t.completed).length
  const overdue = tasks.filter(isOverdue).length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, pending, overdue, percentage }
}
