import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import '../POS.css'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const Icon = icons[type] || CheckCircle

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <Icon size={20} />
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast

