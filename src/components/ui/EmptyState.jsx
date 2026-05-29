import { FileX, Search, Plus, AlertCircle } from 'lucide-react'

const EmptyState = ({ type = 'noData', title, description, action, icon: Icon }) => {
  const defaultStates = {
    noData: {
      icon: FileX,
      title: 'No data available',
      description: 'There is no data to display at the moment.',
    },
    noResults: {
      icon: Search,
      title: 'No results found',
      description: 'Try adjusting your search filters or criteria.',
    },
    noPermission: {
      icon: AlertCircle,
      title: 'Access denied',
      description: 'You do not have permission to view this content.',
    },
  }

  const state = defaultStates[type] || defaultStates.noData
  const displayIcon = Icon || state.icon
  const displayTitle = title || state.title
  const displayDescription = description || state.description

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        {typeof displayIcon === 'function' ? (
          <displayIcon size={32} className="text-gray-500" />
        ) : (
          displayIcon
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{displayTitle}</h3>
      <p className="text-gray-600 text-center max-w-sm mb-4">{displayDescription}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 btn-primary"
        >
          <Plus size={18} />
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState
