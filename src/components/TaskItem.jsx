import { useState } from 'react'
import { Pencil, Trash2, Calendar, Flag, Tag, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import { isOverdue, isDueToday, todayString } from '../utils/taskUtils.js'

const PRIORITY_STYLES = {
  High:   { badge: 'bg-rose-500/15 text-rose-300 border-rose-500/25',   dot: 'bg-rose-400',     label: 'High priority' },
  Medium: { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/25', dot: 'bg-amber-400',   label: 'Medium priority' },
  Low:    { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', dot: 'bg-emerald-400', label: 'Low priority' },
}

const CATEGORY_STYLES = {
  Study:    'bg-sky-500/15 text-sky-300 border-sky-500/25',
  Coding:   'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  Personal: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  Other:    'bg-rose-500/15 text-rose-300 border-rose-500/25',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  // Parse as local date to avoid UTC shift
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Individual task card.
 * Props:
 *   task: object
 *   onToggle: (id) => void
 *   onEdit: (task) => void
 *   onDelete: (id) => void
 */
export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)

  const overdue = isOverdue(task)
  const dueToday = isDueToday(task)

  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium
  const categoryStyle = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Other

  let dueDateColor = 'text-surface-500'
  let dueDateLabel = ''
  if (dueToday && !task.completed) {
    dueDateColor = 'text-amber-400'
    dueDateLabel = ' (Today)'
  } else if (overdue) {
    dueDateColor = 'text-rose-400'
    dueDateLabel = ' (Overdue)'
  }

  return (
    <article
      className={`
        group relative flex gap-3 px-4 py-4 rounded-xl border transition-all duration-200
        ${task.completed
          ? 'bg-surface-800/40 border-surface-700/40 opacity-70'
          : overdue
            ? 'bg-surface-900 border-rose-500/30 hover:border-rose-500/50'
            : 'bg-surface-900 border-surface-700/60 hover:border-violet-500/40 hover:bg-surface-850'
        }
      `}
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority indicator stripe */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${priorityStyle.dot} ${task.completed ? 'opacity-30' : 'opacity-70'}`}
        aria-hidden="true"
      />

      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`
          shrink-0 mt-0.5 transition-all duration-150 rounded-full
          focus:outline-none focus:ring-2 focus:ring-violet-500/60
          ${task.completed ? 'text-violet-400' : 'text-surface-600 hover:text-violet-400'}
        `}
        aria-label={task.completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as complete`}
        aria-pressed={task.completed}
      >
        {task.completed
          ? <CheckCircle2 size={20} />
          : <Circle size={20} />
        }
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-semibold leading-snug break-words ${
                task.completed ? 'line-through text-surface-500' : 'text-surface-100'
              }`}
            >
              {task.title}
            </p>

            {/* Description toggle */}
            {task.description && (
              <button
                onClick={() => setExpanded(e => !e)}
                className="flex items-center gap-1 mt-0.5 text-xs text-surface-500 hover:text-surface-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/40 rounded"
                aria-expanded={expanded}
                aria-label={expanded ? 'Collapse description' : 'Expand description'}
              >
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {expanded ? 'Less' : 'More'}
              </button>
            )}

            {/* Expanded description */}
            {expanded && task.description && (
              <p className="mt-2 text-xs text-surface-400 leading-relaxed whitespace-pre-wrap break-words">
                {task.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onEdit(task)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-surface-500 hover:text-violet-300 hover:bg-violet-500/15 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/60"
              aria-label={`Edit task: ${task.title}`}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-surface-500 hover:text-rose-300 hover:bg-rose-500/15 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/60"
              aria-label={`Delete task: ${task.title}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          {/* Category */}
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border font-medium ${categoryStyle}`}>
            <Tag size={10} aria-hidden="true" />
            {task.category}
          </span>

          {/* Priority */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-md border font-medium ${priorityStyle.badge}`}
            aria-label={priorityStyle.label}
          >
            <Flag size={10} aria-hidden="true" />
            {task.priority}
          </span>

          {/* Due date */}
          {task.dueDate && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${dueDateColor}`} aria-label={`Due ${formatDate(task.dueDate)}${dueDateLabel}`}>
              <Calendar size={11} aria-hidden="true" />
              {formatDate(task.dueDate)}{dueDateLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
