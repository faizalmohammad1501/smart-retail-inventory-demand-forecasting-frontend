import { TrendingUp, TrendingDown } from 'lucide-react'

const MetricCard = ({ title, value, change, changeLabel, icon: Icon, color = 'blue', loading = false }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600',
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  const isPositive = change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendIcon size={16} className="mr-1" />
              <span className="font-medium">
                {isPositive ? '+' : ''}{change}%
              </span>
              {changeLabel && <span className="text-gray-500 ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-full ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard
