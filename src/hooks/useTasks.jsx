/**
 * useTasks.jsx
 * Central hook for all task state management.
 * Now backed by the REST API (MongoDB) instead of localStorage.
 */

import { useState, useCallback, useEffect } from 'react'
import { taskAPI } from '../services/api.jsx'
import { computeStats, applyFilters } from '../utils/taskUtils.jsx'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Fetch all tasks on mount ─────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskAPI.list()
      setTasks(data.tasks || [])
    } catch (err) {
      setError(err.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const addTask = useCallback(async (fields) => {
    const data = await taskAPI.create(fields)
    setTasks(prev => [data.task, ...prev])
    return data.task
  }, [])

  const editTask = useCallback(async (id, fields) => {
    const data = await taskAPI.update(id, fields)
    setTasks(prev => prev.map(t => t.id === id ? data.task : t))
    return data.task
  }, [])

  const toggleComplete = useCallback(async (id) => {
    const data = await taskAPI.toggleComplete(id)
    setTasks(prev => prev.map(t => t.id === id ? data.task : t))
    return data.task
  }, [])

  const deleteTask = useCallback(async (id) => {
    await taskAPI.delete(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    toggleComplete,
    deleteTask,
    computeStats: () => computeStats(tasks),
    applyFilters: (opts) => applyFilters(tasks, opts),
  }
}
