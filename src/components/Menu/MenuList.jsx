import React, { useState, useEffect } from 'react';
import api from '../../Services/api';
import MenuItemCard from './MenuItemCard';
import MenuForm from './MenuForm';
import toast from 'react-hot-toast';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/* ── Skeleton Grid ── */
const MenuSkeleton = () => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="skeleton h-7 w-48 rounded-lg mb-2" />
        <div className="skeleton h-4 w-64 rounded" />
      </div>
      <div className="skeleton h-9 w-36 rounded-lg" />
    </div>
    <div className="skeleton h-16 w-full rounded-xl mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="skeleton h-44 w-full" style={{ borderRadius: 0 }} />
          <div className="p-4 space-y-2.5">
            <div className="skeleton h-5 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState({ category: 'all', search: '', availability: 'all' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [menuRes, categoriesRes] = await Promise.all([
        api.get('/menu'),
        api.get('/categories'),
      ]);
      setMenuItems(Array.isArray(menuRes.data) ? menuRes.data : menuRes.data.data || []);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.data || []);
    } catch {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/menu/${id}`);
      toast.success('Menu item deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete menu item');
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      await api.patch(`/menu/${id}/toggle`);
      toast.success('Availability updated');
      fetchData();
    } catch {
      toast.error('Failed to update availability');
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory    = filter.category     === 'all' || item.category_id === parseInt(filter.category);
    const matchesSearch      = (item.name || '').toLowerCase().includes((filter.search || '').toLowerCase());
    const matchesAvailability =
      filter.availability === 'all' ||
      (filter.availability === 'available'   &&  item.is_available) ||
      (filter.availability === 'unavailable' && !item.is_available);
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  if (loading) return <div className="p-6 max-w-7xl mx-auto"><MenuSkeleton /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-wrap justify-between items-start gap-4 fade-in-up">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#800000' }}>Menu Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Managing <span className="font-semibold" style={{ color: '#800000' }}>{menuItems.length}</span> menu item{menuItems.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Menu Item
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name…"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="input-primary pl-9"
            />
          </div>
          {/* Category */}
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="input-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {/* Availability */}
          <select
            value={filter.availability}
            onChange={(e) => setFilter({ ...filter, availability: e.target.value })}
            className="input-primary"
          >
            <option value="all">All Items</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {filter.search || filter.category !== 'all' || filter.availability !== 'all' ? (
        <p className="text-sm text-gray-500 mb-4">
          Showing <span className="font-semibold text-gray-700">{filteredItems.length}</span> of {menuItems.length} items
        </p>
      ) : null}

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="card p-16 text-center fade-in-up">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-gray-500 font-medium">No items found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, i) => (
            <div key={item.id} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <MenuItemCard
                item={item}
                onEdit={() => { setEditingItem(item); setShowForm(true); }}
                onDelete={() => handleDelete(item.id)}
                onToggleAvailability={() => handleToggleAvailability(item.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Menu Form Modal */}
      {showForm && (
        <MenuForm
          item={editingItem}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingItem(null); }}
          onSuccess={() => { setShowForm(false); setEditingItem(null); fetchData(); }}
        />
      )}
    </div>
  );
};

export default MenuList;