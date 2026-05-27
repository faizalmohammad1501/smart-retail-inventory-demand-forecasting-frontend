import { Info, CheckCircle, AlertTriangle, XCircle, Bell } from 'lucide-react'
import { getNotificationConfig, getPriorityConfig } from '../../utils/notificationUtils'

const NotificationItem = ({ notification, onRead, onDelete, onClick }) => {
  const config = getNotificationConfig(notification.type)
  const priorityConfig = getPriorityConfig(notification.priority)

  const icons = {
    Info,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Bell
  }

  const IconComponent = icons[config.icon] || Info

  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id)
    }
    if (onClick) {
      onClick(notification)
    }
  }

  return (
    <div
      className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.bgClass}`}>
          <IconComponent className={config.iconClass} size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm text-gray-900">
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {notification.message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(notification.timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.class}`}>
              {priorityConfig.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
