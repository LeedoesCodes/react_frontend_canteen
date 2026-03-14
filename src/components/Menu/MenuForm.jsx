import React, { useState } from 'react';
import api from '../../Services/api';
import toast from 'react-hot-toast';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

const MenuForm = ({ item, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category_id: item?.category_id || '',
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    stock_quantity: item?.stock_quantity || '',
    low_stock_threshold: item?.low_stock_threshold || 5,
    image: item?.image || '',
    is_available: item?.is_available ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock_quantity === '' || formData.stock_quantity < 0) newErrors.stock_quantity = 'Stock quantity must be 0 or greater';
    if (!formData.low_stock_threshold || formData.low_stock_threshold < 1) newErrors.low_stock_threshold = 'Threshold must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (item) {
        await api.put(`/menu/${item.id}`, formData);
        toast.success('Menu item updated successfully');
      } else {
        await api.post('/menu', formData);
        toast.success('Menu item created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUrlChange = (e) => {
    setFormData({ ...formData, image: e.target.value });
    setImagePreviewError(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-6"
      style={{ background: 'rgba(0,0,0,0.65)' }}
    >
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-2xl"
        style={{ background: '#ffffff' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {item ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {item ? 'Update the details below' : 'Fill in the details to add a new item'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className={`input-primary ${errors.category_id ? 'border-red-400' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`input-primary ${errors.name ? 'border-red-400' : ''}`}
                placeholder="Enter item name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₱) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`input-primary ${errors.price ? 'border-red-400' : ''}`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className={`input-primary ${errors.stock_quantity ? 'border-red-400' : ''}`}
                placeholder="0"
              />
              {errors.stock_quantity && <p className="mt-1 text-xs text-red-500">{errors.stock_quantity}</p>}
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Low Stock Threshold <span className="text-red-500">*</span></label>
              <input
                type="number"
                min="1"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                className={`input-primary ${errors.low_stock_threshold ? 'border-red-400' : ''}`}
                placeholder="5"
              />
              {errors.low_stock_threshold && <p className="mt-1 text-xs text-red-500">{errors.low_stock_threshold}</p>}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={handleImageUrlChange}
                className="input-primary"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-400 mt-1">Paste a direct link to an image</p>
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 160 }}>
              {!imagePreviewError ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreviewError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: '#f9fafb' }}>
                  <PhotoIcon className="h-8 w-8 text-gray-300" />
                  <p className="text-xs text-gray-400">Could not load image — check the URL</p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-primary resize-none"
              placeholder="Enter item description"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="h-4 w-4 rounded"
              style={{ accentColor: '#800000' }}
            />
            <label htmlFor="is_available" className="text-sm font-medium text-gray-700 cursor-pointer">
              Available for sale
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving…
                </span>
              ) : item ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuForm;