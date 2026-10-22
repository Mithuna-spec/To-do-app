import { useEffect, useRef, useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { CATEGORIES, PRIORITIES } from '../utils/taskUtils.js'

const DEFAULT_FORM = {
  title: '',
  description: '',
  category: 'Personal',
  priority: 'Medium',
  dueDate: '',
}

const PRIORITY_COLORS = {
  High: 'text-rose-400',
  Medium: 'text-amber-400',
  Low: 'text-emerald-400',
}

/**
 * Task create/edit modal dialog.
 * Props:
 *   isOpen: boolean
 *   mode: 'create' | 'edit'
 *   initialValues: object | null  (for edit)
 *   onSubmit: (fields) => void
 *   onClose: () => void
 */
export default function TaskFormDialog({ isOpen, mode, initialValues, onSubmit, onClose }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const titleRef = useRef(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(mode === 'edit' && initialValues
        ? { ...DEFAULT_FORM, ...initialValues }
        : DEFAULT_FORM
      )
      setErrors({})
      setSubmitting(false)
    }
  }, [isOpen, mode, initialValues])

  // Auto-focus title field
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => titleRef.current?.focus(), 80)
      return () => clearTimeout(id)
    }
  }, [isOpen])

  // Trap focus inside dialog
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll(
          'input, textarea, select, button:not([disabled])'
        )
        if (!focusable?.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const newErrors = {}
    const trimmed = form.title.trim()
    if (!trimmed) newErrors.title = 'Task title is required.'
    else if (trimmed.length > 200) newErrors.title = 'Title must be 200 characters or fewer.'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      titleRef.current?.focus()
      return
    }
    setSubmitting(true)
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() })
  }

  function handleTitleKeyDown(e) {
    // Allow Enter to submit only from the title field (not description)
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const isEdit = mode === 'edit'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-lg bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl animate-[scaleIn_0.2s_ease-out]"
      >
        {/* Dialog header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-700/60">
          <h2 id="dialog-title" className="text-lg font-semibold text-surface-50">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/60"
            aria-label="Close dialog"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-surface-200 mb-1.5">
              Title <span className="text-rose-400" aria-hidden="true">*</span>
            </label>
            <input
              ref={titleRef}
              id="task-title"
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="What do you need to do?"
              required
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
              maxLength={200}
              className={`
                w-full px-3.5 py-2.5 text-sm rounded-lg
                bg-surface-800 border text-surface-100 placeholder:text-surface-500
                focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all
                ${errors.title ? 'border-rose-500' : 'border-surface-700'}
              `}
            />
            {errors.title && (
              <p id="title-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                <AlertCircle size={13} aria-hidden="true" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-sm font-medium text-surface-200 mb-1.5">
              Description <span className="text-surface-500 font-normal">(optional)</span>
            </label>
            <textarea
              id="task-desc"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Add details or notes…"
              rows={3}
              className="
                w-full px-3.5 py-2.5 text-sm rounded-lg resize-none
                bg-surface-800 border border-surface-700 text-surface-100 placeholder:text-surface-500
                focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all
              "
            />
          </div>

          {/* Category + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="task-category" className="block text-sm font-medium text-surface-200 mb-1.5">Category</label>
              <select
                id="task-category"
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="
                  w-full px-3 py-2.5 text-sm rounded-lg
                  bg-surface-800 border border-surface-700 text-surface-100
                  focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all
                "
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-surface-200 mb-1.5">Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                className={`
                  w-full px-3 py-2.5 text-sm rounded-lg font-medium
                  bg-surface-800 border border-surface-700
                  focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all
                  ${PRIORITY_COLORS[form.priority]}
                `}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label htmlFor="task-due" className="block text-sm font-medium text-surface-200 mb-1.5">
              Due Date <span className="text-surface-500 font-normal">(optional)</span>
            </label>
            <input
              id="task-due"
              type="date"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
              className="
                w-full px-3.5 py-2.5 text-sm rounded-lg
                bg-surface-800 border border-surface-700 text-surface-100
                focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent transition-all
                [color-scheme:dark]
              "
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-surface-300 hover:text-surface-100 hover:bg-surface-700 transition-all focus:outline-none focus:ring-2 focus:ring-surface-500/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="
                px-5 py-2.5 text-sm font-semibold rounded-lg
                bg-violet-600 hover:bg-violet-500 active:bg-violet-700
                text-white shadow-lg shadow-violet-500/25
                transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-violet-400/60
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
