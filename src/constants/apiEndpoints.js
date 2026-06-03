/**
 * API_ENDPOINTS
 *
 * Centralized catalog of every backend endpoint consumed by the frontend.
 * Import from here instead of hard-coding path strings in service files.
 *
 * Base URL is controlled by VITE_API_BASE_URL in .env / .env.production
 */

export const API_ENDPOINTS = {
  // ── Authentication ──────────────────────────────────────────────────────────
  AUTH: {
    LOGIN:    '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT:   '/auth/logout',
    ME:       '/auth/me',
  },

  // ── Inventory ────────────────────────────────────────────────────────────────
  INVENTORY: {
    LIST:   '/inventory',
    DETAIL: (id) => `/inventory/${id}`,
  },

  // ── Demand Forecasting ───────────────────────────────────────────────────────
  FORECAST: {
    DEMAND:          '/forecast/demand',
    SALES:           '/forecast/sales',
    RECOMMENDATIONS: '/forecast/recommendations',
  },

  // ── Analytics ────────────────────────────────────────────────────────────────
  ANALYTICS: {
    DASHBOARD:  '/analytics/dashboard',
    SALES:      '/analytics/sales',
    INVENTORY:  '/analytics/inventory',
  },

  // ── Suppliers ────────────────────────────────────────────────────────────────
  SUPPLIERS: {
    LIST:        '/suppliers',
    DETAIL:      (id) => `/suppliers/${id}`,
    PRODUCTS:    (id) => `/suppliers/${id}/products`,
    PERFORMANCE: (id) => `/suppliers/${id}/performance`,
    SEARCH:      '/suppliers/search',
  },

  // ── Purchase Orders ──────────────────────────────────────────────────────────
  PURCHASE_ORDERS: {
    LIST:       '/purchase-orders',
    DETAIL:     (id) => `/purchase-orders/${id}`,
    STATUS:     (id) => `/purchase-orders/${id}/status`,
    BY_SUPPLIER:(supplierId) => `/purchase-orders/supplier/${supplierId}`,
    HISTORY:    '/purchase-orders/history',
    STATISTICS: '/purchase-orders/statistics',
  },

  // ── Notifications ─────────────────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST:         '/notifications',
    DETAIL:       (id) => `/notifications/${id}`,
    UNREAD:       '/notifications/unread',
    BY_CATEGORY:  (cat) => `/notifications/category/${cat}`,
    MARK_READ:    (id) => `/notifications/${id}/read`,
    MARK_ALL:     '/notifications/read-all',
    DELETE_ALL:   '/notifications/all',
    ALERTS:       '/notifications/alerts',
    SETTINGS:     '/notifications/settings',
  },

  // ── Profile ───────────────────────────────────────────────────────────────────
  PROFILE: {
    GET:      '/profile',
    UPDATE:   '/profile',
    PASSWORD: '/profile/password',
  },

  // ── Settings ─────────────────────────────────────────────────────────────────
  SETTINGS: {
    ALL:     '/settings',
    SECTION: (section) => `/settings/${section}`,
  },

  // ── Users ─────────────────────────────────────────────────────────────────────
  USERS: {
    LIST:        '/users',
    DETAIL:      (id) => `/users/${id}`,
    ROLE:        (id) => `/users/${id}/role`,
    PERMISSIONS: (id) => `/users/${id}/permissions`,
  },

  // ── Reports ───────────────────────────────────────────────────────────────────
  REPORTS: {
    SALES:     '/reports/sales',
    INVENTORY: '/reports/inventory',
    FORECAST:  '/reports/forecast',
    EXPORT_CSV:(type) => `/reports/${type}/export/csv`,
    EXPORT_PDF:(type) => `/reports/${type}/export/pdf`,
  },

  // ── Health ────────────────────────────────────────────────────────────────────
  HEALTH: '/health',
}

export default API_ENDPOINTS
