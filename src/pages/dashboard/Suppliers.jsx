import { useState, useEffect } from 'react'
import { Plus, Search, Phone, Mail, MapPin, Edit2, Trash2, Filter, Star, TrendingUp, Package, DollarSign, RefreshCw, Eye, Building2 } from 'lucide-react'
import Modal from '../../components/common/Modal'
import SupplierForm from '../../components/supplier/SupplierForm'
import MetricCard from '../../components/analytics/MetricCard'
import { supplierService } from '../../services/api'
import { 
  filterSuppliers, 
  sortSuppliers, 
  getSupplierStatus,
  getRatingClass,
  getTopSuppliers 
} from '../../utils/supplierUtils'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: 'ABC Distributors',
      contact: 'John Smith',
      email: 'john@abc.com',
      phone: '+1 234 567 8901',
      location: 'New York, USA',
      products: 45,
      rating: 4.5,
      totalOrders: 127,
      onTimeDelivery: 95,
      active: true
    },
    {
      id: 2,
      name: 'Global Supplies Inc',
      contact: 'Sarah Johnson',
      email: 'sarah@global.com',
      phone: '+1 234 567 8902',
      location: 'Los Angeles, USA',
      products: 32,
      rating: 4.8,
      totalOrders: 89,
      onTimeDelivery: 98,
      active: true
    },
    {
      id: 3,
      name: 'Tech Wholesale Co',
      contact: 'Mike Brown',
      email: 'mike@techwholesale.com',
      phone: '+1 234 567 8903',
      location: 'Chicago, USA',
      products: 28,
      rating: 4.2,
      totalOrders: 56,
      onTimeDelivery: 89,
      active: true
    },
    {
      id: 4,
      name: 'Prime Electronics Ltd',
      contact: 'Emma Wilson',
      email: 'emma@primeelectronics.com',
      phone: '+1 234 567 8904',
      location: 'San Francisco, USA',
      products: 67,
      rating: 4.9,
      totalOrders: 234,
      onTimeDelivery: 99,
      active: true
    },
    {
      id: 5,
      name: 'MegaMart Suppliers',
      contact: 'David Lee',
      email: 'david@megamart.com',
      phone: '+1 234 567 8905',
      location: 'Seattle, USA',
      products: 52,
      rating: 4.6,
      totalOrders: 145,
      onTimeDelivery: 94,
      active: true
    },
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRating, setFilterRating] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [viewMode, setViewMode] = useState('grid') // grid or table
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [supplierDetails, setSupplierDetails] = useState(null)

  const stats = {
    totalSuppliers: suppliers.length,
    activeSuppliers: suppliers.filter(s => s.active !== false).length,
    avgRating: (suppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / suppliers.length).toFixed(1),
    avgDelivery: (suppliers.reduce((sum, s) => sum + (s.onTimeDelivery || 0), 0) / suppliers.length).toFixed(0)
  }

  // Fetch suppliers (mock for now)
  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      // In production: const response = await supplierService.getAll()
      // setSuppliers(response.data)
      setTimeout(() => setLoading(false), 300)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      setLoading(false)
    }
  }

  const handleAddSupplier = () => {
    setSelectedSupplier(null)
    setShowModal(true)
  }

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier)
    setShowModal(true)
  }

  const handleDeleteClick = (supplier) => {
    setSupplierToDelete(supplier)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!supplierToDelete) return
    
    setLoading(true)
    try {
      // In production: await supplierService.delete(supplierToDelete.id)
      setSuppliers(prev => prev.filter(s => s.id !== supplierToDelete.id))
      setShowDeleteModal(false)
      setSupplierToDelete(null)
    } catch (error) {
      console.error('Error deleting supplier:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (supplier) => {
    setSupplierDetails(supplier)
    setShowDetailsModal(true)
  }

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      if (selectedSupplier) {
        // Update supplier
        // In production: await supplierService.update(selectedSupplier.id, formData)
        setSuppliers(prev =>
          prev.map(s => (s.id === selectedSupplier.id ? { ...s, ...formData } : s))
        )
      } else {
        // Create new supplier
        // In production: const response = await supplierService.create(formData)
        const newSupplier = {
          ...formData,
          id: Date.now(),
          totalOrders: 0,
          onTimeDelivery: 0
        }
        setSuppliers(prev => [...prev, newSupplier])
      }
      setShowModal(false)
      setSelectedSupplier(null)
    } catch (error) {
      console.error('Error saving supplier:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchSuppliers()
  }

  // Apply filters and sorting
  const filteredSuppliers = sortSuppliers(
    filterSuppliers(suppliers, searchTerm, {
      status: filterStatus,
      minRating: filterRating ? parseFloat(filterRating) : null
    }),
    sortBy,
    sortOrder
  )

  const topSuppliers = getTopSuppliers(suppliers, 'rating', 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
          <p className="text-gray-600 mt-1">Manage your supplier relationships and procurement</p>
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
            onClick={handleAddSupplier}
            className="btn-primary flex items-center space-x-2 px-4 py-2"
          >
            <Plus size={20} />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          icon={Building2}
          color="blue"
        />
        <MetricCard
          title="Active Suppliers"
          value={stats.activeSuppliers}
          icon={Package}
          color="green"
        />
        <MetricCard
          title="Avg Rating"
          value={`${stats.avgRating}/5.0`}
          icon={Star}
          color="yellow"
        />
        <MetricCard
          title="On-Time Delivery"
          value={`${stats.avgDelivery}%`}
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
              placeholder="Search suppliers by name, contact, email, or location..."
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 border rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 border rounded-lg ${viewMode === 'table' ? 'bg-primary text-white' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="products">Products Count</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredSuppliers.length}</span> of <span className="font-semibold">{suppliers.length}</span> suppliers
        </p>
      </div>

      {/* Suppliers Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => {
            const status = getSupplierStatus(supplier)
            return (
              <div key={supplier.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-600">{supplier.contact}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-500" fill="currentColor" />
                      <span className="text-sm font-semibold">{supplier.rating}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                      {status.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={16} className="flex-shrink-0" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={16} className="flex-shrink-0" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span>{supplier.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="text-lg font-semibold text-primary">{supplier.products}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Orders</p>
                    <p className="text-lg font-semibold text-gray-900">{supplier.totalOrders}</p>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(supplier)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEditSupplier(supplier)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(supplier)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Suppliers Table View */}
      {viewMode === 'table' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">On-Time %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSuppliers.map((supplier) => {
                  const status = getSupplierStatus(supplier)
                  return (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{supplier.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{supplier.contact}</div>
                        <div className="text-sm text-gray-500">{supplier.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {supplier.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500" fill="currentColor" />
                          <span className="text-sm font-semibold">{supplier.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                        {supplier.products}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {supplier.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${supplier.onTimeDelivery >= 95 ? 'text-green-600' : supplier.onTimeDelivery >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {supplier.onTimeDelivery}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.class}`}>
                          {status.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(supplier)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditSupplier(supplier)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(supplier)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Performers */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Top Performing Suppliers</h3>
        <div className="space-y-4">
          {topSuppliers.map((supplier, index) => (
            <div key={supplier.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                  <p className="text-sm text-gray-600">{supplier.location}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star size={16} className="text-yellow-500" fill="currentColor" />
                  <span className="font-semibold text-gray-900">{supplier.rating}</span>
                </div>
                <p className="text-xs text-gray-500">{supplier.totalOrders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {/* Add/Edit Supplier Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedSupplier(null)
        }}
        title={selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}
        size="xl"
      >
        <SupplierForm
          supplier={selectedSupplier}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowModal(false)
            setSelectedSupplier(null)
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSupplierToDelete(null)
        }}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{supplierToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteModal(false)
                setSupplierToDelete(null)
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
              {loading ? 'Deleting...' : 'Delete Supplier'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Supplier Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSupplierDetails(null)
        }}
        title="Supplier Details"
        size="lg"
      >
        {supplierDetails && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{supplierDetails.name}</h3>
                <p className="text-gray-600 mt-1">{supplierDetails.contact}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={20} className="text-yellow-500" fill="currentColor" />
                <span className="text-xl font-bold">{supplierDetails.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{supplierDetails.totalOrders}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">On-Time Delivery</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{supplierDetails.onTimeDelivery}%</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700 font-medium">Products</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{supplierDetails.products}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">Rating</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">{supplierDetails.rating}/5.0</p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <h4 className="font-semibold text-gray-900">Contact Information</h4>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail size={18} />
                <span>{supplierDetails.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone size={18} />
                <span>{supplierDetails.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin size={18} />
                <span>{supplierDetails.location}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  handleEditSupplier(supplierDetails)
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Edit Supplier
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

export default Suppliers
