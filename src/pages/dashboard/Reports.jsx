import { useMemo, useState } from 'react'
import { TrendingUp, DollarSign, ShoppingCart, Package, Truck, FileText } from 'lucide-react'
import DemandChart from '../../components/dashboard/DemandChart'
import MetricCard from '../../components/analytics/MetricCard'
import TrendChart from '../../components/analytics/TrendChart'
import CategoryChart from '../../components/analytics/CategoryChart'
import ReportFilterPanel from '../../components/reports/ReportFilterPanel'
import ReportTable from '../../components/reports/ReportTable'
import ReportExportActions from '../../components/reports/ReportExportActions'
import { calculateGrowthRate, calculateForecastAccuracy, formatDateRange } from '../../utils/analyticsUtils'
import { buildReportRows, downloadCsv, formatCurrency, formatDate, getPrintableDateRange } from '../../utils/reportUtils'
import { EmptyState, Badge } from '../../components/ui'

const Reports = () => {
  const [filters, setFilters] = useState({
    preset: '30days',
    startDate: '',
    endDate: '',
    category: 'All',
    supplier: 'All',
    status: 'all',
    search: '',
  })
  const [activeTab, setActiveTab] = useState('sales')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

  const categories = ['All', 'Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden']
  const suppliers = ['All', 'Fresh Supply Co', 'Global Wholesale', 'MarketSource', 'Harbor Traders']
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Returned', label: 'Returned' },
    { value: 'Cancelled', label: 'Cancelled' },
  ]

  const salesTransactions = [
    { date: '2026-05-05', orderId: 'ORD-1001', customer: 'Sapphire Retail', product: 'Store POS Kit', category: 'Electronics', supplier: 'Fresh Supply Co', status: 'Completed', amount: 1540 },
    { date: '2026-05-06', orderId: 'ORD-1002', customer: 'Luna Grocers', product: 'Bulk Packing Tape', category: 'Home & Garden', supplier: 'MarketSource', status: 'Completed', amount: 890 },
    { date: '2026-05-07', orderId: 'ORD-1003', customer: 'North End Apparel', product: 'Premium Shirt Display', category: 'Clothing', supplier: 'Global Wholesale', status: 'Pending', amount: 2350 },
    { date: '2026-05-09', orderId: 'ORD-1004', customer: 'Harvest Fresh', product: 'Smart Scale Bundle', category: 'Food & Beverages', supplier: 'Fresh Supply Co', status: 'Completed', amount: 1725 },
    { date: '2026-05-11', orderId: 'ORD-1005', customer: 'Urban Comfort', product: 'Energy Efficient Lights', category: 'Home & Garden', supplier: 'Harbor Traders', status: 'Returned', amount: 690 },
    { date: '2026-05-14', orderId: 'ORD-1006', customer: 'Bright Goods', product: 'RFID Tag Roll', category: 'Electronics', supplier: 'Global Wholesale', status: 'Completed', amount: 1190 },
    { date: '2026-05-16', orderId: 'ORD-1007', customer: 'Market Lane', product: 'Gondola Shelving', category: 'Home & Garden', supplier: 'MarketSource', status: 'Completed', amount: 2780 },
    { date: '2026-05-18', orderId: 'ORD-1008', customer: 'Peak Traders', product: 'Backroom Barcode Scanner', category: 'Electronics', supplier: 'Fresh Supply Co', status: 'Cancelled', amount: 980 },
    { date: '2026-05-20', orderId: 'ORD-1009', customer: 'City Threads', product: 'Custom Hangars', category: 'Clothing', supplier: 'Harbor Traders', status: 'Completed', amount: 720 },
    { date: '2026-05-22', orderId: 'ORD-1010', customer: 'Fresh Basket', product: 'Temperature Monitor', category: 'Food & Beverages', supplier: 'MarketSource', status: 'Pending', amount: 1360 },
    { date: '2026-05-24', orderId: 'ORD-1011', customer: 'Latitude Shops', product: 'Shelf Edge Labels', category: 'Home & Garden', supplier: 'Global Wholesale', status: 'Completed', amount: 540 },
    { date: '2026-05-26', orderId: 'ORD-1012', customer: 'Value Depot', product: 'Wireless Payment Pad', category: 'Electronics', supplier: 'Fresh Supply Co', status: 'Completed', amount: 2180 },
  ]

  const inventoryRecords = [
    { product: 'Store POS Kit', category: 'Electronics', supplier: 'Fresh Supply Co', stock: 120, unitPrice: 125, reorderPoint: 40, status: 'Healthy' },
    { product: 'Gondola Shelving', category: 'Home & Garden', supplier: 'MarketSource', stock: 24, unitPrice: 310, reorderPoint: 20, status: 'Low Stock' },
    { product: 'RFID Tag Roll', category: 'Electronics', supplier: 'Global Wholesale', stock: 430, unitPrice: 2.5, reorderPoint: 150, status: 'Healthy' },
    { product: 'Custom Hangars', category: 'Clothing', supplier: 'Harbor Traders', stock: 180, unitPrice: 4.8, reorderPoint: 80, status: 'Healthy' },
    { product: 'Temperature Monitor', category: 'Food & Beverages', supplier: 'MarketSource', stock: 36, unitPrice: 39, reorderPoint: 30, status: 'Low Stock' },
    { product: 'Shelf Edge Labels', category: 'Home & Garden', supplier: 'Global Wholesale', stock: 260, unitPrice: 1.8, reorderPoint: 120, status: 'Healthy' },
    { product: 'Smart Scale Bundle', category: 'Food & Beverages', supplier: 'Fresh Supply Co', stock: 50, unitPrice: 34.5, reorderPoint: 40, status: 'Healthy' },
    { product: 'Backroom Barcode Scanner', category: 'Electronics', supplier: 'Fresh Supply Co', stock: 14, unitPrice: 79, reorderPoint: 20, status: 'Low Stock' },
  ]

  const supplierPerformance = [
    { supplier: 'Fresh Supply Co', onTimeRate: 95, orders: 42, spend: 34500 },
    { supplier: 'Global Wholesale', onTimeRate: 91, orders: 28, spend: 22800 },
    { supplier: 'MarketSource', onTimeRate: 88, orders: 24, spend: 19650 },
    { supplier: 'Harbor Traders', onTimeRate: 83, orders: 19, spend: 13870 },
  ]

  const forecastData = [
    { period: 'Jun', demand: 4200, forecast: 4100, confidence: 90 },
    { period: 'Jul', demand: 4500, forecast: 4380, confidence: 88 },
    { period: 'Aug', demand: 4600, forecast: 4480, confidence: 87 },
    { period: 'Sep', demand: 4700, forecast: 4620, confidence: 89 },
    { period: 'Oct', demand: 4900, forecast: 4780, confidence: 91 },
  ]

  const tabs = [
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'suppliers', label: 'Supplier', icon: Truck },
    { id: 'forecast', label: 'Forecast', icon: TrendingUp },
  ]

  const selectedRange = useMemo(() => {
    if (filters.preset !== 'custom') {
      return formatDateRange(filters.preset)
    }

    return {
      startDate: filters.startDate ? new Date(filters.startDate) : null,
      endDate: filters.endDate ? new Date(filters.endDate) : null,
    }
  }, [filters.preset, filters.startDate, filters.endDate])

  const filteredTransactions = useMemo(() => {
    const searchTerm = filters.search.toLowerCase().trim()

    return salesTransactions.filter((transaction) => {
      if (selectedRange.startDate && selectedRange.endDate) {
        const transactionDate = new Date(transaction.date)
        if (transactionDate < selectedRange.startDate || transactionDate > selectedRange.endDate) {
          return false
        }
      }

      if (filters.category !== 'All' && transaction.category !== filters.category) {
        return false
      }

      if (filters.supplier !== 'All' && transaction.supplier !== filters.supplier) {
        return false
      }

      if (filters.status !== 'all' && transaction.status !== filters.status) {
        return false
      }

      if (searchTerm.length > 0) {
        const searchFields = [transaction.orderId, transaction.product, transaction.customer, transaction.supplier, transaction.category]
        if (!searchFields.some((field) => field.toLowerCase().includes(searchTerm))) {
          return false
        }
      }

      return true
    })
  }, [filters, selectedRange])

  const salesTrendData = useMemo(() => {
    const map = {}

    filteredTransactions.forEach((transaction) => {
      const month = new Date(transaction.date).toLocaleString('en-US', { month: 'short' })
      if (!map[month]) {
        map[month] = { month, revenue: 0, units: 0, orders: 0 }
      }
      map[month].revenue += transaction.amount
      map[month].units += 1
      map[month].orders += 1
    })

    return Object.values(map)
  }, [filteredTransactions])

  const categoryBreakdown = useMemo(() => {
    const breakdown = {}

    filteredTransactions.forEach((transaction) => {
      if (!breakdown[transaction.category]) {
        breakdown[transaction.category] = { name: transaction.category, value: 0, revenue: 0, color: '#3B82F6' }
      }
      breakdown[transaction.category].value += 1
      breakdown[transaction.category].revenue += transaction.amount
    })

    return Object.values(breakdown).map((item, index) => ({
      ...item,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5],
    }))
  }, [filteredTransactions])

  const totalRevenue = useMemo(() => filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0), [filteredTransactions])
  const totalOrders = filteredTransactions.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const completedOrders = filteredTransactions.filter((transaction) => transaction.status === 'Completed').length
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0

  const inventoryHealthSummary = useMemo(() => {
    const totalValue = inventoryRecords.reduce((sum, item) => sum + item.stock * item.unitPrice, 0)
    const lowStock = inventoryRecords.filter((item) => item.stock <= item.reorderPoint).length
    return { totalValue, lowStock, productsNearReorder: lowStock }
  }, [inventoryRecords])

  const supplierSummary = useMemo(() => {
    const totalSpend = supplierPerformance.reduce((sum, supplier) => sum + supplier.spend, 0)
    return {
      totalSpend,
      topSupplier: supplierPerformance.sort((a, b) => b.onTimeRate - a.onTimeRate)[0]?.supplier || 'N/A',
    }
  }, [supplierPerformance])

  const forecastAccuracy = useMemo(
    () => calculateForecastAccuracy(forecastData.map((item) => item.demand), forecastData.map((item) => item.forecast)),
    [forecastData]
  )

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setCurrentPage(1)
  }

  const handleDateChange = (value) => {
    if (value.preset) {
      setFilters((prev) => ({ ...prev, preset: value.preset, startDate: '', endDate: '' }))
    } else {
      setFilters((prev) => ({ ...prev, preset: 'custom', ...value }))
    }
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      preset: '30days',
      startDate: '',
      endDate: '',
      category: 'All',
      supplier: 'All',
      status: 'all',
      search: '',
    })
    setCurrentPage(1)
  }

  const handleExportCsv = (typeLabel) => {
    let rows = []

    if (activeTab === 'inventory') {
      rows = buildReportRows(inventoryRecords, {
        product: 'Product',
        category: 'Category',
        supplier: 'Supplier',
        stock: 'Stock Level',
        unitPrice: 'Unit Price',
        reorderPoint: 'Reorder Point',
        status: 'Status',
      })
    } else if (activeTab === 'suppliers') {
      rows = buildReportRows(supplierPerformance, {
        supplier: 'Supplier',
        onTimeRate: 'On-time Rate',
        orders: 'Orders',
        spend: 'Spend',
      })
    } else if (activeTab === 'forecast') {
      rows = buildReportRows(forecastData, {
        period: 'Period',
        demand: 'Demand',
        forecast: 'Forecast',
        confidence: 'Confidence (%)',
      })
    } else {
      rows = buildReportRows(filteredTransactions, {
        date: 'Date',
        orderId: 'Order ID',
        customer: 'Customer',
        product: 'Product',
        category: 'Category',
        supplier: 'Supplier',
        status: 'Status',
        amount: 'Amount',
      })
    }

    const filename = `${typeLabel || activeTab}-report-${new Date().toISOString().slice(0, 10)}.csv`
    downloadCsv(filename, rows)
  }

  const handleExportSummary = () => {
    const rows = [
      { Metric: 'Selected Date Range', Value: getPrintableDateRange(filters) },
      { Metric: 'Total Revenue', Value: formatCurrency(totalRevenue) },
      { Metric: 'Order Count', Value: totalOrders },
      { Metric: 'Average Order Value', Value: formatCurrency(averageOrderValue) },
      { Metric: 'Completion Rate', Value: `${completionRate}%` },
      { Metric: 'Inventory Value', Value: formatCurrency(inventoryHealthSummary.totalValue) },
      { Metric: 'Supplier Spend', Value: formatCurrency(supplierSummary.totalSpend) },
      { Metric: 'Forecast Accuracy', Value: `${forecastAccuracy.toFixed(1)}%` },
    ]

    downloadCsv(`reports-summary-${new Date().toISOString().slice(0, 10)}.csv`, rows)
  }

  const handleSavePdf = () => {
    window.print()
  }

  const tableConfig = useMemo(() => {
    if (activeTab === 'inventory') {
      return {
        title: 'Inventory Status',
        columns: [
          { key: 'product', label: 'Product' },
          { key: 'category', label: 'Category' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'stock', label: 'Stock' },
          { key: 'unitPrice', label: 'Unit Price', render: (row) => formatCurrency(row.unitPrice) },
          { key: 'reorderPoint', label: 'Reorder Level' },
          { key: 'status', label: 'Status' },
        ],
        data: inventoryRecords,
      }
    }

    if (activeTab === 'suppliers') {
      return {
        title: 'Supplier Performance',
        columns: [
          { key: 'supplier', label: 'Supplier' },
          { key: 'onTimeRate', label: 'On-time Rate', render: (row) => `${row.onTimeRate}%` },
          { key: 'orders', label: 'Orders' },
          { key: 'spend', label: 'Spend', render: (row) => formatCurrency(row.spend) },
        ],
        data: supplierPerformance,
      }
    }

    if (activeTab === 'forecast') {
      return {
        title: 'Forecast Summary',
        columns: [
          { key: 'period', label: 'Period' },
          { key: 'demand', label: 'Demand' },
          { key: 'forecast', label: 'Forecast' },
          { key: 'confidence', label: 'Confidence' },
        ],
        data: forecastData,
      }
    }

    return {
      title: 'Sales Transactions',
      columns: [
        { key: 'date', label: 'Date', render: (row) => formatDate(row.date) },
        { key: 'orderId', label: 'Order ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'product', label: 'Product' },
        { key: 'category', label: 'Category' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
      ],
      data: filteredTransactions,
    }
  }, [activeTab, filteredTransactions, inventoryRecords, supplierPerformance, forecastData])

  const tabsClasses = (tabId) =>
    `flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
      activeTab === tabId ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Export Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Generate sales, inventory, supplier, and forecast reports with export and print-ready output.</p>
        </div>
      </div>

      <ReportExportActions
        onExportCsv={handleExportCsv}
        onExportSummary={handleExportSummary}
        onSavePdf={handleSavePdf}
        reportLabel={activeTab}
      />

      <ReportFilterPanel
        filters={filters}
        categories={categories}
        suppliers={suppliers}
        statuses={statuses}
        onDateChange={handleDateChange}
        onFilterChange={handleFilterChange}
        onClear={clearFilters}
      />

      <div className="card no-print">
        <h2 className="text-lg font-semibold text-gray-900">Report Sections</h2>
        <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id)
                setCurrentPage(1)
              }}
              className={tabsClasses(tab.id)}
            >
              <tab.icon size={18} />
              <span className="font-medium hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          change={calculateGrowthRate(totalRevenue, totalRevenue * 0.9).toFixed(1)}
          changeLabel="vs goal"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Orders"
          value={totalOrders.toString()}
          change={calculateGrowthRate(totalOrders, Math.max(totalOrders - 3, 1)).toFixed(1)}
          changeLabel="vs last period"
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(averageOrderValue)}
          change={calculateGrowthRate(averageOrderValue, averageOrderValue * 0.95).toFixed(1)}
          changeLabel="vs last month"
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Completion Rate"
          value={`${completionRate}%`}
          change={calculateGrowthRate(completionRate, Math.max(completionRate - 10, 1)).toFixed(1)}
          changeLabel="orders completed"
          icon={FileText}
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {salesTrendData.length > 0 ? (
            <TrendChart
              title="Revenue Trend"
              data={salesTrendData}
              dataKeys={['revenue']}
              colors={['#3B82F6']}
            />
          ) : (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <EmptyState type="noData" description="No revenue data available for the selected date range" />
            </div>
          )}
          {salesTrendData.length > 0 ? (
            <TrendChart
              title="Sales Volume"
              data={salesTrendData}
              dataKeys={['units']}
              colors={['#F59E0B']}
            />
          ) : (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Volume</h3>
              <EmptyState type="noData" description="No sales volume data available" />
            </div>
          )}
        </div>
        <div>
          {categoryBreakdown.length > 0 ? (
            <CategoryChart
              title="Category Revenue Mix"
              data={categoryBreakdown}
            />
          ) : (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Revenue Mix</h3>
              <EmptyState type="noData" description="No category data available" />
            </div>
          )}
        </div>
      </div>

      {activeTab !== 'forecast' ? (
        tableConfig.data.length > 0 ? (
          <ReportTable
            title={tableConfig.title}
            columns={tableConfig.columns}
            data={tableConfig.data}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        ) : (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{tableConfig.title}</h2>
            <EmptyState type="noResults" description="No data matches your current filters. Try adjusting your search criteria." />
          </div>
        )
      ) : (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <MetricCard
              title="Forecast Accuracy"
              value={`${forecastAccuracy.toFixed(1)}%`}
              change={calculateGrowthRate(forecastAccuracy, Math.max(forecastAccuracy - 3, 1)).toFixed(1)}
              changeLabel="vs previous forecast"
              icon={TrendingUp}
              color="blue"
            />
            <MetricCard
              title="Expected Demand"
              value="4.8K"
              change={3.8}
              icon={ShoppingCart}
              color="green"
            />
            <MetricCard
              title="Supplier Reliability"
              value={supplierSummary.topSupplier}
              icon={Truck}
              color="purple"
            />
          </div>
          <DemandChart />
          {tableConfig.data.length > 0 ? (
            <ReportTable
              title={tableConfig.title}
              columns={tableConfig.columns}
              data={tableConfig.data}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          ) : (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{tableConfig.title}</h2>
              <EmptyState type="noData" description="No forecast data available" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Reports
