import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
]

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Recently Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
]

function Select({ id, label, value, options, onChange }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">{label}</label>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="
          appearance-none pl-3 pr-8 py-2 text-sm rounded-lg
          bg-surface-800 border border-surface-700 text-surface-200
          focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent
          transition-all duration-150 cursor-pointer
        "
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none"
        aria-hidden="true"
      />
    </div>
  )
}

/**
 * FilterBar component.
 * Props:
 *   status, priority, sort: string
 *   onStatusChange, onPriorityChange, onSortChange: (val) => void
 *   onReset: () => void
 *   hasActiveFilters: boolean
 */
export default function FilterBar({ status, priority, sort, onStatusChange, onPriorityChange, onSortChange, onReset, hasActiveFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter and sort tasks">
      <span className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide shrink-0">
        <SlidersHorizontal size={13} aria-hidden="true" />
        Filter
      </span>

      <Select
        id="filter-status"
        label="Filter by status"
        value={status}
        options={STATUS_OPTIONS}
        onChange={onStatusChange}
      />
      <Select
        id="filter-priority"
        label="Filter by priority"
        value={priority}
        options={PRIORITY_OPTIONS}
        onChange={onPriorityChange}
      />

      <span className="text-surface-700 select-none hidden sm:block">|</span>

      <Select
        id="sort-tasks"
        label="Sort tasks"
        value={sort}
        options={SORT_OPTIONS}
        onChange={onSortChange}
      />

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          aria-label="Reset all filters"
        >
          <X size={12} aria-hidden="true" />
          Reset
        </button>
      )}
    </div>
  )
}
