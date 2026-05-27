import { useState, useEffect } from 'react'
import { Bell, Filter, Search, Trash2, Check, RefreshCw, Package, TrendingUp, Truck, BarChart3, ShoppingCart, Settings } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import AlertCard from '../../components/notifications/AlertCard'
import { 
  filterNotifications, 
  sortNotifications, 
  groupNotificationsByCategory,
  getUnreadCount,
  getUnreadCountByCategory,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_TYPES,
  ALERT_PRIORITIES,
  getCategoryConfig
} from '../../utils/notificationUtils'

const Notifications = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    removeNotification,
    clearNotifications,
    showSuccess
  } = useNotifications()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterUnread, setFilterUnread] = useState(false)
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [viewMode, setViewMode] = useState('all') // all or grouped
  const [showFilters, setShowFilters] = useState(false)

  const unreadCount = getUnreadCount(notifications)

  // Apply filters and sorting
  const filteredNotifications = sortNotifications(
    filterNotifications(notifications, {
      category: filterCategory,
      type: filterType,
      priority: filterPriority,
      unreadOnly: filterUnread,
      searchTerm
    }),
    sortBy,
    sortOrder
  )

  // Group notifications by category
  const groupedNotifications = groupNotificationsByCategory(filteredNotifications)

  const handleDismiss = (notificationId) => {
    removeNotification(notificationId)
    showSuccess('Notification dismissed')
  }

  const handleMarkAllRead = () => {
    markAllNotificationsRead()
    showSuccess('All notifications marked as read')
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearNotifications()
      showSuccess('All notifications cleared')
    }
  }

  const categories = [
    { value: 'all', label: 'All', icon: Bell },
    { value: NOTIFICATION_CATEGORIES.INVENTORY, label: 'Inventory', icon: Package },
    { value: NOTIFICATION_CATEGORIES.SALES, label: 'Sales', icon: TrendingUp },
    { value: NOTIFICATION_CATEGORIES.SUPPLIER, label: 'Supplier', icon: Truck },
    { value: NOTIFICATION_CATEGORIES.FORECAST, label: 'Forecast', icon: BarChart3 },
    { value: NOTIFICATION_CATEGORIES.ORDER, label: 'Order', icon: ShoppingCart }
  ]

  const categoryIcons = {
    [NOTIFICATION_CATEGORIES.INVENTORY]: Package,
    [NOTIFICATION_CATEGORIES.SALES]: TrendingUp,
    [NOTIFICATION_CATEGORIES.SUPPLIER]: Truck,
    [NOTIFICATION_CATEGORIES.FORECAST]: BarChart3,
    [NOTIFICATION_CATEGORIES.ORDER]: ShoppingCart,
    system: Settings
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? (
              <span className="font-semibold text-primary">{unreadCount} unread</span>
            ) : (
              'You\'re all caught up!'
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Check size={18} />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 size={18} />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="card">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map(category => {
            const categoryCount = category.value === 'all' 
              ? unreadCount 
              : getUnreadCountByCategory(notifications, category.value)
            const IconComponent = category.icon
            
            return (
              <button
                key={category.value}
                onClick={() => setFilterCategory(category.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  filterCategory === category.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent size={18} />
                <span>{category.label}</span>
                {categoryCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filterCategory === category.value
                      ? 'bg-white text-primary'
                      : 'bg-red-600 text-white'
                  }`}>
                    {categoryCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
              showFilters ? 'bg-gray-50 border-primary' : 'border-gray-300'
            }`}
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-2 border rounded-lg font-medium ${
                viewMode === 'all' ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2 border rounded-lg font-medium ${
                viewMode === 'grouped' ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Grouped
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value={NOTIFICATION_TYPES.INFO}>Info</option>
                <option value={NOTIFICATION_TYPES.SUCCESS}>Success</option>
                <option value={NOTIFICATION_TYPES.WARNING}>Warning</option>
                <option value={NOTIFICATION_TYPES.ERROR}>Error</option>
                <option value={NOTIFICATION_TYPES.ALERT}>Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value={ALERT_PRIORITIES.CRITICAL}>Critical</option>
                <option value={ALERT_PRIORITIES.HIGH}>High</option>
                <option value={ALERT_PRIORITIES.MEDIUM}>Medium</option>
                <option value={ALERT_PRIORITIES.LOW}>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="priority">Priority</option>
                <option value="category">Category</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterUnread}
                  onChange={(e) => setFilterUnread(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Show unread only</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredNotifications.length}</span> of <span className="font-semibold">{notifications.length}</span> notifications
        </p>
      </div>

      {/* Notifications Display */}
      {filteredNotifications.length === 0 ? (
        <div className="card">
          <div className="py-12 text-center">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {notifications.length === 0 
                ? "You don't have any notifications yet"
                : "No notifications match your filters"}
            </p>
          </div>
        </div>
      ) : viewMode === 'all' ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <AlertCard
              key={notification.id}
              notification={notification}
              onDismiss={handleDismiss}
              onAction={() => markNotificationRead(notification.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([category, notifs]) => {
            const categoryConfig = getCategoryConfig(category)
            const CategoryIcon = categoryIcons[category] || Settings
            
            return (
              <div key={category} className="card">
                <div className="flex items-center space-x-2 mb-4 pb-3 border-b">
                  <CategoryIcon size={20} className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {categoryConfig.label}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    {notifs.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {notifs.map((notification) => (
                    <AlertCard
                      key={notification.id}
                      notification={notification}
                      onDismiss={handleDismiss}
                      onAction={() => markNotificationRead(notification.id)}
                      showCategory={false}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Notifications
