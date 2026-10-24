import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/ecommerce';

interface RecentlyViewedShelfProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onClearHistory: () => void;
}

export const RecentlyViewedShelf: React.FC<RecentlyViewedShelfProps> = ({
  products,
  onSelectProduct,
  onClearHistory,
}) => {
  const { addToCart } = useCart();

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-8 mb-6">
      <div className="bg-white p-4 md:p-6 rounded-md shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              Your Recently Viewed Items
            </h3>
            <p className="text-xs text-gray-500">Pick up where you left off</p>
          </div>
          <button
            onClick={onClearHistory}
            className="text-xs text-gray-500 hover:text-red-600 hover:underline cursor-pointer"
          >
            Clear browsing history
          </button>
        </div>

        <div className="flex items-stretch gap-4 overflow-x-auto scrollbar-none py-1">
          {products.slice(0, 8).map((p) => (
            <div
              key={p.id}
              className="w-44 shrink-0 p-2.5 rounded-md border border-gray-100 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div
                onClick={() => onSelectProduct(p)}
                className="cursor-pointer"
              >
                <div className="aspect-square w-full bg-gray-50 rounded-xs overflow-hidden mb-2 flex items-center justify-center p-2">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-xs text-gray-800 line-clamp-2 font-medium hover:text-amber-800">
                  {p.title}
                </h4>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-black text-gray-900">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-gray-400 line-through">
                    ₹{p.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => addToCart(p, 1)}
                className="w-full mt-2 bg-amber-300 hover:bg-amber-400 text-gray-900 py-1 px-2 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingCart className="w-3 h-3" /> Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
