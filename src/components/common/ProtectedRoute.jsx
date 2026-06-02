import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'

/**
 * Redirects unauthenticated users to /login.
 * Optionally restricts access by user role.
 *
 * @param {string[]} [roles] — If provided, only users whose role is in this
 *   array may access the route. Others are redirected to /dashboard.
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role-based access control
  if (roles && roles.length > 0) {
    const userRole = user.role?.toLowerCase()
    const allowed  = roles.map(r => r.toLowerCase())
    if (!allowed.includes(userRole)) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children
}

export default ProtectedRoute
