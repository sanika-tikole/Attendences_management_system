import React from 'react'

const ToastContext = React.createContext(null)
let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([])

  const pushToast = React.useCallback((message, type = 'info', timeout = 3000) => {
    const id = ++toastId
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, timeout)
  }, [])

  const removeToast = React.useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, pushToast, removeToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
