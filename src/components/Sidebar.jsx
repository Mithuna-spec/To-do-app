import {
  CheckSquare2, BookOpen, Code2, User, FolderOpen,
  ListTodo, CalendarClock, CalendarCheck, CheckCircle2,
  Menu, X, Zap
} from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

const NAV_ITEMS = [
  { id: 'all',       label: 'All Tasks',  icon: ListTodo },
  { id: 'today',     label: 'Today',      icon: CalendarClock },
  { id: 'upcoming',  label: 'Upcoming',   icon: CalendarCheck },
  { id: 'completed', label: 'Completed',  icon: CheckCircle2 },
]

const CATEGORY_ITEMS = [
  { id: 'Study',    label: 'Study',    icon: BookOpen,    color: 'text-sky-400' },
  { id: 'Coding',   label: 'Coding',   icon: Code2,       color: 'text-emerald-400' },
  { id: 'Personal', label: 'Personal', icon: User,        color: 'text-amber-400' },
  { id: 'Other',    label: 'Other',    icon: FolderOpen,  color: 'text-rose-400' },
]

/**
 * Sidebar navigation component.
 * Props:
 *   activeView: string
 *   onViewChange: (view) => void
 *   activeCategory: string
 *   onCategoryChange: (cat) => void
 *   theme: string
 *   onThemeToggle: () => void
 *   mobileOpen: boolean
 *   onMobileClose: () => void
 *   taskCounts: object — { all, today, upcoming, completed, Study, Coding, Personal, Other }
 */
export default function Sidebar({
  activeView,
  onViewChange,
  activeCategory,
  onCategoryChange,
  theme,
  onThemeToggle,
  mobileOpen,
  onMobileClose,
  taskCounts = {},
}) {
  function handleNav(id) {
    onViewChange(id)
    onCategoryChange('all')
    onMobileClose()
  }

  function handleCategory(cat) {
    onViewChange('all')
    onCategoryChange(cat)
    onMobileClose()
  }

  const sidebarContent = (
    <aside className="flex flex-col h-full w-64 bg-surface-900 border-r border-surface-700/60 shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-surface-700/60">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600 shadow-lg shadow-violet-500/30">
            <Zap size={16} className="text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold tracking-tight text-surface-50">TaskFlow</span>
        </div>
        {/* Mobile close button */}
        <button
          className="lg:hidden p-1 rounded text-surface-400 hover:text-surface-100 focus:outline-none focus:ring-2 focus:ring-violet-500/60"
          onClick={onMobileClose}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeView === id && activeCategory === 'all'
            const count = taskCounts[id] ?? 0
            return (
              <li key={id}>
                <button
                  onClick={() => handleNav(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 group
                    focus:outline-none focus:ring-2 focus:ring-violet-500/60
                    ${isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-700/50'
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} aria-hidden="true" className={isActive ? 'text-violet-400' : 'group-hover:text-surface-200'} />
                    {label}
                  </span>
                  {count > 0 && (
                    <span className={`
                      text-xs font-semibold px-1.5 py-0.5 rounded-md min-w-[1.4rem] text-center
                      ${isActive ? 'bg-violet-500/30 text-violet-300' : 'bg-surface-700 text-surface-400'}
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Category section */}
        <div className="mt-6">
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-surface-500 select-none">
            Categories
          </p>
          <ul className="space-y-0.5" role="list">
            {CATEGORY_ITEMS.map(({ id, label, icon: Icon, color }) => {
              const isActive = activeCategory === id
              const count = taskCounts[id] ?? 0
              return (
                <li key={id}>
                  <button
                    onClick={() => handleCategory(id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 group
                      focus:outline-none focus:ring-2 focus:ring-violet-500/60
                      ${isActive
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : 'text-surface-400 hover:text-surface-100 hover:bg-surface-700/50'
                      }
                    `}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} aria-hidden="true" className={isActive ? 'text-violet-400' : color} />
                      {label}
                    </span>
                    {count > 0 && (
                      <span className={`
                        text-xs font-semibold px-1.5 py-0.5 rounded-md min-w-[1.4rem] text-center
                        ${isActive ? 'bg-violet-500/30 text-violet-300' : 'bg-surface-700 text-surface-400'}
                      `}>
                        {count}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-surface-700/60 flex items-center justify-between">
        <p className="text-xs text-surface-500">Plan. Focus. Done.</p>
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex h-full">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="relative z-10 flex animate-[slideInLeft_0.25s_ease-out]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
