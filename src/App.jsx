import { useState, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'
import { loadTheme, saveTheme } from './utils/storage.jsx'

import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import TaskFormDialog from './components/TaskFormDialog.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import Toast from './components/Toast.jsx'
import { useTasks } from './hooks/useTasks.jsx'
import { todayString } from './utils/taskUtils.jsx'

// ─── Toast manager hook ───────────────────────────────────────────────────────

let toastIdCounter = 0
function useToasts() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastIdCounter
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, dismissToast }
}

// ─── Protected Route Component ─────────────────────────────────────────────────

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// ─── Full Dashboard Layout with Sidebar ───────────────────────────────────────

function DashboardLayout() {
  const { tasks, addTask, editTask, toggleComplete, deleteTask, computeStats, applyFilters } = useTasks()
  const { user, logout } = useAuth()

  // Theme
  const [theme, setTheme] = useState(() => loadTheme())
  function handleThemeToggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  // Navigation state
  const [activeView, setActiveView] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filter / search state
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [sort, setSort] = useState('createdAt')

  const hasActiveFilters = search !== '' || status !== 'all' || priority !== 'all' || sort !== 'createdAt'

  function resetFilters() {
    setSearch('')
    setStatus('all')
    setPriority('all')
    setSort('createdAt')
  }

  // Dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [editingTask, setEditingTask] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  // Toasts
  const { toasts, addToast, dismissToast } = useToasts()

  // ── Event handlers ─────────────────────────────────────────────────────────

  function openAddTask() {
    setFormMode('create')
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEditTask(task) {
    setFormMode('edit')
    setEditingTask(task)
    setFormOpen(true)
  }

  async function handleFormSubmit(fields) {
    try {
      if (formMode === 'edit') {
        await editTask(editingTask.id, fields)
        addToast('Task updated successfully.', 'success')
      } else {
        await addTask(fields)
        addToast('Task created successfully.', 'success')
      }
      setFormOpen(false)
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error')
    }
  }

  async function handleToggleComplete(id) {
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return
      const willBeCompleted = !task.completed
      await toggleComplete(id)
      addToast(
        willBeCompleted ? 'Task marked as complete!' : 'Task marked as pending.',
        'success'
      )
    } catch (err) {
      addToast(err.message || 'Failed to toggle', 'error')
    }
  }

  function handleDeleteRequest(id) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  async function handleDeleteConfirm() {
    if (pendingDeleteId) {
      try {
        await deleteTask(pendingDeleteId)
        addToast('Task deleted.', 'deleted')
      } catch (err) {
        addToast(err.message || 'Failed to delete', 'error')
      }
    }
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  function handleDeleteCancel() {
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  // ── Sidebar task counts ──────────────────────────────────────────────────────

  function computeCounts(tasks) {
    const today = todayString()
    return {
      all: tasks.length,
      today: tasks.filter(t => t.dueDate === today).length,
      upcoming: tasks.filter(t => t.dueDate && t.dueDate > today && !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      Study: tasks.filter(t => t.category === 'Study').length,
      Coding: tasks.filter(t => t.category === 'Coding').length,
      Personal: tasks.filter(t => t.category === 'Personal').length,
      Other: tasks.filter(t => t.category === 'Other').length,
    }
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const stats = computeStats()
  const counts = computeCounts(tasks)

  const filteredTasks = applyFilters({
    search,
    status,
    category: activeCategory,
    priority,
    sort,
    view: activeView,
  })

  const pendingDeleteTask = pendingDeleteId ? tasks.find(t => t.id === pendingDeleteId) : null

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={theme} data-theme={theme}>
      <div className="flex h-screen bg-surface-950 text-surface-100 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          taskCounts={counts}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <Header
            activeView={activeView}
            activeCategory={activeCategory}
            search={search}
            onSearchChange={setSearch}
            onAddTask={openAddTask}
            onMenuToggle={() => setMobileOpen(true)}
          />

          {/* Scrollable body */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5" id="main-content" aria-label="Main content">
            <DashboardPage
              activeView={activeView}
              activeCategory={activeCategory}
              search={search}
              onOpenAdd={openAddTask}
              onToggle={handleToggleComplete}
              onEdit={openEditTask}
              onDelete={handleDeleteRequest}
            />
          </main>
        </div>

        {/* Dialogs */}
        <TaskFormDialog
          isOpen={formOpen}
          mode={formMode}
          initialValues={editingTask}
          onSubmit={handleFormSubmit}
          onClose={() => setFormOpen(false)}
        />

        <ConfirmDialog
          isOpen={confirmOpen}
          title="Delete Task"
          message={pendingDeleteTask ? `Are you sure you want to delete "${pendingDeleteTask.title}"? This action cannot be undone.` : 'Are you sure you want to delete this task?'}
          confirmLabel="Delete Task"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />

        {/* Toast notifications */}
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" replace />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
