import { useEffect } from 'react'
import { X, Info, CheckCircle, AlertTriangle, XCircle, Bell } from 'lucide-react'
import { getNotificationConfig } from '../../utils/notificationUtils'

const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose }) => {
  const config = getNotificationConfig(type)

  const icons = {
    Info,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Bell
  }

  const IconComponent = icons[config.icon] || Info

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg ${config.bgClass} ${config.borderClass} animate-slide-in`}
      role="alert"
    >
      <IconComponent className={`flex-shrink-0 ${config.iconClass}`} size={20} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold ${config.textClass} mb-1`}>
            {title}
          </h4>
        )}
        <p className={`text-sm ${config.textClass}`}>
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 ${config.iconClass} hover:opacity-75 transition-opacity`}
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast
