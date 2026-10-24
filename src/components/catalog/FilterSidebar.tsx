import React from 'react';
import { Star, RotateCcw, Check, ShieldCheck } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../data/mockProducts';
import { FilterState } from '../../types/ecommerce';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableBrands: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  availableBrands,
}) => {
  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handleBrandToggle = (brand: string) => {
    const updated = filters.brand.includes(brand)
      ? filters.brand.filter((b) => b !== brand)
      : [...filters.brand, brand];
    onFilterChange({ ...filters, brand: updated });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const resetFilters = () => {
    onFilterChange({
      category: 'All',
      brand: [],
      minPrice: 0,
      maxPrice: 150000,
      minRating: 0,
      inStockOnly: false,
      bharatAssuredOnly: false,
      sortBy: 'featured',
      searchQuery: '',
    });
  };

  return (
    <aside className="w-full lg:w-64 bg-white p-4 rounded-md border border-gray-200 shadow-2xs divide-y divide-gray-200 text-xs">
      {/* Top Header & Reset */}
      <div className="pb-3 flex items-center justify-between">
        <span className="font-bold text-gray-900 text-sm">Filters</span>
        <button
          onClick={resetFilters}
          className="text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear all</span>
        </button>
      </div>

      {/* BharatAssured Toggle */}
      <div className="py-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.bharatAssuredOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, bharatAssuredOnly: e.target.checked })
            }
            className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 border-gray-300 cursor-pointer"
          />
          <div className="flex items-center gap-1 text-[#007185] font-black">
            <ShieldCheck className="w-4 h-4 text-[#007185]" />
            <span>BharatAssured Only</span>
          </div>
        </label>
        <p className="text-[11px] text-gray-500 ml-6">
          Fast, verified delivery & hassle-free returns
        </p>
      </div>

      {/* Category Filter */}
      <div className="py-3">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Category
        </h4>
        <ul className="space-y-1.5">
          <li>
            <button
              onClick={() => handleCategoryChange('All')}
              className={`w-full text-left py-0.5 cursor-pointer flex items-center justify-between ${
                filters.category === 'All'
                  ? 'font-bold text-amber-700'
                  : 'text-gray-700 hover:text-amber-700'
              }`}
            >
              <span>All Categories</span>
              {filters.category === 'All' && <Check className="w-3.5 h-3.5" />}
            </button>
          </li>
          {INITIAL_CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => handleCategoryChange(cat.name)}
                className={`w-full text-left py-0.5 cursor-pointer flex items-center justify-between ${
                  filters.category === cat.name
                    ? 'font-bold text-amber-700'
                    : 'text-gray-700 hover:text-amber-700'
                }`}
              >
                <span>{cat.name}</span>
                {filters.category === cat.name && <Check className="w-3.5 h-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer Review Rating Filter */}
      <div className="py-3">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Customer Review
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => handleRatingChange(stars)}
              className={`w-full flex items-center gap-1.5 py-0.5 cursor-pointer text-left ${
                filters.minRating === stars ? 'font-bold text-amber-700' : 'text-gray-700'
              }`}
            >
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs">& Up</span>
              {filters.minRating === stars && <Check className="w-3.5 h-3.5 ml-auto text-amber-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="py-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
            Price Range
          </h4>
          <span className="font-bold text-gray-900">
            Up to ₹{filters.maxPrice.toLocaleString('en-IN')}
          </span>
        </div>

        <input
          type="range"
          min={100}
          max={150000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) =>
            onFilterChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full accent-amber-500 cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
          <span>₹100</span>
          <span>₹75,000</span>
          <span>₹1,50,000+</span>
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div className="py-3">
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">
          Brands
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.brand.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="rounded text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 border-gray-300"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="pt-3">
        <label className="flex items-center gap-2 cursor-pointer text-gray-700">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="rounded text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 border-gray-300"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
};
