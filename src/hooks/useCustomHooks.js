import { useState, useEffect } from 'react'

// Custom hook for fetching data
export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchFunction()
        if (isMounted) {
          setData(result.data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'An error occurred')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, dependencies)

  return { data, loading, error, refetch: fetchData }
}

// Custom hook for form handling
export const useForm = (initialValues, validateFn) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    if (touched[name] && validateFn) {
      const fieldError = validateFn({ ...values, [name]: value })[name]
      setErrors(prev => ({ ...prev, [name]: fieldError }))
    }
  }

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    if (validateFn) {
      const fieldError = validateFn(values)[name]
      setErrors(prev => ({ ...prev, [name]: fieldError }))
    }
  }

  const handleSubmit = (callback) => (e) => {
    e.preventDefault()
    
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)

    if (validateFn) {
      const validationErrors = validateFn(values)
      setErrors(validationErrors)
      
      if (Object.keys(validationErrors).every(key => !validationErrors[key])) {
        callback(values)
      }
    } else {
      callback(values)
    }
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  }
}

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Custom hook for debounce
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
