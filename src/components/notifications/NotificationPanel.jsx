import { useState, useRef, useEffect } from 'react'
import { Bell, Check, Trash2, Settings, Filter } from 'lucide-react'
import NotificationBadge from './NotificationBadge'
import NotificationItem from './NotificationItem'
import { getUnreadCount, NOTIFICATION_CATEGORIES } from '../../utils/notificationUtils'

const NotificationPanel = ({ 
  notifications = [], 
  onRead, 
  onReadAll, 
  onDelete,
  onClearAll,
  onNotificationClick,
  maxHeight = '500px'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState('all')
  const panelRef = useRef(null)

  const unreadCount = getUnreadCount(notifications)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const filteredNotifications = filterCategory === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filterCategory)

  const categories = [
    { value: 'all', label: 'All' },
    { value: NOTIFICATION_CATEGORIES.INVENTORY, label: 'Inventory' },
    { value: NOTIFICATION_CATEGORIES.SALES, label: 'Sales' },
    { value: NOTIFICATION_CATEGORIES.SUPPLIER, label: 'Supplier' },
    { value: NOTIFICATION_CATEGORIES.FORECAST, label: 'Forecast' },
    { value: NOTIFICATION_CATEGORIES.ORDER, label: 'Order' }
  ]

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell size={22} />
        <NotificationBadge count={unreadCount} size="sm" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onReadAll}
                    className="text-sm text-primary hover:text-blue-700 font-medium flex items-center space-x-1"
                    title="Mark all as read"
                  >
                    <Check size={14} />
                    <span>Mark all read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                    title="Clear all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setFilterCategory(category.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    filterCategory === category.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                  {category.value === 'all' && unreadCount > 0 && ` (${unreadCount})`}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div 
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium mb-1">No notifications</p>
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={onRead}
                  onDelete={onDelete}
                  onClick={onNotificationClick}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <a
                href="/notifications"
                className="text-sm text-primary hover:text-blue-700 font-medium"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationPanel
