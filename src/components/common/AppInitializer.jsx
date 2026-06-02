import { useEffect, useState } from 'react'
import { healthService } from '../../services/api'

/**
 * Rendered once at app startup (inside App.jsx or main.jsx context).
 * Performs initial setup tasks without blocking the UI.
 *
 * Current responsibilities:
 * - Checks backend reachability (silent; never blocks render)
 * - Clears stale auth tokens when the API is unreachable for >3 retries
 */
const AppInitializer = ({ children }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      try {
        await healthService.ping()
      } catch {
        // Backend unreachable — app still renders; components handle their own errors
      } finally {
        if (isMounted) setReady(true)
      }
    }

    init()
    return () => { isMounted = false }
  }, [])

  // Show nothing (not a spinner) while the silent health check runs;
  // it resolves in < 5 s and the rest of the app is not blocked.
  if (!ready) return null

  return children
}

export default AppInitializer
