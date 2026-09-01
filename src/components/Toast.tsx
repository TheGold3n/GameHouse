import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import type { ToastMessage } from '../types'

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: number) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? TriangleAlert : Info
  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <Icon size={18} />
      <span>{toast.message}</span>
      <button className="icon-button toast-close" aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}><X size={16} /></button>
    </div>
  )
}
