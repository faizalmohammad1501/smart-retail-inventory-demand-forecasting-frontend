import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Download, RefreshCw, Edit2, Trash2, Eye, TrendingUp, Package, DollarSign, Clock } from 'lucide-react'
import Modal from '../../components/common/Modal'
import PurchaseOrderForm from '../../components/supplier/PurchaseOrderForm'
import OrderStatusBadge from '../../components/supplier/OrderStatusBadge'
import MetricCard from '../../components/analytics/MetricCard'
import { purchaseOrderService } from '../../services/api'
import { 
  filterOrders, 
  sortOrders, 
  formatCurrency, 
  formatDate,
  calculateOrderTotal 
} from '../../utils/supplierUtils'

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'PO-20260526-001',
      supplier: 'ABC Distributors',
      supplierId: 1,
      orderDate: '2026-05-20',
      expectedDelivery: '2026-05-27',
      status: 'confirmed',
      items: [
        { product: 'Product A', quantity: 50, price: 25.99 },
        { product: 'Product B', quantity: 30, price: 42.50 }
      ],
      subtotal: 2574.50,
      tax: 206.00,
      shippingCost: 45.00,
      total: 2825.50,
      notes: 'Urgent delivery required'
    },
    {
      id: 2,
      orderNumber: 'PO-20260524-002',
      supplier: 'Global Supplies Inc',
      supplierId: 2,
      orderDate: '2026-05-24',
      expectedDelivery: '2026-06-02',
      status: 'shipped',
      items: [
        { product: 'Product C', quantity: 100, price: 15.75 }
      ],
      subtotal: 1575.00,
      tax: 126.00,
      shippingCost: 30.00,
      total: 1731.00
    },
    {
      id: 3,
      orderNumber: 'PO-20260522-003',
      supplier: 'Tech Wholesale Co',
      supplierId: 3,
      orderDate: '2026-05-22',
      expectedDelivery: '2026-05-30',
      status: 'delivered',
      items: [
        { product: 'Product D', quantity: 75, price: 18.99 },
        { product: 'Product E', quantity: 50, price: 32.00 }
      ],
      subtotal: 3024.25,
      tax: 242.00,
      shippingCost: 50.00,
      total: 3316.25
    },
    {
      id: 4,
      orderNumber: 'PO-20260526-004',
      supplier: 'Prime Electronics Ltd',
      supplierId: 4,
      orderDate: '2026-05-26',
      expectedDelivery: '2026-06-05',
      status: 'pending',
      items: [
        { product: 'Product F', quantity: 200, price: 8.50 }
      ],
      subtotal: 1700.00,
      tax: 136.00,
      shippingCost: 25.00,
      total: 1861.00
    },
    {
      id: 5,
      orderNumber: 'PO-20260525-005',
      supplier: 'MegaMart Suppliers',
      supplierId: 5,
      orderDate: '2026-05-25',
      expectedDelivery: '2026-06-03',
      status: 'confirmed',
      items: [
        { product: 'Product G', quantity: 60, price: 28.75 },
        { product: 'Product H', quantity: 40, price: 19.99 }
      ],
      subtotal: 2524.60,
      tax: 202.00,
      shippingCost: 35.00,
      total: 2761.60
    }
  ])

  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'ABC Distributors' },
    { id: 2, name: 'Global Supplies Inc' },
    { id: 3, name: 'Tech Wholesale Co' },
    { id: 4, name: 'Prime Electronics Ltd' },
    { id: 5, name: 'MegaMart Suppliers' }
  ])

  const [products] = useState([
    { id: 1, name: 'Product A' },
    { id: 2, name: 'Product B' },
    { id: 3, name: 'Product C' },
    { id: 4, name: 'Product D' },
    { id: 5, name: 'Product E' },
    { id: 6, name: 'Product F' },
    { id: 7, name: 'Product G' },
    { id: 8, name: 'Product H' }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSupplier, setFilterSupplier] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // In production: const response = await purchaseOrderService.getAll()
      // setOrders(response.data)
      setTimeout(() => setLoading(false), 300)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  const handleAddOrder = () => {
    setSelectedOrder(null)
    setShowModal(true)
  }

  const handleEditOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const handleDeleteClick = (order) => {
    setOrderToDelete(order)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return
    
    setLoading(true)
    try {
      // In production: await purchaseOrderService.delete(orderToDelete.id)
      setOrders(prev => prev.filter(o => o.id !== orderToDelete.id))
      setShowDeleteModal(false)
      setOrderToDelete(null)
    } catch (error) {
      console.error('Error deleting order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (order) => {
    setOrderDetails(order)
    setShowDetailsModal(true)
  }

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      if (selectedOrder) {
        // Update order
        // In production: await purchaseOrderService.update(selectedOrder.id, formData)
        setOrders(prev =>
          prev.map(o => (o.id === selectedOrder.id ? { ...o, ...formData } : o))
        )
      } else {
        // Create new order
        // In production: const response = await purchaseOrderService.create(formData)
        const newOrder = {
          ...formData,
          id: Date.now()
        }
        setOrders(prev => [...prev, newOrder])
      }
      setShowModal(false)
      setSelectedOrder(null)
    } catch (error) {
      console.error('Error saving order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setLoading(true)
    try {
      // In production: await purchaseOrderService.updateStatus(orderId, newStatus)
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchOrders()
  }

  const handleExportOrders = () => {
    console.log('Exporting orders...')
    // In production: Implement CSV/PDF export
  }

  // Apply filters and sorting
  const filteredOrders = sortOrders(
    filterOrders(orders, searchTerm, {
      status: filterStatus,
      supplier: filterSupplier
    }),
    sortBy,
    sortOrder
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">Manage purchase orders and track deliveries</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleExportOrders}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          <button
            onClick={handleAddOrder}
            className="btn-primary flex items-center space-x-2 px-4 py-2"
          >
            <Plus size={20} />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={Package}
          color="blue"
        />
        <MetricCard
          title="Total Value"
          value={formatCurrency(stats.totalValue)}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          color="yellow"
        />
        <MetricCard
          title="Completed"
          value={stats.completedOrders}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Search and Filters */}
      <div className="card space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by order number, supplier, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 ${
              showFilters ? 'bg-gray-50 border-primary' : 'border-gray-300'
            }`}
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Suppliers</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="date">Order Date</option>
                <option value="total">Total Amount</option>
                <option value="supplier">Supplier</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> orders
        </p>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-primary">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.supplier}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(order.expectedDelivery)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditOrder(order)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {/* Add/Edit Order Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedOrder(null)
        }}
        title={selectedOrder ? 'Edit Purchase Order' : 'Create Purchase Order'}
        size="xl"
      >
        <PurchaseOrderForm
          order={selectedOrder}
          suppliers={suppliers}
          products={products}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false)
            setSelectedOrder(null)
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setOrderToDelete(null)
        }}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete order <strong>{orderToDelete?.orderNumber}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setOrderToDelete(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Order'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setOrderDetails(null)
        }}
        title="Order Details"
        size="lg"
      >
        {orderDetails && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{orderDetails.orderNumber}</h3>
                <p className="text-gray-600 mt-1">Supplier: {orderDetails.supplier}</p>
              </div>
              <OrderStatusBadge status={orderDetails.status} size="lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(orderDetails.orderDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Delivery</p>
                <p className="font-medium text-gray-900">{formatDate(orderDetails.expectedDelivery)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-2">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.product}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.quantity * item.price)}</p>
                      <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(orderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(orderDetails.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">{formatCurrency(orderDetails.shippingCost)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(orderDetails.total)}</span>
              </div>
            </div>

            {orderDetails.notes && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-600">{orderDetails.notes}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  handleEditOrder(orderDetails)
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Edit Order
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Orders
