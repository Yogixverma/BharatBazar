import React from 'react';
import { LayoutGrid, List, X } from 'lucide-react';
import { FilterState } from '../../types/ecommerce';

interface SortAndSearchBarProps {
  totalCount: number;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const SortAndSearchBar: React.FC<SortAndSearchBarProps> = ({
  totalCount,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) => {
  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    onFilterChange({ ...filters, sortBy });
  };

  const removeBrandFilter = (brandName: string) => {
    onFilterChange({
      ...filters,
      brand: filters.brand.filter((b) => b !== brandName),
    });
  };

  const clearCategory = () => {
    onFilterChange({ ...filters, category: 'All' });
  };

  const clearSearch = () => {
    onFilterChange({ ...filters, searchQuery: '' });
  };

  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.brand.length > 0 ||
    filters.minRating > 0 ||
    filters.bharatAssuredOnly ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white p-3 rounded-md border border-gray-200 shadow-2xs mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Results summary */}
        <div className="text-gray-700">
          Showing <span className="font-bold text-gray-900">{totalCount}</span> results
          {filters.searchQuery && (
            <span>
              {' '}
              for "<span className="font-bold text-amber-800">{filters.searchQuery}</span>"
            </span>
          )}
          {filters.category !== 'All' && (
            <span>
              {' '}
              in <span className="font-bold text-gray-900">{filters.category}</span>
            </span>
          )}
        </div>

        {/* Controls: Sort + View Mode */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <label className="text-gray-500 font-medium">Sort by:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="rounded-md border border-gray-300 bg-gray-50 px-2 py-1 text-xs text-gray-800 focus:border-amber-500 focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="avg_rating">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center rounded-md border border-gray-300 p-0.5 bg-gray-50">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1 rounded cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-amber-600' : 'text-gray-500'
              }`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`p-1 rounded cursor-pointer ${
                viewMode === 'list' ? 'bg-white shadow-xs text-amber-600' : 'text-gray-500'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-gray-100 text-[11px]">
          <span className="text-gray-500 font-semibold">Active:</span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
              Query: {filters.searchQuery}
              <button onClick={clearSearch} className="cursor-pointer hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded-full">
              {filters.category}
              <button onClick={clearCategory} className="cursor-pointer hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.brand.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded-full"
            >
              Brand: {b}
              <button onClick={() => removeBrandFilter(b)} className="cursor-pointer hover:text-red-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
              {filters.minRating}★ & above
              <button
                onClick={() => onFilterChange({ ...filters, minRating: 0 })}
                className="cursor-pointer hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.bharatAssuredOnly && (
            <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-900 border border-cyan-200 px-2 py-0.5 rounded-full">
              BharatAssured
              <button
                onClick={() => onFilterChange({ ...filters, bharatAssuredOnly: false })}
                className="cursor-pointer hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
