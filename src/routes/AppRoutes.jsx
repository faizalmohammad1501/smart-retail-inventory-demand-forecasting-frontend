import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard'
import Inventory from '../pages/dashboard/Inventory'
import Forecast from '../pages/dashboard/Forecast'
import Reports from '../pages/dashboard/Reports'
import Suppliers from '../pages/dashboard/Suppliers'
import Orders from '../pages/dashboard/Orders'
import Notifications from '../pages/dashboard/Notifications'
import Profile from '../pages/dashboard/Profile'
import Settings from '../pages/dashboard/Settings'
import UserManagement from '../pages/dashboard/UserManagement'

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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="forecast" element={<Forecast />} />
        <Route path="reports" element={<Reports />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
