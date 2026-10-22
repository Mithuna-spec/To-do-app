import { Plus, Menu } from 'lucide-react'
import SearchInput from './SearchInput.jsx'

const VIEW_TITLES = {
  all:       { title: 'All Tasks',  sub: 'Manage and track all your tasks' },
  today:     { title: 'Today',      sub: 'Tasks due on today\'s date' },
  upcoming:  { title: 'Upcoming',   sub: 'Future tasks with scheduled due dates' },
  completed: { title: 'Completed',  sub: 'Tasks you\'ve successfully finished' },
}

const CATEGORY_TITLES = {
  Study:    { title: 'Study',    sub: 'Academic and learning tasks' },
  Coding:   { title: 'Coding',   sub: 'Development and programming tasks' },
  Personal: { title: 'Personal', sub: 'Personal goals and errands' },
  Other:    { title: 'Other',    sub: 'Miscellaneous tasks' },
}

/**
 * Header component.
 * Props:
 *   activeView: string
 *   activeCategory: string
 *   search: string
 *   onSearchChange: (val) => void
 *   onAddTask: () => void
 *   onMenuToggle: () => void
 */
export default function Header({ activeView, activeCategory, search, onSearchChange, onAddTask, onMenuToggle }) {
  const info = activeCategory !== 'all'
    ? (CATEGORY_TITLES[activeCategory] || { title: activeCategory, sub: '' })
    : (VIEW_TITLES[activeView] || { title: 'Tasks', sub: '' })

  return (
    <header className="sticky top-0 z-30 bg-surface-950/90 backdrop-blur-md border-b border-surface-700/60 px-5 py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: hamburger + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/60"
            onClick={onMenuToggle}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-surface-50 leading-tight truncate">{info.title}</h1>
            <p className="text-xs text-surface-500 mt-0.5 truncate hidden sm:block">{info.sub}</p>
          </div>
        </div>

        {/* Right: search + add */}
        <div className="flex items-center gap-3 flex-1 sm:flex-none justify-end">
          <SearchInput value={search} onChange={onSearchChange} />
          <button
            id="add-task-btn"
            onClick={onAddTask}
            className="
              flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm
              bg-violet-600 hover:bg-violet-500 active:bg-violet-700
              text-white shadow-lg shadow-violet-500/25
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-violet-400/60 focus:ring-offset-2 focus:ring-offset-surface-950
              whitespace-nowrap
            "
          >
            <Plus size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  )
}
