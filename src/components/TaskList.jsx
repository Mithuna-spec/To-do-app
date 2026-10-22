import TaskItem from './TaskItem.jsx'
import { Plus, SearchX, CheckCircle2, Clock, CalendarX2, Inbox } from 'lucide-react'

function EmptyState({ icon: Icon, title, message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 mb-4">
        <Icon size={28} className="text-surface-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-surface-300 mb-1">{title}</h3>
      <p className="text-sm text-surface-500 max-w-xs leading-relaxed">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/60"
        >
          <Plus size={15} aria-hidden="true" />
          {action}
        </button>
      )}
    </div>
  )
}

/**
 * Task list with empty states.
 * Props:
 *   tasks: Task[]
 *   hasSearch: boolean
 *   hasFilters: boolean
 *   view: string
 *   onToggle, onEdit, onDelete: functions
 *   onAddTask: () => void
 */
export default function TaskList({ tasks, hasSearch, hasFilters, view, onToggle, onEdit, onDelete, onAddTask }) {
  if (tasks.length === 0) {
    if (hasSearch || hasFilters) {
      return (
        <EmptyState
          icon={SearchX}
          title="No matching tasks"
          message="No tasks match your current search or filter. Try adjusting your filters or searching for something else."
        />
      )
    }

    if (view === 'completed') {
      return (
        <EmptyState
          icon={CheckCircle2}
          title="No completed tasks"
          message="You haven't completed any tasks yet. Start checking off your to-dos!"
        />
      )
    }

    if (view === 'today') {
      return (
        <EmptyState
          icon={Clock}
          title="Nothing due today"
          message="No tasks are scheduled for today. Add a task and set today as the due date to see it here."
          action="Add task for today"
          onAction={onAddTask}
        />
      )
    }

    if (view === 'upcoming') {
      return (
        <EmptyState
          icon={CalendarX2}
          title="No upcoming tasks"
          message="No upcoming tasks with future due dates. Schedule some tasks to stay on track."
          action="Schedule a task"
          onAction={onAddTask}
        />
      )
    }

    return (
      <EmptyState
        icon={Inbox}
        title="No tasks yet"
        message="You're all clear! Add your first task to start organizing your work and tracking your productivity."
        action="Create your first task"
        onAction={onAddTask}
      />
    )
  }

  return (
    <ul className="space-y-2.5" role="list" aria-label="Task list">
      {tasks.map(task => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  )
}
