/**
 * storage.jsx
 * Utility functions for reading and writing TaskFlow data in localStorage.
 */

import { isValidTask } from './taskUtils.jsx'

const TASKS_KEY = 'taskflow_tasks'
const THEME_KEY = 'taskflow_theme'

// ─── Tasks ────────────────────────────────────────────────────────────────────

/**
 * Loads tasks from localStorage.
 * Returns an empty array on missing or malformed data.
 */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Validate each item; silently drop invalid entries.
    return parsed.filter(isValidTask)
  } catch {
    return []
  }
}

/**
 * Persists the task array to localStorage.
 * Silently no-ops when storage is unavailable.
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  } catch {
    // Storage unavailable or quota exceeded — fail silently.
  }
}

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * Returns the persisted theme preference ('dark' | 'light'), defaulting to 'dark'.
 */
export function loadTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') return t
    return 'dark'
  } catch {
    return 'dark'
  }
}

/**
 * Persists the theme preference.
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Fail silently.
  }
}
