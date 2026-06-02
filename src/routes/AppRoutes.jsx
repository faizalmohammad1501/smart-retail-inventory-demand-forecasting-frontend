import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import { PageLoader } from '../components/ui'

// Auth Pages — keep eager-loaded (entry points)
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Dashboard Pages — lazy-loaded for code splitting
const Dashboard      = lazy(() => import('../pages/dashboard/Dashboard'))
const Inventory      = lazy(() => import('../pages/dashboard/Inventory'))
const Forecast       = lazy(() => import('../pages/dashboard/Forecast'))
const Reports        = lazy(() => import('../pages/dashboard/Reports'))
const Suppliers      = lazy(() => import('../pages/dashboard/Suppliers'))
const Orders         = lazy(() => import('../pages/dashboard/Orders'))
const Notifications  = lazy(() => import('../pages/dashboard/Notifications'))
const Profile        = lazy(() => import('../pages/dashboard/Profile'))
const Settings       = lazy(() => import('../pages/dashboard/Settings'))
const UserManagement = lazy(() => import('../pages/dashboard/UserManagement'))
const NotFound       = lazy(() => import('../pages/NotFound'))

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"     element={<Suspense fallback={<PageLoader message="Loading dashboard…" />}><Dashboard /></Suspense>} />
        <Route path="inventory"     element={<Suspense fallback={<PageLoader message="Loading inventory…" />}><Inventory /></Suspense>} />
        <Route path="forecast"      element={<Suspense fallback={<PageLoader message="Loading forecast…" />}><Forecast /></Suspense>} />
        <Route path="reports"       element={<Suspense fallback={<PageLoader message="Loading reports…" />}><Reports /></Suspense>} />
        <Route path="suppliers"     element={<Suspense fallback={<PageLoader message="Loading suppliers…" />}><Suppliers /></Suspense>} />
        <Route path="orders"        element={<Suspense fallback={<PageLoader message="Loading orders…" />}><Orders /></Suspense>} />
        <Route path="notifications" element={<Suspense fallback={<PageLoader message="Loading notifications…" />}><Notifications /></Suspense>} />
        <Route path="profile"       element={<Suspense fallback={<PageLoader message="Loading profile…" />}><Profile /></Suspense>} />
        <Route path="settings"      element={<Suspense fallback={<PageLoader message="Loading settings…" />}><Settings /></Suspense>} />
        <Route path="users"         element={<Suspense fallback={<PageLoader message="Loading users…" />}><UserManagement /></Suspense>} />
      </Route>

      {/* Catch all — dedicated 404 page */}
      <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
    </Routes>
  )
}

export default AppRoutes
