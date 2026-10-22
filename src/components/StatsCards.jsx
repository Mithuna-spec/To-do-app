import { CheckCircle2, Clock, AlertTriangle, LayoutList } from 'lucide-react'

const CARDS = [
  {
    key: 'total',
    label: 'Total Tasks',
    icon: LayoutList,
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
    valueColor: 'text-violet-300',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    valueColor: 'text-emerald-300',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    valueColor: 'text-amber-300',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    iconColor: 'text-rose-400',
    valueColor: 'text-rose-300',
  },
]

/**
 * Dashboard statistics cards.
 * Props:
 *   stats: { total, completed, pending, overdue, percentage }
 */
export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" role="region" aria-label="Task statistics">
      {CARDS.map(({ key, label, icon: Icon, bg, border, iconColor, valueColor }) => (
        <article
          key={key}
          className={`relative flex items-center gap-4 px-4 py-4 rounded-xl border ${bg} ${border} bg-surface-900 overflow-hidden`}
        >
          <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${bg} ${border} border`}>
            <Icon size={20} className={iconColor} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-surface-500 uppercase tracking-wide truncate">{label}</p>
            <p className={`text-2xl font-bold leading-tight ${valueColor}`} aria-label={`${label}: ${stats[key]}`}>
              {stats[key]}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
