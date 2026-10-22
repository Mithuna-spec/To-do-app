import { useRef, useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

/**
 * Accessible confirmation dialog for destructive actions.
 * Props:
 *   isOpen: boolean
 *   title: string
 *   message: string
 *   confirmLabel: string (default "Delete")
 *   onConfirm: () => void
 *   onCancel: () => void
 */
export default function ConfirmDialog({ isOpen, title = 'Confirm', message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => cancelRef.current?.focus(), 60)
      return () => clearTimeout(id)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl p-6 animate-[scaleIn_0.2s_ease-out]">
        <div className="flex items-start gap-4">
          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25">
            <AlertTriangle size={20} className="text-rose-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="confirm-title" className="text-base font-semibold text-surface-50">{title}</h2>
            <p id="confirm-desc" className="text-sm text-surface-400 mt-1 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-surface-700 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/60"
            aria-label="Cancel"
          >
            <X size={15} />
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium rounded-lg text-surface-300 hover:text-surface-100 hover:bg-surface-700 transition-all focus:outline-none focus:ring-2 focus:ring-surface-500/60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-all focus:outline-none focus:ring-2 focus:ring-rose-400/60"
          >
            <Trash2 size={14} aria-hidden="true" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
