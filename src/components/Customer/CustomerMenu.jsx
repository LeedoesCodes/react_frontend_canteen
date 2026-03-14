import React, { useState, useEffect } from 'react';
import api from '../../Services/api';
import { MagnifyingGlassIcon, TagIcon } from '@heroicons/react/24/outline';

/* ── Skeleton ── */
const MenuSkeleton = () => (
  <div className="p-6 max-w-7xl mx-auto animate-pulse">
    <div className="skeleton h-9 w-32 rounded mb-1" />
    <div className="skeleton h-4 w-56 rounded mb-6" />
    <div className="flex gap-3 mb-6">
      <div className="skeleton h-10 flex-1 rounded-xl" />
      <div className="skeleton h-10 w-44 rounded-xl" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card overflow-hidden" style={{ animationDelay: `${i * 40}ms` }}>
          <div className="skeleton h-44 w-full" style={{ borderRadius: 0 }} />
          <div className="p-3 space-y-2">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-5/6 rounded" />
            <div className="skeleton h-5 w-20 rounded-full mt-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Menu Item Card ── */
const MenuItemCard = ({ item, imageError, onImageError, formatPrice }) => (
  <div className="card overflow-hidden hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group">
    <div className="relative h-44 overflow-hidden">
      {!imageError ? (
        <img
          src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'F')}&background=800000&color=fff&size=400&bold=true&font-size=0.4`}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => onImageError(item.id)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #800000, #9B1C1C)' }}>
          <span className="text-5xl font-bold text-white/80">{item.name?.charAt(0) || '🍽'}</span>
        </div>
      )}
      {/* Price badge */}
      <div className="absolute top-2 right-2">
        <span className="px-2.5 py-1 rounded-full text-sm font-bold text-white shadow"
          style={{ background: 'rgba(128,0,0,0.9)', backdropFilter: 'blur(4px)' }}>
          ₱{formatPrice(item.price)}
        </span>
      </div>
      {/* Low stock warning */}
      {item.stock_quantity <= item.low_stock_threshold && item.stock_quantity > 0 && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-orange-500/90 backdrop-blur-sm">
            Only {item.stock_quantity} left!
          </span>
        </div>
      )}
    </div>
    <div className="p-3.5">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h3>
        <span className="shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: '#FEF2F2', color: '#800000' }}>
          <TagIcon className="h-2.5 w-2.5" />
          {item.category?.name || 'Food'}
        </span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
    </div>
  </div>
);

const CustomerMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [error, setError] = useState(null);

  const formatPrice = (price) => (parseFloat(price) || 0).toFixed(2);
  const handleImageError = (itemId) => setImageErrors(prev => ({ ...prev, [itemId]: true }));

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          api.get('/menu'),
          api.get('/categories'),
        ]);
        const menuData = menuRes.data?.data || menuRes.data || [];
        setMenuItems(Array.isArray(menuData) ? menuData : []);

        let categoriesData = [];
        if (Array.isArray(catRes.data)) categoriesData = catRes.data;
        else if (Array.isArray(catRes.data?.data)) categoriesData = catRes.data.data;
        else if (catRes.data && typeof catRes.data === 'object') categoriesData = Object.values(catRes.data);
        setCategories(categoriesData);
      } catch {
        setError('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredItems = menuItems.filter(item => {
    if (!item) return false;
    const matchesCategory = selectedCategory === 'all' || item.category_id === parseInt(selectedCategory);
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.is_available;
  });

  if (loading) return <MenuSkeleton />;

  if (error) return (
    <div className="p-8 text-center">
      <div className="card p-8 max-w-md mx-auto">
        <span className="text-5xl block mb-3">⚠️</span>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#800000' }}>Error Loading Menu</h2>
        <p className="text-gray-600 mb-4 text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 fade-in-up">
        <h1 className="text-2xl font-bold" style={{ color: '#800000' }}>Our Menu 🍽️</h1>
        <p className="text-gray-500 text-sm mt-0.5">Browse our delicious meals and beverages</p>
      </div>

      {/* Search & Filter */}
      <div className="card p-3.5 mb-6 fade-in-up">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search menu items…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-primary pl-9"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-primary sm:w-52"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      {(searchTerm || selectedCategory !== 'all') && (
        <p className="text-sm text-gray-500 mb-4">
          Showing <span className="font-semibold text-gray-700">{filteredItems.length}</span> item{filteredItems.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="card p-16 text-center fade-in-up">
          <span className="text-6xl block mb-3">🔍</span>
          <p className="text-gray-500 font-medium">No items found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, i) => (
            <div key={item.id} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <MenuItemCard
                item={item}
                imageError={imageErrors[item.id]}
                onImageError={handleImageError}
                formatPrice={formatPrice}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;