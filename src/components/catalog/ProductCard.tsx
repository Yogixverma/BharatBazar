import React from 'react';
import { Star, Heart, ShoppingCart, Check, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Product } from '../../types/ecommerce';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  viewMode = 'grid',
}) => {
  const { addToCart, items } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);
  const cartItem = items.find((i) => i.product.id === product.id);
  const isOutOfStock = product.stock <= 0;

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white p-4 rounded-md border border-gray-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4">
        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute right-3 top-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-xs z-10 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Image */}
        <div
          onClick={() => onSelect(product)}
          className="w-full sm:w-48 h-48 bg-gray-50 rounded-md overflow-hidden shrink-0 flex items-center justify-center p-3 cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div onClick={() => onSelect(product)} className="cursor-pointer">
            {product.isBestSeller && (
              <span className="inline-block bg-[#e67a00] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-xs uppercase tracking-wider mb-1">
                #1 Best Seller
              </span>
            )}
            {product.isDealOfDay && (
              <span className="inline-block ml-1 bg-[#cc0c39] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-xs uppercase tracking-wider mb-1">
                Limited Time Deal
              </span>
            )}

            <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-800 line-clamp-2 leading-snug">
              {product.title}
            </h3>

            {/* Ratings */}
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-600">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount.toLocaleString('en-IN')})</span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">{product.brand}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400 line-through">
                M.R.P.: ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-green-700">
                ({product.discountPercent}% off)
              </span>
            </div>

            {/* Delivery & Assurance */}
            <div className="mt-2 text-xs text-gray-600 flex flex-wrap items-center gap-2">
              <span>
                Get it by <span className="font-bold text-gray-900">Tomorrow</span>
              </span>
              <span>•</span>
              <span className="text-green-700 font-medium">FREE Delivery over ₹499</span>
              {product.isBharatAssured && (
                <span className="text-[11px] font-black text-[#007185] bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100 flex items-center gap-0.5">
                  <Check className="w-3 h-3 text-[#007185]" /> BharatAssured
                </span>
              )}
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <div className="mt-1 text-xs font-bold text-red-600">
                Only {product.stock} left in stock - order soon!
              </div>
            )}
          </div>

          {/* Action */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-md font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e49b38] text-gray-900'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of Stock' : cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}</span>
            </button>
            <button
              onClick={() => onSelect(product)}
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              View Specifications →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid Card View (Default)
  return (
    <div className="group relative bg-white p-3 rounded-md border border-gray-200 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between">
      {/* Wishlist Heart */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute right-2 top-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-xs z-10 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Wishlist"
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      <div onClick={() => onSelect(product)} className="cursor-pointer">
        {/* Badges */}
        <div className="min-h-5 mb-1 flex items-center gap-1">
          {product.isBestSeller && (
            <span className="bg-[#e67a00] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
              #1 Best Seller
            </span>
          )}
          {product.isDealOfDay && (
            <span className="bg-[#cc0c39] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-xs uppercase tracking-wider">
              Deal
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="aspect-square w-full bg-gray-50 rounded-xs overflow-hidden mb-2.5 flex items-center justify-center p-2.5">
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>

        {/* Title */}
        <h3 className="text-xs font-medium text-gray-900 group-hover:text-amber-800 line-clamp-2 leading-snug">
          {product.title}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-600">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-gray-800">{product.rating}</span>
          <span className="text-gray-400 text-[10px]">
            ({product.reviewCount.toLocaleString('en-IN')})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-base font-black text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{product.mrp.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] font-bold text-green-700">
            {product.discountPercent}% off
          </span>
        </div>

        {/* Delivery speed & Assurance */}
        <div className="text-[11px] text-gray-500 mt-1">
          Get it by <span className="font-bold text-gray-800">Tomorrow</span>
        </div>
        {product.isBharatAssured && (
          <span className="inline-block mt-0.5 text-[10px] font-black text-[#007185] bg-cyan-50 px-1 py-0.2 rounded border border-cyan-100">
            ✓ BharatAssured
          </span>
        )}

        {/* Low Stock Warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="text-[10px] text-red-600 font-bold mt-1">
            Only {product.stock} left in stock!
          </div>
        )}
      </div>

      {/* Add to Cart button */}
      <div className="pt-2 mt-2">
        <button
          onClick={() => addToCart(product, 1)}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-bold shadow-2xs transition-colors cursor-pointer ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e49b38] text-gray-900'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>{isOutOfStock ? 'Out of Stock' : cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};
