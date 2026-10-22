/**
 * pages/DashboardPage.jsx
 * Main dashboard content — receives state from parent App.jsx.
 */
import { useState } from 'react'
import { useTasks } from '../hooks/useTasks.jsx'

import StatsCards from '../components/StatsCards.jsx'
import ProgressOverview from '../components/ProgressOverview.jsx'
import TaskList from '../components/TaskList.jsx'
import FilterBar from '../components/FilterBar.jsx'

export default function DashboardPage({ activeView, activeCategory, search, onOpenAdd, onToggle, onEdit, onDelete }) {
  const { tasks, loading, computeStats, applyFilters } = useTasks()

  // Filter / search state (local to this page)
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [sort, setSort] = useState('createdAt')

  const hasActiveFilters = search !== '' || status !== 'all' || priority !== 'all' || sort !== 'createdAt'

  function resetFilters() {
    setStatus('all')
    setPriority('all')
    setSort('createdAt')
  }

  // Derived data
  const stats = computeStats()
  const filteredTasks = applyFilters({
    search: search || '',
    status,
    category: activeCategory || 'all',
    priority,
    sort,
    view: activeView || 'all',
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-surface-400">Loading tasks…</span>
      </div>
    )
  }

  return (
    <>
      <StatsCards stats={stats} />
      <ProgressOverview stats={stats} onAddTask={onOpenAdd} />

      <section aria-label="Task workspace" className="bg-surface-900 border border-surface-700/60 rounded-xl overflow-hidden">
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
            status={status} priority={priority} sort={sort}
            onStatusChange={setStatus} onPriorityChange={setPriority} onSortChange={setSort}
            onReset={resetFilters} hasActiveFilters={hasActiveFilters}
          />
        </div>
        <div className="px-4 sm:px-5 py-4">
          <TaskList
            tasks={filteredTasks}
            hasSearch={!!search}
            hasFilters={status !== 'all' || priority !== 'all' || (activeCategory && activeCategory !== 'all') || (activeView && activeView !== 'all')}
            view={activeView || 'all'}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddTask={onOpenAdd}
          />
        </div>
      </section>
    </>
  )
}
