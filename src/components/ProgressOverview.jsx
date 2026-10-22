import { TrendingUp, Plus } from 'lucide-react'

/**
 * Productivity overview / progress bar section.
 * Props:
 *   stats: { total, completed, percentage }
 *   onAddTask: () => void
 */
export default function ProgressOverview({ stats, onAddTask }) {
  const { total, completed, percentage } = stats

  return (
    <section
      className="bg-surface-900 border border-surface-700/60 rounded-xl px-5 py-5"
      aria-label="Productivity overview"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/25">
            <TrendingUp size={17} className="text-violet-400" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-surface-100">Productivity Overview</h2>
            <p className="text-xs text-surface-500 mt-0.5">
              {total === 0
                ? 'No tasks yet'
                : `${completed} of ${total} tasks completed`
              }
            </p>
          </div>
        </div>
        <span
          className="text-2xl font-bold text-violet-300"
          aria-label={`${percentage} percent complete`}
        >
          {percentage}%
        </span>
      </div>

      {total === 0 ? (
        <div className="mt-5 text-center py-4">
          <p className="text-sm text-surface-500 mb-3">Create your first task to start tracking productivity.</p>
          <button
            onClick={onAddTask}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/60"
          >
            <Plus size={15} aria-hidden="true" />
            Add your first task
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <div
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall completion: ${percentage}%`}
            className="h-2.5 bg-surface-700/80 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-surface-500">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </section>
  )
}
