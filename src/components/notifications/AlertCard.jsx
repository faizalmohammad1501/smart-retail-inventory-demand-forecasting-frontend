import { Info, CheckCircle, AlertTriangle, XCircle, Bell, X, ArrowRight } from 'lucide-react'
import { getNotificationConfig, getPriorityConfig, getCategoryConfig } from '../../utils/notificationUtils'

const AlertCard = ({ 
  notification, 
  onDismiss, 
  onAction, 
  showDismiss = true,
  showCategory = true,
  showPriority = true,
  compact = false 
}) => {
  const config = getNotificationConfig(notification.type)
  const priorityConfig = getPriorityConfig(notification.priority)
  const categoryConfig = getCategoryConfig(notification.category)

  const icons = {
    Info,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Bell
  }

  const IconComponent = icons[config.icon] || Info

  const handleAction = () => {
    if (onAction) {
      onAction(notification)
    } else if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-3 p-3 rounded-lg border ${config.bgClass} ${config.borderClass}`}>
        <IconComponent className={`flex-shrink-0 ${config.iconClass}`} size={18} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textClass}`}>
            {notification.message}
          </p>
        </div>
        {showDismiss && onDismiss && (
          <button
            onClick={() => onDismiss(notification.id)}
            className={`flex-shrink-0 ${config.iconClass} hover:opacity-75`}
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border shadow-sm ${config.bgClass} ${config.borderClass}`}>
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 p-2 rounded-lg ${config.bgClass} border ${config.borderClass}`}>
          <IconComponent className={config.iconClass} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className={`font-semibold ${config.textClass}`}>
              {notification.title}
            </h4>
            {showDismiss && onDismiss && (
              <button
                onClick={() => onDismiss(notification.id)}
                className={`flex-shrink-0 ${config.iconClass} hover:opacity-75 transition-opacity`}
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <p className={`text-sm ${config.textClass} mb-3`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              {showCategory && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${categoryConfig.color}-100 text-${categoryConfig.color}-800`}>
                  {categoryConfig.label}
                </span>
              )}
              {showPriority && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.class}`}>
                  {priorityConfig.label}
                </span>
              )}
              <span className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {notification.actionLabel && (
              <button
                onClick={handleAction}
                className={`flex items-center space-x-1 text-sm font-medium ${config.textClass} hover:underline`}
              >
                <span>{notification.actionLabel}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertCard
