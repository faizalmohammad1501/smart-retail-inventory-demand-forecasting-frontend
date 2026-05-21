import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

const ProductForm = ({ product, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: '',
    price: '',
    supplier: '',
    reorderLevel: '',
    description: ''
  })
  
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        quantity: product.quantity || product.stock || '',
        price: product.price || '',
        supplier: product.supplier || '',
        reorderLevel: product.reorderLevel || 20,
        description: product.description || ''
      })
    }
  }, [product])

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Toys & Games',
    'Health & Beauty',
    'Other'
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required'
    } else if (formData.sku.length < 3) {
      newErrors.sku = 'SKU must be at least 3 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.quantity || formData.quantity < 0) {
      newErrors.quantity = 'Valid quantity is required'
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required'
    }

    if (!formData.reorderLevel || formData.reorderLevel < 0) {
      newErrors.reorderLevel = 'Valid reorder level is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        reorderLevel: parseInt(formData.reorderLevel)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.sku ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="e.g., SKU001"
          />
          {errors.sku && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.sku}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            className={`w-full px-3 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Enter quantity"
          />
          {errors.quantity && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.quantity}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.price}
            </p>
          )}
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.supplier ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Enter supplier name"
          />
          {errors.supplier && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.supplier}
            </p>
          )}
        </div>

        {/* Reorder Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reorder Level <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            min="0"
            className={`w-full px-3 py-2 border ${errors.reorderLevel ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent`}
            placeholder="Minimum stock level"
          />
          {errors.reorderLevel && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.reorderLevel}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter product description (optional)"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
