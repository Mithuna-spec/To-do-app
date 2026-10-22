import { Search, X } from 'lucide-react'

/**
 * SearchInput — controlled search field.
 * Props:
 *   value: string
 *   onChange: (val: string) => void
 */
export default function SearchInput({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-60">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none"
        aria-hidden="true"
      />
      <input
        id="search-tasks"
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search tasks…"
        aria-label="Search tasks"
        autoComplete="off"
        className="
          w-full pl-9 pr-8 py-2 text-sm rounded-lg
          bg-surface-800 border border-surface-700 text-surface-100
          placeholder:text-surface-500
          focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent
          transition-all duration-150
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-200 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-violet-500/60"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
