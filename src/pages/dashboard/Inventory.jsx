import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Package2, Edit2, Trash2, ChevronDown, AlertTriangle, RefreshCw } from 'lucide-react'
import Modal from '../../components/common/Modal'
import ProductForm from '../../components/inventory/ProductForm'
import { 
  getStockStatus, 
  filterProducts, 
  sortProducts, 
  paginateProducts, 
  getTotalPages,
  calculateInventoryValue,
  getLowStockProducts 
} from '../../utils/inventoryUtils'
import { inventoryService } from '../../services/api'

const Inventory = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Laptop Pro 15', sku: 'ELE0001', category: 'Electronics', quantity: 120, price: 899.99, supplier: 'Tech Supplies Inc', reorderLevel: 50 },
    { id: 2, name: 'Wireless Mouse', sku: 'ELE0002', category: 'Electronics', quantity: 45, price: 29.99, supplier: 'Gadget World', reorderLevel: 100 },
    { id: 3, name: 'Office Chair', sku: 'HOM0001', category: 'Home & Garden', quantity: 0, price: 199.99, supplier: 'Furniture Plus', reorderLevel: 20 },
    { id: 4, name: 'Running Shoes', sku: 'SPO0001', category: 'Sports & Outdoors', quantity: 200, price: 89.99, supplier: 'Sports Direct', reorderLevel: 75 },
    { id: 5, name: 'Coffee Maker', sku: 'HOM0002', category: 'Home & Garden', quantity: 85, price: 79.99, supplier: 'Home Essentials', reorderLevel: 40 },
    { id: 6, name: 'Headphones', sku: 'ELE0003', category: 'Electronics', quantity: 15, price: 149.99, supplier: 'Audio Pro', reorderLevel: 30 },
    { id: 7, name: 'Yoga Mat', sku: 'SPO0002', category: 'Sports & Outdoors', quantity: 150, price: 34.99, supplier: 'Fitness World', reorderLevel: 60 },
    { id: 8, name: 'Smart Watch', sku: 'ELE0004', category: 'Electronics', quantity: 8, price: 299.99, supplier: 'Tech Supplies Inc', reorderLevel: 25 },
  ])
  
  const [filteredInventory, setFilteredInventory] = useState(inventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all'
  })
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const categories = ['all', 'Electronics', 'Clothing', 'Food & Beverages', 'Home & Garden', 'Sports & Outdoors', 'Books', 'Toys & Games', 'Health & Beauty', 'Other']
  const statuses = ['all', 'In Stock', 'Low Stock', 'Out of Stock']

  useEffect(() => {
    applyFiltersAndSort()
  }, [inventory, searchTerm, filters, sortBy, sortOrder])

  const applyFiltersAndSort = () => {
    let filtered = filterProducts(inventory, { ...filters, search: searchTerm })
    let sorted = sortProducts(filtered, sortBy, sortOrder)
    setFilteredInventory(sorted)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }
  const handleAddProduct = () => {
    setModalMode('add')
    setSelectedProduct(null)
    setShowModal(true)
  }

  const handleEditProduct = (product) => {
    setModalMode('edit')
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    try {
      // In real app: await inventoryService.delete(productToDelete.id)
      setInventory(inventory.filter(item => item.id !== productToDelete.id))
      setShowDeleteConfirm(false)
      setProductToDelete(null)
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (formData) => {
    setLoading(true)
    try {
      if (modalMode === 'add') {
        // In real app: const response = await inventoryService.create(formData)
        const newProduct = {
          ...formData,
          id: Math.max(...inventory.map(p => p.id), 0) + 1,
          quantity: formData.quantity
        }
        setInventory([...inventory, newProduct])
      } else {
        // In real app: await inventoryService.update(selectedProduct.id, formData)
        setInventory(inventory.map(item =>
          item.id === selectedProduct.id 
            ? { ...item, ...formData, quantity: formData.quantity }
            : item
        ))
      }
      setShowModal(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Failed to save product:', error)
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  const totalPages = getTotalPages(filteredInventory.length, itemsPerPage)
  const paginatedInventory = paginateProducts(filteredInventory, currentPage, itemsPerPage)

  // Stats
  const totalValue = calculateInventoryValue(inventory)
  const lowStockCount = getLowStockProducts(inventory).length
  const outOfStockCount = inventory.filter(p => p.quantity === 0).length
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <button 
          onClick={handleAddProduct}
          className="btn-primary flex items-center space-x-2 px-4 py-2"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold mt-1">{inventory.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold mt-1 text-green-600">${totalValue.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Low Stock Items</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{lowStockCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold mt-1 text-red-600">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || filters.category !== 'all' || filters.status !== 'all') && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{searchTerm}"
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Category: {filters.category}
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Status: {filters.status}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setFilters({ category: 'all', status: 'all' })
              }}
              className="text-xs text-primary hover:text-blue-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Inventory Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Product</span>
                    {sortBy === 'name' && (
                      <ChevronDown size={14} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('sku')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU</span>
                    {sortBy === 'sku' && (
                      <ChevronDown size={14} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('category')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    {sortBy === 'category' && (
                      <ChevronDown size={14} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('quantity')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Stock</span>
                    {sortBy === 'quantity' && (
                      <ChevronDown size={14} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('price')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Price</span>
                    {sortBy === 'price' && (
                      <ChevronDown size={14} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('supplier')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Supplier</span>
                    {sortBy === 'supplier' && (
                      <ChevronDown size={14} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedInventory.length > 0 ? (
                paginatedInventory.map((item) => {
                  const stockStatus = getStockStatus(item.quantity, item.reorderLevel)
                  const isLowStock = item.quantity > 0 && item.quantity <= item.reorderLevel
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                            <Package2 size={20} className="text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {item.name}
                              {isLowStock && (
                                <AlertTriangle size={14} className="ml-2 text-yellow-500" title="Low Stock Alert" />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{item.quantity} units</div>
                        {item.reorderLevel && (
                          <div className="text-xs text-gray-500">Reorder at: {item.reorderLevel}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.bgColor} ${stockStatus.textColor}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditProduct(item)}
                            className="text-primary hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <Package2 size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>No products found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredInventory.length > itemsPerPage && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredInventory.length)}
              </span> of{' '}
              <span className="font-medium">{filteredInventory.length}</span> products
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedProduct(null)
        }}
        title={modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
        size="lg"
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false)
            setSelectedProduct(null)
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setProductToDelete(null)
        }}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
          </div>
          <p className="text-center text-gray-700">
            Are you sure you want to delete <strong>{productToDelete?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={() => {
                setShowDeleteConfirm(false)
                setProductToDelete(null)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Inventory
