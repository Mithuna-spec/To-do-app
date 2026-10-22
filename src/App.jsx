import { useState, useCallback } from 'react'
import { useTasks } from './hooks/useTasks.js'
import { loadTheme, saveTheme } from './utils/storage.js'
import { todayString } from './utils/taskUtils.js'

import Sidebar from './components/Sidebar.jsx'
import Header from './components/Header.jsx'
import StatsCards from './components/StatsCards.jsx'
import ProgressOverview from './components/ProgressOverview.jsx'
import TaskList from './components/TaskList.jsx'
import FilterBar from './components/FilterBar.jsx'
import TaskFormDialog from './components/TaskFormDialog.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import Toast from './components/Toast.jsx'

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

// ─── Sidebar task counts ──────────────────────────────────────────────────────

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

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { tasks, addTask, editTask, toggleComplete, deleteTask, computeStats, applyFilters } = useTasks()

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

  // Confirm delete state
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

  function handleFormSubmit(fields) {
    if (formMode === 'edit') {
      editTask(editingTask.id, fields)
      addToast('Task updated successfully.', 'success')
    } else {
      addTask(fields)
      addToast('Task created successfully.', 'success')
    }
    setFormOpen(false)
  }

  function handleToggleComplete(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    toggleComplete(id)
    const willBeCompleted = !task.completed
    addToast(
      willBeCompleted ? 'Task marked as complete!' : 'Task marked as pending.',
      'success'
    )
  }

  function handleDeleteRequest(id) {
    setPendingDeleteId(id)
    setConfirmOpen(true)
  }

  function handleDeleteConfirm() {
    if (pendingDeleteId) {
      deleteTask(pendingDeleteId)
      addToast('Task deleted.', 'deleted')
    }
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  function handleDeleteCancel() {
    setConfirmOpen(false)
    setPendingDeleteId(null)
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
            {/* Stats */}
            <StatsCards stats={stats} />

            {/* Progress */}
            <ProgressOverview stats={stats} onAddTask={openAddTask} />

            {/* Task workspace */}
            <section aria-label="Task workspace" className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden">
              {/* Workspace header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-surface-700/60">
                <div>
                  <h2 className="text-sm font-semibold text-surface-100">
                    Tasks
                    <span className="ml-2 text-xs font-medium text-surface-500 bg-surface-800 border border-surface-700 px-2 py-0.5 rounded-md">
                      {filteredTasks.length}
                    </span>
                  </h2>
                </div>
                <FilterBar
                  status={status}
                  priority={priority}
                  sort={sort}
                  onStatusChange={setStatus}
                  onPriorityChange={setPriority}
                  onSortChange={setSort}
                  onReset={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              {/* Task list */}
              <div className="px-4 sm:px-5 py-4">
                <TaskList
                  tasks={filteredTasks}
                  hasSearch={search !== ''}
                  hasFilters={status !== 'all' || priority !== 'all' || activeCategory !== 'all' || activeView !== 'all'}
                  view={activeView}
                  onToggle={handleToggleComplete}
                  onEdit={openEditTask}
                  onDelete={handleDeleteRequest}
                  onAddTask={openAddTask}
                />
              </div>
            </section>
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
