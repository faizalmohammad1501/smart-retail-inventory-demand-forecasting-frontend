// Inventory utility functions

export const getStockStatus = (quantity, reorderLevel = 50) => {
  if (quantity === 0) {
    return {
      status: 'Out of Stock',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      badgeColor: 'bg-red-500'
    }
  } else if (quantity <= reorderLevel) {
    return {
      status: 'Low Stock',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      badgeColor: 'bg-yellow-500'
    }
  } else {
    return {
      status: 'In Stock',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      badgeColor: 'bg-green-500'
    }
  }
}

export const calculateInventoryValue = (products) => {
  return products.reduce((total, product) => {
    return total + (product.price * product.quantity)
  }, 0)
}

export const getLowStockProducts = (products, threshold = 50) => {
  return products.filter(product => 
    product.quantity > 0 && product.quantity <= (product.reorderLevel || threshold)
  )
}

export const getOutOfStockProducts = (products) => {
  return products.filter(product => product.quantity === 0)
}

export const filterProducts = (products, filters) => {
  let filtered = [...products]

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    )
  }

  // Category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category)
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(product => {
      const status = getStockStatus(product.quantity, product.reorderLevel)
      return status.status === filters.status
    })
  }

  return filtered
}

export const sortProducts = (products, sortBy, sortOrder = 'asc') => {
  const sorted = [...products]

  sorted.sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]

    // Handle string comparisons
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1
    }
    return 0
  })

  return sorted
}

export const paginateProducts = (products, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return products.slice(startIndex, endIndex)
}

export const getTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage)
}

export const generateSKU = (category, existingSkus = []) => {
  const prefix = category.substring(0, 3).toUpperCase()
  let number = 1
  let sku = `${prefix}${String(number).padStart(4, '0')}`

  while (existingSkus.includes(sku)) {
    number++
    sku = `${prefix}${String(number).padStart(4, '0')}`
  }

  return sku
}

export const formatStockLevel = (quantity) => {
  if (quantity >= 1000) {
    return `${(quantity / 1000).toFixed(1)}K`
  }
  return quantity.toString()
}
