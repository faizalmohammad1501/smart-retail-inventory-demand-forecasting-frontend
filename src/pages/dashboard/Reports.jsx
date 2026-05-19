import { useState } from 'react'
import { Download, FileText, Calendar, Filter } from 'lucide-react'
import DemandChart from '../../components/dashboard/DemandChart'

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Detailed insights and reports</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download size={20} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-600" />
            <span className="font-medium">Date Range:</span>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Sales</p>
          <h3 className="text-2xl font-bold">$125,430</h3>
          <p className="text-sm text-green-600 mt-2">+12.5% vs previous period</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Units Sold</p>
          <h3 className="text-2xl font-bold">3,245</h3>
          <p className="text-sm text-green-600 mt-2">+8.3% vs previous period</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
          <h3 className="text-2xl font-bold">$38.65</h3>
          <p className="text-sm text-red-600 mt-2">-2.1% vs previous period</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Forecast Accuracy</p>
          <h3 className="text-2xl font-bold">87%</h3>
          <p className="text-sm text-green-600 mt-2">+3.2% vs previous period</p>
        </div>
      </div>

      {/* Chart */}
      <DemandChart />

      {/* Top Products */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
        <div className="space-y-3">
          {[
            { name: 'Product A', sales: '$25,400', units: 845, growth: 15.2 },
            { name: 'Product C', sales: '$22,100', units: 732, growth: 12.8 },
            { name: 'Product D', sales: '$19,800', units: 658, growth: 8.5 },
            { name: 'Product E', sales: '$18,500', units: 615, growth: 6.2 },
          ].map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                <div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.units} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{product.sales}</p>
                <p className="text-sm text-green-600">+{product.growth}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Reports */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Inventory Report', desc: 'Complete inventory status and valuation' },
            { title: 'Sales Report', desc: 'Detailed sales analysis and trends' },
            { title: 'Forecast Report', desc: 'AI-generated demand forecasts' },
            { title: 'Supplier Report', desc: 'Supplier performance and metrics' },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all">
              <div className="flex items-center space-x-3">
                <FileText size={24} className="text-primary" />
                <div>
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-600">{report.desc}</p>
                </div>
              </div>
              <button className="text-primary hover:text-blue-700">
                <Download size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports
