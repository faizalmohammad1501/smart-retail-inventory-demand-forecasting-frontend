import { TrendingUp } from 'lucide-react'

const ForecastCard = ({ title, prediction, confidence, timeframe }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{timeframe}</p>
        </div>
        <div className="p-3 bg-purple-100 rounded-full">
          <TrendingUp size={20} className="text-purple-600" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Predicted Value</p>
          <p className="text-2xl font-bold text-primary">{prediction}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all"
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">{confidence}%</p>
        </div>
      </div>
    </div>
  )
}

export default ForecastCard
