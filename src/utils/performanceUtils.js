/**
 * performanceUtils.js
 * Lightweight helpers for render-time optimisation and debugging.
 */

/**
 * Formats a number as a currency string.
 * Memoising the Intl formatter instance avoids repeated construction.
 */
const currencyFormatters = {}
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  const key = `${currency}-${locale}`
  if (!currencyFormatters[key]) {
    currencyFormatters[key] = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    })
  }
  return currencyFormatters[key].format(value)
}

/**
 * Formats a number with thousands separators.
 */
const numberFormatters = {}
export const formatNumber = (value, locale = 'en-US') => {
  if (!numberFormatters[locale]) {
    numberFormatters[locale] = new Intl.NumberFormat(locale)
  }
  return numberFormatters[locale].format(value)
}

/**
 * Returns a debounced version of `fn` that waits `delay` ms.
 * Useful for search inputs / resize handlers outside React component scope.
 */
export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Shallow-compares two objects for equality (for custom React.memo comparators).
 */
export const shallowEqual = (a, b) => {
  if (a === b) return true
  if (!a || !b) return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  return keysA.every(key => Object.is(a[key], b[key]))
}

/**
 * Groups an array of objects by a key function.
 * @example groupBy(items, i => i.category)
 */
export const groupBy = (arr, keyFn) =>
  arr.reduce((acc, item) => {
    const key = keyFn(item)
    ;(acc[key] = acc[key] || []).push(item)
    return acc
  }, {})

/**
 * Clamps a value between min and max.
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * Returns a truncated string with an ellipsis if it exceeds maxLength.
 */
export const truncate = (str, maxLength = 50) =>
  str && str.length > maxLength ? `${str.slice(0, maxLength - 1)}…` : str

/**
 * Converts a byte count to a human-readable string (e.g. "1.2 MB").
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}
