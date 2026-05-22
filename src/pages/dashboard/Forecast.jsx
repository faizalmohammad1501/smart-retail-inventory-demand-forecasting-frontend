import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Target, AlertCircle, Package, DollarSign, RefreshCw } from 'lucide-react'
import ForecastCard from '../../components/dashboard/ForecastCard'
import MetricCard from '../../components/analytics/MetricCard'
import TrendChart from '../../components/analytics/TrendChart'
import DateRangePicker from '../../components/common/DateRangePicker'
import { generateDemandForecast, getReorderRecommendations, predictNextValue } from '../../utils/analyticsUtils'
import { forecastService } from '../../services/api'

const Forecast = () => {
  const [timeframe, setTimeframe] = useState('30days')
  const [loading, setLoading] = useState(false)
  const [forecastData, setForecastData] = useState({
    revenue: { current: 125400, forecast: 138900, accuracy: 87 },
    units: { current: 3245, forecast: 3580, accuracy: 91 },
    stockNeeded: { current: 850, forecast: 935, accuracy: 85 },
  })
  const [productForecasts, setProductForecasts] = useState([
    { name: 'Product A', current: 120, forecast: 145, change: 20.8, trend: 'up', confidence: 89 },
    { name: 'Product B', current: 85, forecast: 78, change: -8.2, trend: 'down', confidence: 82 },
    { name: 'Product C', current: 200, forecast: 235, change: 17.5, trend: 'up', confidence: 91 },
    { name: 'Product D', current: 150, forecast: 168, change: 12.0, trend: 'up', confidence: 87 },
    { name: 'Product E', current: 95, forecast: 88, change: -7.4, trend: 'down', confidence: 84 },
  ])
  const [recommendations, setRecommendations] = useState([
    { product: 'Product A', action: 'Increase stock by 35 units', priority: 'high', reason: 'High demand forecast' },
    { product: 'Product B', action: 'Consider promotional pricing', priority: 'medium', reason: 'Declining demand trend' },
    { product: 'Product C', action: 'Schedule restock within 5 days', priority: 'high', reason: 'Current stock below forecast' },
    { product: 'Product F', action: 'Maintain current levels', priority: 'low', reason: 'Stable demand pattern' },
  ])

  const historicalData = [
    { month: 'Jan', actual: 4200, forecast: 4100 },
    { month: 'Feb', actual: 3800, forecast: 3900 },
    { month: 'Mar', actual: 5200, forecast: 5000 },
    { month: 'Apr', actual: 4800, forecast: 4900 },
    { month: 'May', actual: 6200, forecast: 6000 },
    { month: 'Jun', actual: 5800, forecast: 5900 },
  ]

  const fetchForecastData = async () => {
    setLoading(true)
    try {
      // In production: const response = await forecastService.getDemandForecast({ timeframe })
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Simulate data refresh
    } catch (error) {
      console.error('Failed to fetch forecast data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForecastData()
  }, [timeframe])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Demand Forecasting</h1>
          <p className="text-gray-600 mt-1">AI-powered demand predictions and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchForecastData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Forecast Period</h3>
        <DateRangePicker value={timeframe} onChange={(value) => setTimeframe(value.preset || value)} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Revenue Forecast"
          value={`$${(forecastData.revenue.forecast / 1000).toFixed(1)}K`}
          change={((forecastData.revenue.forecast - forecastData.revenue.current) / forecastData.revenue.current * 100).toFixed(1)}
          changeLabel="vs current"
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <MetricCard
          title="Units Forecast"
          value={forecastData.units.forecast.toLocaleString()}
          change={((forecastData.units.forecast - forecastData.units.current) / forecastData.units.current * 100).toFixed(1)}
          changeLabel="vs current"
          icon={Package}
          color="blue"
          loading={loading}
        />
        <MetricCard
          title="Forecast Accuracy"
          value={`${forecastData.revenue.accuracy}%`}
          change={3.2}
          changeLabel="improvement"
          icon={Target}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Trend Visualization */}
      <TrendChart
        title="Historical Performance vs Forecast"
        data={historicalData}
        dataKeys={['actual', 'forecast']}
        colors={['#3B82F6', '#10B981']}
      />

      {/* Forecast Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Detailed Forecasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ForecastCard
            title="Next Week Sales"
            prediction="$52,800"
            confidence={forecastData.revenue.accuracy}
            timeframe="7 days ahead"
          />
          <ForecastCard
            title="Monthly Revenue"
            prediction={`$${(forecastData.revenue.forecast / 1000).toFixed(1)}K`}
            confidence={forecastData.units.accuracy}
            timeframe="30 days ahead"
          />
          <ForecastCard
            title="Stock Requirements"
            prediction={`${forecastData.stockNeeded.forecast} units`}
            confidence={forecastData.stockNeeded.accuracy}
            timeframe="Next restock"
          />
        </div>
      </div>

      {/* Product-wise Forecast */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Product-wise Demand Forecast</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forecast</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productForecasts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.current}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{product.forecast}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`flex items-center ${product.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp size={16} className={`mr-1 ${product.change < 0 ? 'transform rotate-180' : ''}`} />
                      {product.change > 0 ? '+' : ''}{product.change}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${product.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{product.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.trend === 'up' ? 'Increasing' : 'Decreasing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="text-blue-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">AI-Powered Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm"
                >
                  <div className={`mt-1 w-2 h-2 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-500' :
                    rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{rec.product}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{rec.action}</p>
                    <p className="text-xs text-gray-500">{rec.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Low Demand Alert */}
      {productForecasts.filter(p => p.change < 0).length > 0 && (
        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Products with Declining Demand</h3>
              <div className="space-y-2">
                {productForecasts
                  .filter(p => p.change < 0)
                  .map((product, index) => (
                    <div key={index} className="text-sm text-yellow-800">
                      <strong>{product.name}</strong>: Expected to decrease by {Math.abs(product.change)}%
                    </div>
                  ))}
              </div>
              <p className="text-xs text-yellow-700 mt-3">
                Consider implementing promotional strategies or reviewing pricing for these products.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Forecast
