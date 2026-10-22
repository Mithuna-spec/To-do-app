import { Sun, Moon } from 'lucide-react'

/**
 * ThemeToggle — switches between dark and light mode.
 * Props:
 *   theme: 'dark' | 'light'
 *   onToggle: () => void
 */
export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        flex items-center justify-center w-9 h-9 rounded-lg
        text-surface-400 hover:text-surface-100
        hover:bg-surface-700 dark:hover:bg-surface-600
        border border-surface-700 dark:border-surface-600
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-violet-500/60
      "
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
