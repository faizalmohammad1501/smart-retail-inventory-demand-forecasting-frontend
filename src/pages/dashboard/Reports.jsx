import { useState, useEffect } from 'react'
import { Download, FileText, TrendingUp, DollarSign, ShoppingCart, Package } from 'lucide-react'
import DemandChart from '../../components/dashboard/DemandChart'
import MetricCard from '../../components/analytics/MetricCard'
import TrendChart from '../../components/analytics/TrendChart'
import CategoryChart from '../../components/analytics/CategoryChart'
import DateRangePicker from '../../components/common/DateRangePicker'
import { calculateGrowthRate, categorizeProducts } from '../../utils/analyticsUtils'

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // overview, sales, inventory, category

  const stats = {
    totalSales: 125430,
    previousSales: 112000,
    unitsSold: 3245,
    previousUnits: 2980,
    avgOrderValue: 38.65,
    previousAvg: 39.45,
    forecastAccuracy: 87,
    previousAccuracy: 84
  }

  const salesData = [
    { month: 'Jan', revenue: 98000, units: 2450, orders: 245 },
    { month: 'Feb', revenue: 87000, units: 2180, orders: 218 },
    { month: 'Mar', revenue: 125000, units: 3125, orders: 312 },
    { month: 'Apr', revenue: 112000, units: 2800, orders: 280 },
    { month: 'May', revenue: 145000, units: 3625, orders: 362 },
    { month: 'Jun', revenue: 138000, units: 3450, orders: 345 },
  ]

  const categoryPerformance = [
    { name: 'Electronics', value: 35, revenue: 43900, color: '#3B82F6' },
    { name: 'Clothing', value: 25, revenue: 31350, color: '#10B981' },
    { name: 'Food & Beverages', value: 20, revenue: 25086, color: '#F59E0B' },
    { name: 'Home & Garden', value: 12, revenue: 15052, color: '#EF4444' },
    { name: 'Other', value: 8, revenue: 10034, color: '#8B5CF6' },
  ]

  const topProducts = [
    { name: 'Product A', sales: 25400, units: 845, growth: 15.2, category: 'Electronics' },
    { name: 'Product C', sales: 22100, units: 732, growth: 12.8, category: 'Clothing' },
    { name: 'Product D', sales: 19800, units: 658, growth: 8.5, category: 'Electronics' },
    { name: 'Product E', sales: 18500, units: 615, growth: 6.2, category: 'Home & Garden' },
    { name: 'Product F', sales: 16200, units: 540, growth: 4.8, category: 'Food & Beverages' },
  ]

  const handleExport = (reportType) => {
    console.log(`Exporting ${reportType} report...`)
    // In production: Implement actual export functionality
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'sales', label: 'Sales Analysis', icon: DollarSign },
    { id: 'inventory', label: 'Inventory Analytics', icon: Package },
    { id: 'category', label: 'Category Performance', icon: ShoppingCart },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and detailed reports</p>
        </div>
        <button
          onClick={() => handleExport('full')}
          className="btn-primary flex items-center space-x-2 px-4 py-2"
        >
          <Download size={20} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="card">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Report Period</h3>
        <DateRangePicker value={dateRange} onChange={(value) => setDateRange(value.preset || value)} />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Sales"
              value={`$${(stats.totalSales / 1000).toFixed(1)}K`}
              change={calculateGrowthRate(stats.totalSales, stats.previousSales).toFixed(1)}
              changeLabel="vs previous period"
              icon={DollarSign}
              color="green"
              loading={loading}
            />
            <MetricCard
              title="Units Sold"
              value={stats.unitsSold.toLocaleString()}
              change={calculateGrowthRate(stats.unitsSold, stats.previousUnits).toFixed(1)}
              changeLabel="vs previous period"
              icon={ShoppingCart}
              color="blue"
              loading={loading}
            />
            <MetricCard
              title="Avg Order Value"
              value={`$${stats.avgOrderValue.toFixed(2)}`}
              change={calculateGrowthRate(stats.avgOrderValue, stats.previousAvg).toFixed(1)}
              changeLabel="vs previous period"
              icon={TrendingUp}
              color="purple"
              loading={loading}
            />
            <MetricCard
              title="Forecast Accuracy"
              value={`${stats.forecastAccuracy}%`}
              change={calculateGrowthRate(stats.forecastAccuracy, stats.previousAccuracy).toFixed(1)}
              changeLabel="improvement"
              icon={Package}
              color="indigo"
              loading={loading}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart
              title="Revenue Trend"
              data={salesData}
              dataKeys={['revenue']}
              colors={['#3B82F6']}
            />
            <DemandChart />
          </div>
        </>
      )}

      {/* Sales Analysis Tab */}
      {activeTab === 'sales' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendChart
              title="Monthly Revenue"
              data={salesData}
              dataKeys={['revenue']}
              colors={['#10B981']}
            />
            <TrendChart
              title="Units Sold"
              data={salesData}
              dataKeys={['units']}
              colors={['#F59E0B']}
            />
          </div>

          {/* Top Products Table */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">${product.sales.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.units.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-green-600 font-medium">+{product.growth}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Inventory Analytics Tab */}
      {activeTab === 'inventory' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              title="Total Stock Value"
              value="$245K"
              change={8.3}
              icon={Package}
              color="blue"
            />
            <MetricCard
              title="Stock Turnover Rate"
              value="5.2x"
              change={12.5}
              icon={TrendingUp}
              color="green"
            />
            <MetricCard
              title="Avg Days in Stock"
              value="28 days"
              change={-5.4}
              icon={TrendingUp}
              color="purple"
            />
          </div>

          <DemandChart />

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Stock Level Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">In Stock</p>
                <p className="text-2xl font-bold text-green-900 mt-1">75%</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">18%</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 font-medium">Out of Stock</p>
                <p className="text-2xl font-bold text-red-900 mt-1">7%</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Category Performance Tab */}
      {activeTab === 'category' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryChart
              title="Sales by Category"
              data={categoryPerformance}
            />
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Category Revenue Breakdown</h3>
              <div className="space-y-4">
                {categoryPerformance.map((cat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${cat.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${cat.value}%`,
                          backgroundColor: cat.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Category Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryPerformance.map((cat, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{cat.name}</h4>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    ${cat.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{cat.value}% of total sales</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Available Reports */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Download Detailed Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Complete Sales Report',
              desc: 'Comprehensive sales analysis with charts and metrics',
              type: 'sales'
            },
            {
              title: 'Inventory Status Report',
              desc: 'Detailed inventory levels and valuation',
              type: 'inventory'
            },
            {
              title: 'Demand Forecast Report',
              desc: 'AI-generated demand predictions and insights',
              type: 'forecast'
            },
            {
              title: 'Supplier Performance Report',
              desc: 'Supplier metrics and delivery statistics',
              type: 'supplier'
            },
          ].map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleExport(report.type)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-lg">
                  <FileText size={24} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.desc}</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={20} className="text-primary" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
