import { formatDateRange as analyticsFormatDateRange } from './analyticsUtils'

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatDate = (value) => {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const getDateRangeLabel = (filters) => {
  if (filters.preset && filters.preset !== 'custom') {
    return filters.preset === 'thisMonth'
      ? 'This Month'
      : filters.preset === 'lastMonth'
      ? 'Last Month'
      : filters.preset === 'thisYear'
      ? 'This Year'
      : filters.preset.replace('days', ' days')
  }

  if (filters.startDate && filters.endDate) {
    return `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
  }

  return 'Custom Range'
}

export const downloadCsv = (filename, rows) => {
  if (!rows || rows.length === 0) {
    return
  }

  const headers = Object.keys(rows[0])
  const csvRows = [headers.join(',')]

  rows.forEach((row) => {
    const values = headers.map((header) => {
      const cell = row[header] === null || row[header] === undefined ? '' : String(row[header])
      return `"${cell.replace(/"/g, '""')}"`
    })
    csvRows.push(values.join(','))
  })

  const csvContent = csvRows.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const buildReportRows = (data, fieldMap) => {
  return data.map((item) => {
    const row = {}
    Object.entries(fieldMap).forEach(([key, label]) => {
      row[label] = item[key] !== undefined ? item[key] : ''
    })
    return row
  })
}

export const getPrintableDateRange = (filters) => {
  if (filters.preset && filters.preset !== 'custom') {
    const range = analyticsFormatDateRange(filters.preset)
    return `${formatDate(range.startDate)} — ${formatDate(range.endDate)}`
  }

  if (filters.startDate && filters.endDate) {
    return `${formatDate(filters.startDate)} — ${formatDate(filters.endDate)}`
  }

  return 'All available dates'
}
