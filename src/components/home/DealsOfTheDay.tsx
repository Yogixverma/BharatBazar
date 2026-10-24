import React, { useState, useEffect } from 'react';
import { Clock, ShoppingCart, Sparkles, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Product } from '../../types/ecommerce';

interface DealsOfTheDayProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAllDeals: () => void;
}

export const DealsOfTheDay: React.FC<DealsOfTheDayProps> = ({
  products,
  onSelectProduct,
  onViewAllDeals,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Simulated countdown timer for deals
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.isDealOfDay).slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-8">
      <div className="bg-white p-4 md:p-6 rounded-md shadow-sm border border-gray-200">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Today's Deals
            </h2>
            <div className="flex items-center gap-1.5 bg-red-50 text-red-700 font-bold text-xs px-2.5 py-1 rounded-md border border-red-200">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Ends in{' '}
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <button
            onClick={onViewAllDeals}
            className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline cursor-pointer text-left"
          >
            See all deals →
          </button>
        </div>

        {/* Deals Horizontal Scroll Shelf / Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {dealProducts.map((p, idx) => {
            const inWish = isInWishlist(p.id);
            const claimedPct = 45 + (idx * 11) % 45;

            return (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between p-2.5 rounded-md border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all bg-white"
              >
                {/* Wishlist Heart */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(p);
                  }}
                  className="absolute right-2 top-2 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-xs z-10 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                <div
                  onClick={() => onSelectProduct(p)}
                  className="cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-square w-full bg-gray-50 rounded-xs overflow-hidden mb-2 flex items-center justify-center p-2">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>

                  {/* Deal Badges */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="bg-[#cc0c39] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs">
                      {p.discountPercent}% off
                    </span>
                    <span className="text-[10px] font-bold text-[#cc0c39] uppercase tracking-wider">
                      Deal of the Day
                    </span>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-gray-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs text-gray-800 line-clamp-2 mt-1 font-medium group-hover:text-amber-800 leading-snug">
                    {p.title}
                  </h4>

                  {/* Claimed Progress Bar */}
                  <div className="mt-2 space-y-0.5">
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${claimedPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {claimedPct}% claimed
                    </span>
                  </div>
                </div>

                {/* Quick Add Button */}
                <div className="pt-2 mt-1">
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="w-full flex items-center justify-center gap-1 bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e49b38] py-1.5 px-2 rounded-md text-xs font-bold text-gray-900 shadow-2xs transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
