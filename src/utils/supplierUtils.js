/**
 * Supplier Management Utility Functions
 * Provides helper functions for supplier and purchase order management
 */

/**
 * Get supplier performance rating badge class
 */
export const getRatingClass = (rating) => {
  if (rating >= 4.5) return 'bg-green-100 text-green-800'
  if (rating >= 3.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

/**
 * Get supplier status
 */
export const getSupplierStatus = (supplier) => {
  if (!supplier.active) return { status: 'Inactive', class: 'bg-gray-100 text-gray-800' }
  if (supplier.rating >= 4.5) return { status: 'Excellent', class: 'bg-green-100 text-green-800' }
  if (supplier.rating >= 3.5) return { status: 'Good', class: 'bg-blue-100 text-blue-800' }
  return { status: 'Average', class: 'bg-yellow-100 text-yellow-800' }
}

/**
 * Get order status configuration
 */
export const getOrderStatus = (status) => {
  const statusConfig = {
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
    confirmed: { label: 'Confirmed', class: 'bg-blue-100 text-blue-800', icon: 'CheckCircle' },
    shipped: { label: 'Shipped', class: 'bg-purple-100 text-purple-800', icon: 'Truck' },
    delivered: { label: 'Delivered', class: 'bg-green-100 text-green-800', icon: 'Package' },
    cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-800', icon: 'XCircle' }
  }
  return statusConfig[status] || statusConfig.pending
}

/**
 * Filter suppliers by search term
 */
export const filterSuppliers = (suppliers, searchTerm, filters = {}) => {
  let filtered = [...suppliers]

  // Search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(supplier =>
      supplier.name.toLowerCase().includes(term) ||
      supplier.contact.toLowerCase().includes(term) ||
      supplier.email.toLowerCase().includes(term) ||
      supplier.location.toLowerCase().includes(term)
    )
  }

  // Rating filter
  if (filters.minRating) {
    filtered = filtered.filter(supplier => supplier.rating >= filters.minRating)
  }

  // Location filter
  if (filters.location) {
    filtered = filtered.filter(supplier => 
      supplier.location.toLowerCase().includes(filters.location.toLowerCase())
    )
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter(supplier => {
      if (filters.status === 'active') return supplier.active !== false
      if (filters.status === 'inactive') return supplier.active === false
      return true
    })
  }

  return filtered
}

/**
 * Sort suppliers by criteria
 */
export const sortSuppliers = (suppliers, sortBy, sortOrder = 'asc') => {
  const sorted = [...suppliers]
  
  sorted.sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'rating':
        aValue = a.rating || 0
        bValue = b.rating || 0
        break
      case 'products':
        aValue = a.products || 0
        bValue = b.products || 0
        break
      case 'deliveryTime':
        aValue = a.avgDeliveryTime || 0
        bValue = b.avgDeliveryTime || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Calculate order total
 */
export const calculateOrderTotal = (items) => {
  if (!items || items.length === 0) return 0
  return items.reduce((total, item) => {
    return total + (item.quantity * item.price)
  }, 0)
}

/**
 * Calculate expected delivery date
 */
export const calculateExpectedDelivery = (orderDate, deliveryDays = 7) => {
  const date = new Date(orderDate)
  date.setDate(date.getDate() + deliveryDays)
  return date.toISOString().split('T')[0]
}

/**
 * Filter purchase orders
 */
export const filterOrders = (orders, searchTerm, filters = {}) => {
  let filtered = [...orders]

  // Search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(term) ||
      order.supplier.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term)
    )
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(order => order.status === filters.status)
  }

  // Date range filter
  if (filters.startDate) {
    filtered = filtered.filter(order => new Date(order.orderDate) >= new Date(filters.startDate))
  }
  if (filters.endDate) {
    filtered = filtered.filter(order => new Date(order.orderDate) <= new Date(filters.endDate))
  }

  // Supplier filter
  if (filters.supplier) {
    filtered = filtered.filter(order => 
      order.supplier.toLowerCase().includes(filters.supplier.toLowerCase())
    )
  }

  return filtered
}

/**
 * Sort purchase orders
 */
export const sortOrders = (orders, sortBy, sortOrder = 'desc') => {
  const sorted = [...orders]
  
  sorted.sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.orderDate)
        bValue = new Date(b.orderDate)
        break
      case 'total':
        aValue = a.total || 0
        bValue = b.total || 0
        break
      case 'supplier':
        aValue = a.supplier.toLowerCase()
        bValue = b.supplier.toLowerCase()
        break
      case 'status':
        aValue = a.status.toLowerCase()
        bValue = b.status.toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Get top suppliers by criteria
 */
export const getTopSuppliers = (suppliers, criteria = 'rating', limit = 5) => {
  const sorted = [...suppliers].sort((a, b) => {
    if (criteria === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (criteria === 'products') return (b.products || 0) - (a.products || 0)
    if (criteria === 'orders') return (b.totalOrders || 0) - (a.totalOrders || 0)
    return 0
  })
  return sorted.slice(0, limit)
}

/**
 * Calculate supplier performance metrics
 */
export const calculateSupplierMetrics = (supplier, orders = []) => {
  const supplierOrders = orders.filter(order => order.supplierId === supplier.id)
  
  return {
    totalOrders: supplierOrders.length,
    totalSpent: supplierOrders.reduce((sum, order) => sum + (order.total || 0), 0),
    onTimeDeliveries: supplierOrders.filter(order => order.deliveredOnTime).length,
    avgOrderValue: supplierOrders.length > 0 
      ? supplierOrders.reduce((sum, order) => sum + (order.total || 0), 0) / supplierOrders.length 
      : 0,
    deliveryRate: supplierOrders.length > 0
      ? (supplierOrders.filter(order => order.deliveredOnTime).length / supplierOrders.length) * 100
      : 0
  }
}

/**
 * Validate supplier form data
 */
export const validateSupplierForm = (data) => {
  const errors = {}

  if (!data.name?.trim()) {
    errors.name = 'Supplier name is required'
  }

  if (!data.contact?.trim()) {
    errors.contact = 'Contact person is required'
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format'
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required'
  }

  if (!data.location?.trim()) {
    errors.location = 'Location is required'
  }

  return errors
}

/**
 * Validate purchase order form data
 */
export const validateOrderForm = (data) => {
  const errors = {}

  if (!data.supplier) {
    errors.supplier = 'Supplier is required'
  }

  if (!data.orderDate) {
    errors.orderDate = 'Order date is required'
  }

  if (!data.items || data.items.length === 0) {
    errors.items = 'At least one item is required'
  } else {
    data.items.forEach((item, index) => {
      if (!item.product) {
        errors[`items.${index}.product`] = 'Product is required'
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`items.${index}.quantity`] = 'Valid quantity is required'
      }
      if (!item.price || item.price <= 0) {
        errors[`items.${index}.price`] = 'Valid price is required'
      }
    })
  }

  return errors
}

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Generate order number
 */
export const generateOrderNumber = () => {
  const prefix = 'PO'
  const timestamp = Date.now().toString().slice(-8)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}
