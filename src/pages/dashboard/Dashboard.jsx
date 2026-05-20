import { useEffect, useState } from 'react'
import { Package, TrendingUp, DollarSign, AlertTriangle, RefreshCw } from 'lucide-react'
import InventoryCard from '../../components/dashboard/InventoryCard'
import ForecastCard from '../../components/dashboard/ForecastCard'
import SalesChart from '../../components/dashboard/SalesChart'
import DemandChart from '../../components/dashboard/DemandChart'
import { analyticsService } from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 1247,
    lowStock: 23,
    totalRevenue: 125430,
    forecastAccuracy: 87
  })
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // In real app, this would fetch from API
      // const response = await analyticsService.getDashboardStats()
      // setStats(response.data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of your retail operations
            <span className="text-xs ml-2 text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InventoryCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          trend={5.2}
          color="blue"
        />
        <InventoryCard
          title="Low Stock Items"
          value={stats.lowStock}
          icon={AlertTriangle}
          trend={-12}
          color="red"
        />
        <InventoryCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`}
          icon={DollarSign}
          trend={8.5}
          color="green"
        />
        <InventoryCard
          title="Forecast Accuracy"
          value={`${stats.forecastAccuracy}%`}
          icon={TrendingUp}
          trend={3.2}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <DemandChart />
      </div>

      {/* Forecast Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Demand Forecasts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ForecastCard
            title="Next Week Sales"
            prediction="$42,500"
            confidence={89}
            timeframe="7 days ahead"
          />
          <ForecastCard
            title="Monthly Revenue"
            prediction="$185,000"
            confidence={85}
            timeframe="30 days ahead"
          />
          <ForecastCard
            title="Stock Requirements"
            prediction="1,450 units"
            confidence={92}
            timeframe="Next restock"
          />
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle size={20} className="text-yellow-600 mr-3" />
            <div>
              <p className="font-medium">Low stock alert: Product A</p>
              <p className="text-sm text-gray-600">Current stock: 12 units (below threshold of 50)</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <TrendingUp size={20} className="text-blue-600 mr-3" />
            <div>
              <p className="font-medium">High demand forecast: Product B</p>
              <p className="text-sm text-gray-600">Expected 40% increase in demand next week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
