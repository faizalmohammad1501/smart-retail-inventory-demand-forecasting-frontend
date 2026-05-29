const SkeletonLoader = ({ count = 1, type = 'card', className = '' }) => {
  const skeletonItem = (key) => {
    switch (type) {
      case 'card':
        return (
          <div key={key} className="card animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        )
      case 'table-row':
        return (
          <tr key={key} className="animate-pulse">
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
            <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
          </tr>
        )
      case 'chart':
        return (
          <div key={key} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        )
      case 'text':
      default:
        return (
          <div key={key} className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        )
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => skeletonItem(i))}
    </div>
  )
}

export default SkeletonLoader
