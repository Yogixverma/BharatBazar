import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Product } from '../../types/ecommerce';

interface BestSellersShelfProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  title?: string;
  categoryTag?: string;
}

export const BestSellersShelf: React.FC<BestSellersShelfProps> = ({
  products,
  onSelectProduct,
  title = 'Best Sellers in India',
  categoryTag = 'Electronics & Essentials',
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-8">
      <div className="bg-white p-4 md:p-6 rounded-md shadow-sm border border-gray-200 relative group/shelf">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                #1 Ranked
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Most popular customer choices in {categoryTag}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 overflow-x-auto scrollbar-none py-2 scroll-smooth"
        >
          {bestSellers.map((p, index) => {
            const inWish = isInWishlist(p.id);

            return (
              <div
                key={p.id}
                className="w-56 shrink-0 flex flex-col justify-between p-3 rounded-md border border-gray-100 hover:border-amber-300 hover:shadow-md transition-all bg-white relative group"
              >
                {/* Best Seller Rank Ribbon */}
                <div className="absolute -top-1 left-2 bg-[#e67a00] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-b-xs shadow-xs uppercase">
                  #{index + 1} Best Seller
                </div>

                {/* Wishlist Button */}
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
                  className="cursor-pointer pt-3"
                >
                  {/* Image */}
                  <div className="aspect-square w-full bg-gray-50 rounded-xs overflow-hidden mb-2.5 flex items-center justify-center p-2">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h4 className="text-xs text-gray-800 line-clamp-2 font-medium group-hover:text-amber-800 leading-snug">
                    {p.title}
                  </h4>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-600">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(p.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-700">{p.rating}</span>
                    <span className="text-gray-400">({p.reviewCount.toLocaleString('en-IN')})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-base font-black text-gray-900">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{p.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-bold text-green-700">
                      {p.discountPercent}% off
                    </span>
                  </div>

                  {/* Delivery Tag */}
                  <div className="text-[11px] text-gray-500 mt-1">
                    Get it by <span className="font-bold text-gray-800">Tomorrow</span>
                  </div>
                  {p.isBharatAssured && (
                    <span className="inline-block mt-0.5 text-[10px] font-black tracking-tight text-[#007185] bg-cyan-50 px-1 py-0.2 rounded border border-cyan-100">
                      ✓ BharatAssured
                    </span>
                  )}
                </div>

                {/* Add to Cart button */}
                <div className="pt-2 mt-2">
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
