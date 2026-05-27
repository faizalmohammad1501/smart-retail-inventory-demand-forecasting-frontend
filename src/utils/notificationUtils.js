/**
 * Notification and Alert Utility Functions
 * Provides helper functions for managing notifications and alerts
 */

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  ALERT: 'alert'
}

/**
 * Notification categories
 */
export const NOTIFICATION_CATEGORIES = {
  INVENTORY: 'inventory',
  SALES: 'sales',
  SUPPLIER: 'supplier',
  FORECAST: 'forecast',
  ORDER: 'order',
  SYSTEM: 'system'
}

/**
 * Alert priorities
 */
export const ALERT_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Get notification type configuration
 */
export const getNotificationConfig = (type) => {
  const configs = {
    info: {
      color: 'blue',
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      textClass: 'text-blue-800',
      iconClass: 'text-blue-600',
      icon: 'Info'
    },
    success: {
      color: 'green',
      bgClass: 'bg-green-50',
      borderClass: 'border-green-200',
      textClass: 'text-green-800',
      iconClass: 'text-green-600',
      icon: 'CheckCircle'
    },
    warning: {
      color: 'yellow',
      bgClass: 'bg-yellow-50',
      borderClass: 'border-yellow-200',
      textClass: 'text-yellow-800',
      iconClass: 'text-yellow-600',
      icon: 'AlertTriangle'
    },
    error: {
      color: 'red',
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      textClass: 'text-red-800',
      iconClass: 'text-red-600',
      icon: 'XCircle'
    },
    alert: {
      color: 'orange',
      bgClass: 'bg-orange-50',
      borderClass: 'border-orange-200',
      textClass: 'text-orange-800',
      iconClass: 'text-orange-600',
      icon: 'Bell'
    }
  }
  return configs[type] || configs.info
}

/**
 * Get priority configuration
 */
export const getPriorityConfig = (priority) => {
  const configs = {
    low: {
      label: 'Low',
      class: 'bg-gray-100 text-gray-800',
      dotClass: 'bg-gray-500'
    },
    medium: {
      label: 'Medium',
      class: 'bg-blue-100 text-blue-800',
      dotClass: 'bg-blue-500'
    },
    high: {
      label: 'High',
      class: 'bg-orange-100 text-orange-800',
      dotClass: 'bg-orange-500'
    },
    critical: {
      label: 'Critical',
      class: 'bg-red-100 text-red-800',
      dotClass: 'bg-red-500'
    }
  }
  return configs[priority] || configs.low
}

/**
 * Get category icon and color
 */
export const getCategoryConfig = (category) => {
  const configs = {
    inventory: {
      icon: 'Package',
      color: 'blue',
      label: 'Inventory'
    },
    sales: {
      icon: 'TrendingUp',
      color: 'green',
      label: 'Sales'
    },
    supplier: {
      icon: 'Truck',
      color: 'purple',
      label: 'Supplier'
    },
    forecast: {
      icon: 'BarChart3',
      color: 'indigo',
      label: 'Forecast'
    },
    order: {
      icon: 'ShoppingCart',
      color: 'orange',
      label: 'Order'
    },
    system: {
      icon: 'Settings',
      color: 'gray',
      label: 'System'
    }
  }
  return configs[category] || configs.system
}

/**
 * Filter notifications by criteria
 */
export const filterNotifications = (notifications, filters = {}) => {
  let filtered = [...notifications]

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(n => n.category === filters.category)
  }

  // Filter by type
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(n => n.type === filters.type)
  }

  // Filter by priority
  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter(n => n.priority === filters.priority)
  }

  // Filter by read status
  if (filters.unreadOnly) {
    filtered = filtered.filter(n => !n.read)
  }

  // Search filter
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(term) ||
      n.message.toLowerCase().includes(term)
    )
  }

  return filtered
}

/**
 * Sort notifications
 */
export const sortNotifications = (notifications, sortBy = 'date', order = 'desc') => {
  const sorted = [...notifications]
  
  sorted.sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.timestamp)
        bValue = new Date(b.timestamp)
        break
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority] || 0
        bValue = priorityOrder[b.priority] || 0
        break
      case 'category':
        aValue = a.category
        bValue = b.category
        break
      default:
        return 0
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Group notifications by category
 */
export const groupNotificationsByCategory = (notifications) => {
  return notifications.reduce((groups, notification) => {
    const category = notification.category || 'system'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(notification)
    return groups
  }, {})
}

/**
 * Get unread count
 */
export const getUnreadCount = (notifications) => {
  return notifications.filter(n => !n.read).length
}

/**
 * Get unread count by category
 */
export const getUnreadCountByCategory = (notifications, category) => {
  return notifications.filter(n => !n.read && n.category === category).length
}

/**
 * Format time ago
 */
export const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const then = new Date(timestamp)
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Format timestamp
 */
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Generate notification ID
 */
export const generateNotificationId = () => {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create notification object
 */
export const createNotification = ({
  title,
  message,
  type = NOTIFICATION_TYPES.INFO,
  category = NOTIFICATION_CATEGORIES.SYSTEM,
  priority = ALERT_PRIORITIES.LOW,
  actionLabel = null,
  actionUrl = null,
  metadata = {}
}) => {
  return {
    id: generateNotificationId(),
    title,
    message,
    type,
    category,
    priority,
    actionLabel,
    actionUrl,
    metadata,
    timestamp: new Date().toISOString(),
    read: false
  }
}

/**
 * Detect alert conditions from inventory data
 */
export const detectInventoryAlerts = (products) => {
  const alerts = []

  products.forEach(product => {
    // Out of stock
    if (product.quantity === 0 || product.stock === 0) {
      alerts.push(createNotification({
        title: 'Out of Stock',
        message: `${product.name} is out of stock`,
        type: NOTIFICATION_TYPES.ERROR,
        category: NOTIFICATION_CATEGORIES.INVENTORY,
        priority: ALERT_PRIORITIES.CRITICAL,
        actionLabel: 'Reorder Now',
        actionUrl: `/inventory?product=${product.id}`,
        metadata: { productId: product.id, productName: product.name }
      }))
    }
    // Low stock
    else if (product.quantity <= (product.reorderLevel || 20)) {
      alerts.push(createNotification({
        title: 'Low Stock Alert',
        message: `${product.name} is running low (${product.quantity} units left)`,
        type: NOTIFICATION_TYPES.WARNING,
        category: NOTIFICATION_CATEGORIES.INVENTORY,
        priority: ALERT_PRIORITIES.HIGH,
        actionLabel: 'View Details',
        actionUrl: `/inventory?product=${product.id}`,
        metadata: { productId: product.id, productName: product.name, quantity: product.quantity }
      }))
    }
  })

  return alerts
}

/**
 * Detect demand spike alerts
 */
export const detectDemandSpikes = (forecastData) => {
  const alerts = []
  
  if (forecastData && forecastData.length > 0) {
    forecastData.forEach(item => {
      if (item.change && item.change > 50) {
        alerts.push(createNotification({
          title: 'Demand Spike Detected',
          message: `${item.product || item.name} demand increased by ${item.change}%`,
          type: NOTIFICATION_TYPES.ALERT,
          category: NOTIFICATION_CATEGORIES.FORECAST,
          priority: ALERT_PRIORITIES.HIGH,
          actionLabel: 'View Forecast',
          actionUrl: '/forecast',
          metadata: { product: item.product || item.name, change: item.change }
        }))
      }
    })
  }

  return alerts
}

/**
 * Detect supplier alerts
 */
export const detectSupplierAlerts = (suppliers) => {
  const alerts = []

  suppliers.forEach(supplier => {
    // Low rating alert
    if (supplier.rating < 3.5) {
      alerts.push(createNotification({
        title: 'Supplier Performance Issue',
        message: `${supplier.name} has a low rating of ${supplier.rating}/5.0`,
        type: NOTIFICATION_TYPES.WARNING,
        category: NOTIFICATION_CATEGORIES.SUPPLIER,
        priority: ALERT_PRIORITIES.MEDIUM,
        actionLabel: 'Review Supplier',
        actionUrl: `/suppliers?id=${supplier.id}`,
        metadata: { supplierId: supplier.id, supplierName: supplier.name, rating: supplier.rating }
      }))
    }

    // Low on-time delivery
    if (supplier.onTimeDelivery && supplier.onTimeDelivery < 85) {
      alerts.push(createNotification({
        title: 'Delivery Performance Alert',
        message: `${supplier.name} has ${supplier.onTimeDelivery}% on-time delivery`,
        type: NOTIFICATION_TYPES.WARNING,
        category: NOTIFICATION_CATEGORIES.SUPPLIER,
        priority: ALERT_PRIORITIES.MEDIUM,
        actionLabel: 'View Supplier',
        actionUrl: `/suppliers?id=${supplier.id}`,
        metadata: { supplierId: supplier.id, supplierName: supplier.name, onTimeDelivery: supplier.onTimeDelivery }
      }))
    }
  })

  return alerts
}

/**
 * Detect order alerts
 */
export const detectOrderAlerts = (orders) => {
  const alerts = []
  const now = new Date()

  orders.forEach(order => {
    const deliveryDate = new Date(order.expectedDelivery)
    const daysUntilDelivery = Math.ceil((deliveryDate - now) / (1000 * 60 * 60 * 24))

    // Overdue delivery
    if (order.status !== 'delivered' && daysUntilDelivery < 0) {
      alerts.push(createNotification({
        title: 'Order Overdue',
        message: `Order ${order.orderNumber} is overdue by ${Math.abs(daysUntilDelivery)} days`,
        type: NOTIFICATION_TYPES.ERROR,
        category: NOTIFICATION_CATEGORIES.ORDER,
        priority: ALERT_PRIORITIES.HIGH,
        actionLabel: 'View Order',
        actionUrl: `/orders?id=${order.id}`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber, daysOverdue: Math.abs(daysUntilDelivery) }
      }))
    }
    // Delivery soon
    else if (order.status === 'shipped' && daysUntilDelivery <= 2 && daysUntilDelivery >= 0) {
      alerts.push(createNotification({
        title: 'Order Arriving Soon',
        message: `Order ${order.orderNumber} will arrive in ${daysUntilDelivery} day${daysUntilDelivery !== 1 ? 's' : ''}`,
        type: NOTIFICATION_TYPES.INFO,
        category: NOTIFICATION_CATEGORIES.ORDER,
        priority: ALERT_PRIORITIES.LOW,
        actionLabel: 'Track Order',
        actionUrl: `/orders?id=${order.id}`,
        metadata: { orderId: order.id, orderNumber: order.orderNumber, daysUntilDelivery }
      }))
    }
  })

  return alerts
}

/**
 * Mark notification as read
 */
export const markAsRead = (notifications, notificationId) => {
  return notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  )
}

/**
 * Mark all as read
 */
export const markAllAsRead = (notifications) => {
  return notifications.map(n => ({ ...n, read: true }))
}

/**
 * Delete notification
 */
export const deleteNotification = (notifications, notificationId) => {
  return notifications.filter(n => n.id !== notificationId)
}

/**
 * Clear all notifications
 */
export const clearAllNotifications = () => {
  return []
}
