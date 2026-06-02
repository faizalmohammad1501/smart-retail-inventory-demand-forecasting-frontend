import { useState, useCallback, useRef } from 'react'

/**
 * Generic hook for one-off imperative API calls (mutations, form submits, etc.)
 *
 * Usage:
 *   const { execute, loading, error, data } = useApiRequest()
 *   await execute(() => inventoryService.createItem(payload))
 *
 * For declarative data fetching on mount, use useFetch in useCustomHooks.js instead.
 */
const useApiRequest = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [data, setData]       = useState(null)
  const abortRef              = useRef(null)

  const execute = useCallback(async (requestFn, { onSuccess, onError } = {}) => {
    setLoading(true)
    setError(null)

    try {
      const result = await requestFn()
      const payload = result?.data ?? result
      setData(payload)
      onSuccess?.(payload)
      return payload
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        'An unexpected error occurred.'
      setError(message)
      onError?.(message, err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return { execute, loading, error, data, reset }
}

export default useApiRequest
