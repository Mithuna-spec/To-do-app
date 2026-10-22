import { useEffect, useRef } from 'react'
import { CheckCircle2, AlertTriangle, Info, Trash2, X } from 'lucide-react'

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  deleted: Trash2,
}

const STYLES = {
  success: 'bg-violet-600/90 border-violet-500/60 text-white',
  error:   'bg-red-600/90 border-red-500/60 text-white',
  info:    'bg-slate-700/90 border-slate-500/60 text-slate-100',
  deleted: 'bg-rose-600/90 border-rose-500/60 text-white',
}

/**
 * Toast notification component.
 * Props:
 *   toasts: Array<{ id, message, type }>
 *   onDismiss: (id) => void
 */
export default function Toast({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || ICONS.info
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timerRef.current)
  }, [toast.id, onDismiss])

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-xl
        animate-[slideInRight_0.3s_ease-out]
        ${STYLES[toast.type] || STYLES.info}`}
    >
      <Icon size={18} className="shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity rounded focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
