import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 s global timeout
})

// ── Request interceptor ────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor ───────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403) {
      // Access denied — caller handles the UI feedback
      return Promise.reject(
        new Error(error.response?.data?.message || 'Access denied.')
      )
    }

    if (status >= 500) {
      return Promise.reject(
        new Error('A server error occurred. Please try again later.')
      )
    }

    return Promise.reject(error)
  }
)

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
}

export const inventoryService = {
  getAll: (params) => api.get('/inventory', { params }),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
}

export const forecastService = {
  getDemandForecast: (params) => api.get('/forecast/demand', { params }),
  getSalesForecast: (params) => api.get('/forecast/sales', { params }),
  getRecommendations: () => api.get('/forecast/recommendations'),
}

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getSalesReport: (params) => api.get('/analytics/sales', { params }),
  getInventoryReport: (params) => api.get('/analytics/inventory', { params }),
}

export const supplierService = {
  getAll: (params) => api.get('/suppliers', { params }),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
  getProducts: (id) => api.get(`/suppliers/${id}/products`),
  getPerformance: (id) => api.get(`/suppliers/${id}/performance`),
  search: (query) => api.get('/suppliers/search', { params: { q: query } }),
}

export const purchaseOrderService = {
  getAll: (params) => api.get('/purchase-orders', { params }),
  getById: (id) => api.get(`/purchase-orders/${id}`),
  create: (data) => api.post('/purchase-orders', data),
  update: (id, data) => api.put(`/purchase-orders/${id}`, data),
  delete: (id) => api.delete(`/purchase-orders/${id}`),
  updateStatus: (id, status) => api.patch(`/purchase-orders/${id}/status`, { status }),
  getBySupplier: (supplierId) => api.get(`/purchase-orders/supplier/${supplierId}`),
  getHistory: (params) => api.get('/purchase-orders/history', { params }),
  getStatistics: () => api.get('/purchase-orders/statistics'),
}

export const notificationService = {
  getAll: (params) => api.get('/notifications', { params }),
  getById: (id) => api.get(`/notifications/${id}`),
  getUnread: () => api.get('/notifications/unread'),
  getByCategory: (category) => api.get(`/notifications/category/${category}`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  deleteAll: () => api.delete('/notifications/all'),
  getAlerts: () => api.get('/notifications/alerts'),
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (data) => api.put('/notifications/settings', data),
}

export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
}

export const settingsService = {
  getAll: () => api.get('/settings'),
  getBySection: (section) => api.get(`/settings/${section}`),
  update: (section, data) => api.put(`/settings/${section}`, data),
}

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updatePermissions: (id, permissions) => api.patch(`/users/${id}/permissions`, { permissions }),
}

export const reportsService = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getInventoryReport: (params) => api.get('/reports/inventory', { params }),
  getForecastReport: (params) => api.get('/reports/forecast', { params }),
  exportCSV: (reportType, params) =>
    api.get(`/reports/${reportType}/export/csv`, { params, responseType: 'blob' }),
  exportPDF: (reportType, params) =>
    api.get(`/reports/${reportType}/export/pdf`, { params, responseType: 'blob' }),
}

// ── Health check ───────────────────────────────────────────────────────────────
export const healthService = {
  ping: () => api.get('/health', { timeout: 5000 }),
}

export default api
