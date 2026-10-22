/**
 * useTasks.js
 * Central hook for all task state management.
 */

import { useState, useCallback, useEffect } from 'react'
import { loadTasks, saveTasks } from '../utils/storage.js'
import { createTask, updateTask, computeStats, applyFilters } from '../utils/taskUtils.js'

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks())

  // Persist whenever tasks change
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const addTask = useCallback((fields) => {
    const task = createTask(fields)
    setTasks(prev => [task, ...prev])
    return task
  }, [])

  const editTask = useCallback((id, fields) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? updateTask(t, fields) : t)
    )
  }, [])

  const toggleComplete = useCallback((id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    tasks,
    addTask,
    editTask,
    toggleComplete,
    deleteTask,
    computeStats: () => computeStats(tasks),
    applyFilters: (opts) => applyFilters(tasks, opts),
  }
}
