// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  return {
    isValid: minLength && hasUpper && hasLower && hasNumber,
    errors: {
      minLength: !minLength ? 'Password must be at least 8 characters' : null,
      hasUpper: !hasUpper ? 'Password must contain at least one uppercase letter' : null,
      hasLower: !hasLower ? 'Password must contain at least one lowercase letter' : null,
      hasNumber: !hasNumber ? 'Password must contain at least one number' : null,
    }
  }
}

export const validateName = (name) => {
  const trimmed = name.trim()
  return {
    isValid: trimmed.length >= 2,
    error: trimmed.length < 2 ? 'Name must be at least 2 characters' : null
  }
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
