import { useEffect } from 'react'
import { healthService } from '../../services/api'

/**
 * Fires a silent background health check on mount.
 * Never blocks rendering — children are always returned immediately.
 */
const AppInitializer = ({ children }) => {
  useEffect(() => {
    healthService.ping().catch(() => {
      // Backend unreachable — components handle their own error states
    })
  }, [])

  return children
}

export default AppInitializer
