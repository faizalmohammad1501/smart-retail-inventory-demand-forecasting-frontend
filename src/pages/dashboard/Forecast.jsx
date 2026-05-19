import { useState } from 'react'
import { TrendingUp, Calendar, Target } from 'lucide-react'
import ForecastCard from '../../components/dashboard/ForecastCard'
import SalesChart from '../../components/dashboard/SalesChart'

const Forecast = () => {
  const [timeframe, setTimeframe] = useState('7days')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Demand Forecasting</h1>
          <p className="text-gray-600 mt-1">AI-powered demand predictions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={20} className="text-gray-600" />
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7days">Next 7 Days</option>
            <option value="30days">Next 30 Days</option>
            <option value="90days">Next 90 Days</option>
          </select>
        </div>
      </div>

      {/* Forecast Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ForecastCard
          title="Revenue Forecast"
          prediction="$52,800"
          confidence={87}
          timeframe="Next 7 days"
        />
        <ForecastCard
          title="Units Sold"
          prediction="1,240 units"
          confidence={91}
          timeframe="Next 7 days"
        />
        <ForecastCard
          title="Stock Needed"
          prediction="850 units"
          confidence={85}
          timeframe="Next 7 days"
        />
      </div>

      {/* Forecast Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Sales Forecast Trend</h3>
        <SalesChart />
      </div>

      {/* Product-wise Forecast */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Product-wise Forecast</h3>
        <div className="space-y-4">
          {[
            { name: 'Product A', current: 120, forecast: 145, change: 20.8 },
            { name: 'Product B', current: 85, forecast: 78, change: -8.2 },
            { name: 'Product C', current: 200, forecast: 235, change: 17.5 },
            { name: 'Product D', current: 150, forecast: 168, change: 12.0 },
          ].map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="text-gray-600">Current: {product.current}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-900 font-semibold">Forecast: {product.forecast}</span>
                </div>
              </div>
              <div className={`flex items-center space-x-2 ${product.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp size={20} className={product.change < 0 ? 'transform rotate-180' : ''} />
                <span className="font-semibold">{product.change > 0 ? '+' : ''}{product.change}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <Target className="text-blue-600 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Recommendations</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Increase stock of Product C by 35 units to meet forecasted demand</li>
              <li>• Consider promotional pricing for Product B due to declining forecast</li>
              <li>• Schedule restock for Product A within 5 days to avoid stockout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forecast
