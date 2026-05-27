import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import ToastContainer from '../components/notifications/ToastContainer'
import { 
  generateNotificationId,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  detectInventoryAlerts,
  detectDemandSpikes,
  detectSupplierAlerts,
  detectOrderAlerts
} from '../utils/notificationUtils'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [toasts, setToasts] = useState([])

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications))
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  // Add notification
  const addNotification = useCallback((notificationData) => {
    const notification = typeof notificationData === 'string'
      ? createNotification({ message: notificationData })
      : createNotification(notificationData)
    
    setNotifications(prev => [notification, ...prev])
    return notification
  }, [])

  // Show toast
  const showToast = useCallback((toastData) => {
    const toast = {
      id: generateNotificationId(),
      type: toastData.type || 'info',
      title: toastData.title,
      message: toastData.message,
      duration: toastData.duration !== undefined ? toastData.duration : 5000
    }
    
    setToasts(prev => [...prev, toast])
    return toast
  }, [])

  // Remove toast
  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId))
  }, [])

  // Show success toast
  const showSuccess = useCallback((message, title = 'Success') => {
    return showToast({ type: 'success', title, message })
  }, [showToast])

  // Show error toast
  const showError = useCallback((message, title = 'Error') => {
    return showToast({ type: 'error', title, message })
  }, [showToast])

  // Show warning toast
  const showWarning = useCallback((message, title = 'Warning') => {
    return showToast({ type: 'warning', title, message })
  }, [showToast])

  // Show info toast
  const showInfo = useCallback((message, title = 'Info') => {
    return showToast({ type: 'info', title, message })
  }, [showToast])

  // Mark notification as read
  const markNotificationRead = useCallback((notificationId) => {
    setNotifications(prev => markAsRead(prev, notificationId))
  }, [])

  // Mark all as read
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => markAllAsRead(prev))
  }, [])

  // Delete notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => deleteNotification(prev, notificationId))
  }, [])

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications(clearAllNotifications())
  }, [])

  // Detect and add alerts from data
  const detectAlerts = useCallback((data) => {
    const alerts = []

    if (data.inventory) {
      alerts.push(...detectInventoryAlerts(data.inventory))
    }
    if (data.forecast) {
      alerts.push(...detectDemandSpikes(data.forecast))
    }
    if (data.suppliers) {
      alerts.push(...detectSupplierAlerts(data.suppliers))
    }
    if (data.orders) {
      alerts.push(...detectOrderAlerts(data.orders))
    }

    if (alerts.length > 0) {
      setNotifications(prev => [...alerts, ...prev])
    }

    return alerts
  }, [])

  const value = {
    notifications,
    toasts,
    addNotification,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
    detectAlerts
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </NotificationContext.Provider>
  )
}

export default NotificationContext
