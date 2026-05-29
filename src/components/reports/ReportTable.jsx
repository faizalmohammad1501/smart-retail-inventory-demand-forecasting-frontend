import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Badge } from '../ui'

const StatusBadge = ({ status }) => {
  const variants = {
    'Completed': 'success',
    'Pending': 'warning',
    'Returned': 'danger',
    'Cancelled': 'danger',
    'Healthy': 'success',
    'Low Stock': 'warning',
  }

  return (
    <Badge variant={variants[status] || 'default'} size="sm">
      {status}
    </Badge>
  )
}

const ReportTable = ({ title, columns, data, currentPage, pageSize, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const start = (currentPage - 1) * pageSize
  const pageData = data.slice(start, start + pageSize)

  const renderCellValue = (row, column) => {
    const value = column.render ? column.render(row) : row[column.key]
    
    // Automatically apply status badge styling
    if (column.key === 'status' && typeof value === 'string') {
      return <StatusBadge status={value} />
    }
    
    return value
  }

  return (
    <div className="card print-page-break">
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
      <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-xs font-semibold uppercase text-gray-600 border-b border-gray-200">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pageData.length > 0 ? (
              pageData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`} className="px-4 py-3 text-sm text-gray-700 align-middle">
                      {renderCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-500">
                  No records to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{pageData.length}</span> of <span className="font-semibold">{data.length}</span> records
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} /> 
            <span className="hidden sm:inline">Prev</span>
          </button>
          <span className="text-xs sm:text-sm text-gray-600 px-2 whitespace-nowrap">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportTable
