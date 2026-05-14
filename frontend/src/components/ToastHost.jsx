import React from 'react'
import { useToast } from '../context/ToastContext.jsx'

export default function ToastHost() {
  const { toasts, removeToast } = useToast()
  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`} role="status">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div>{toast.message}</div>
            <button type="button" className="btn-close btn-close-white ms-auto" aria-label="Close" onClick={() => removeToast(toast.id)} />
          </div>
        </div>
      ))}
    </div>
  )
}
