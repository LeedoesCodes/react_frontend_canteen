import React from 'react';
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const MenuItemCard = ({ item, onEdit, onDelete, onToggleAvailability }) => {
  const isLowStock = Number(item.stock_quantity || 0) <= Number(item.low_stock_threshold || 0);

  return (
    <div className="card overflow-hidden group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'Item')}&background=800000&color=fff&size=400&bold=true&font-size=0.4`}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'F')}&background=800000&color=fff&size=400&bold=true&font-size=0.4`;
          }}
        />
        {/* Price badge overlay */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-sm font-bold text-white shadow-md"
            style={{ background: 'rgba(128,0,0,0.90)', backdropFilter: 'blur(4px)' }}>
            ₱{Number(item.price || 0).toFixed(2)}
          </span>
        </div>
        {/* Availability badge */}
        <div className="absolute top-3 left-3">
          {item.is_available ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-green-600/80 backdrop-blur-sm">Available</span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-gray-600/80 backdrop-blur-sm">Unavailable</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-base font-bold text-gray-900 leading-tight">{item.name}</h3>
          <p className="text-xs text-gray-400 font-medium">{item.category?.name || 'Uncategorized'}</p>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

        {/* Stock info */}
        <div className="space-y-1.5 mb-3 p-3 rounded-lg" style={{ background: '#f9fafb' }}>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Stock</span>
            <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {Number(item.stock_quantity || 0)} units
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (item.stock_quantity / Math.max(item.low_stock_threshold, 1)) * 100)}%`,
                background: isLowStock ? '#dc2626' : '#16a34a'
              }}
            />
          </div>
          {isLowStock && item.is_available && (
            <p className="text-[11px] font-semibold text-red-600">⚠️ Low stock — restock soon</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            onClick={onToggleAvailability}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            style={item.is_available
              ? { background: '#fee2e2', color: '#b91c1c' }
              : { background: '#dcfce7', color: '#15803d' }
            }
          >
            {item.is_available ? (
              <><XCircleIcon className="h-3.5 w-3.5" /> Deactivate</>
            ) : (
              <><CheckCircleIcon className="h-3.5 w-3.5" /> Activate</>
            )}
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="p-2 rounded-full transition-all hover:bg-blue-50"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4 text-blue-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-full transition-all hover:bg-red-50"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;