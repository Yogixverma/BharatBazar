import React from 'react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { Product } from '../../types/ecommerce';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  onExploreProducts: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onSelectProduct,
  onExploreProducts,
}) => {
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Wishlist is Empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Save items that you like by clicking the heart icon on any product. Revisit them
            anytime and move them to your cart in one click.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreProducts}
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm shadow-xs cursor-pointer"
            >
              Discover Products →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <span>Your Wishlist</span>
            </h1>
            <span className="text-xs text-gray-500">
              {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved
            </span>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
          >
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => onSelectProduct(product)}
                  className="aspect-square bg-gray-50 rounded-md overflow-hidden mb-3 flex items-center justify-center p-2 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3
                  onClick={() => onSelectProduct(product)}
                  className="text-xs font-semibold text-gray-900 line-clamp-2 hover:text-amber-800 cursor-pointer"
                >
                  {product.title}
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base font-black text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => moveToCart(product)}
                  className="w-full bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold py-1.5 px-3 rounded-md text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-600 font-medium py-1 px-3 rounded-md text-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
