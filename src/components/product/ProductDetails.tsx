import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Heart,
  ShoppingCart,
  Zap,
  MapPin,
  ChevronRight,
  Share2,
  Check,
  Tag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { useWishlist } from '../../context/WishlistContext';
import { Product } from '../../types/ecommerce';
import { CustomerReviews } from './CustomerReviews';

interface ProductDetailsProps {
  product: Product;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateToCategory: (category: string) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  relatedProducts,
  onSelectProduct,
  onNavigateToCategory,
  onProceedToCheckout,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { location, setIsModalOpen, getEstimatedDelivery } = useLocation();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const inWish = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const maxQty = Math.min(product.stock, 10);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onProceedToCheckout();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const emiAmount = Math.round(product.price / 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 overflow-x-auto">
        <button
          onClick={() => onNavigateToCategory('All')}
          className="hover:text-amber-700 hover:underline cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <button
          onClick={() => onNavigateToCategory(product.category)}
          className="hover:text-amber-700 hover:underline cursor-pointer"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-800 font-medium truncate max-w-xs">{product.brand}</span>
      </nav>

      {/* Main Grid: Gallery | Details | Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 md:p-6 rounded-md shadow-2xs border border-gray-200">
        {/* Left Column: Image Gallery (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails strip */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[460px] scrollbar-none">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 rounded-md overflow-hidden border p-1 bg-gray-50 shrink-0 transition-colors cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-amber-500 ring-2 ring-amber-400/40'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="flex-1 relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-4">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />

            {/* Share link button */}
            <button
              onClick={handleShare}
              className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-xs border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              title="Share product"
              aria-label="Share product"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Center Column: Product Information (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-xs font-semibold text-[#007185] hover:underline cursor-pointer">
              Brand: {product.brand}
            </span>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 mt-1 leading-snug">
              {product.title}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-[#007185] hover:underline cursor-pointer">
                {product.reviewCount.toLocaleString('en-IN')} ratings
              </span>
              {product.isBestSeller && (
                <span className="bg-[#e67a00] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-xs uppercase">
                  #1 Best Seller
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-3 space-y-1">
            {/* Price block */}
            <div className="flex items-baseline gap-2">
              <span className="text-red-700 text-xs font-bold uppercase tracking-wider">
                -{product.discountPercent}%
              </span>
              <span className="text-3xl font-black text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              M.R.P.:{' '}
              <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-xs font-medium text-gray-700">
              Inclusive of all taxes
            </div>
            <div className="text-xs text-gray-600 pt-1">
              <span className="font-semibold text-gray-800">EMI</span> starts at ₹
              {emiAmount.toLocaleString('en-IN')} / month. No Cost EMI available.
            </div>
          </div>

          {/* Bank Offers Box */}
          <div className="rounded-md border border-amber-200 bg-amber-50/50 p-3 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Available Offers & Promotions</span>
            </div>
            <div className="space-y-1.5 text-gray-700 text-[11px]">
              <p>
                • <span className="font-semibold text-gray-900">Bank Offer:</span> Instant 10%
                discount up to ₹1,500 on HDFC & ICICI Credit Cards on orders above ₹4,999.
              </p>
              <p>
                • <span className="font-semibold text-gray-900">BharatPay UPI:</span> Get flat ₹50
                cashback on your first UPI transaction.
              </p>
              <p>
                • <span className="font-semibold text-gray-900">No Cost EMI:</span> Avail 0% interest
                on major credit cards for 3 or 6 months.
              </p>
            </div>
          </div>

          {/* Guarantees row */}
          <div className="grid grid-cols-3 gap-2 py-2 text-center text-[11px] text-gray-600">
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
              <Truck className="w-5 h-5 text-[#007185]" />
              <span>Fast BharatAssured Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
              <RotateCcw className="w-5 h-5 text-[#007185]" />
              <span>7 Days Returnable</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded">
              <ShieldCheck className="w-5 h-5 text-[#007185]" />
              <span>1 Year Warranty</span>
            </div>
          </div>

          {/* About this item */}
          <div className="pt-2">
            <h3 className="font-bold text-gray-900 text-sm mb-2">About this item</h3>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              {product.description}
            </p>

            {/* Specifications table */}
            <div className="border border-gray-200 rounded-md overflow-hidden text-xs">
              <table className="w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-3 py-1.5 font-semibold text-gray-600 bg-gray-50 w-1/3">
                        {key}
                      </td>
                      <td className="px-3 py-1.5 text-gray-800">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Buy Box (3 cols on lg) */}
        <div className="lg:col-span-3">
          <div className="border border-gray-300 rounded-lg p-4 space-y-4 shadow-sm bg-white sticky top-24 text-xs">
            {/* Price in Buy Box */}
            <div>
              <div className="text-2xl font-black text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <div className="text-gray-500 text-[11px] line-through">
                M.R.P.: ₹{product.mrp.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Pincode & Delivery info */}
            <div className="space-y-1 text-gray-700">
              <div className="flex items-center gap-1 font-semibold text-green-700">
                <Truck className="w-4 h-4 text-green-700 shrink-0" />
                <span>FREE Delivery by {getEstimatedDelivery(product.deliveryDays || 1)}</span>
              </div>
              <div className="flex items-start gap-1 text-[11px] text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                <span>
                  Delivering to <strong className="text-gray-800">{location.city} {location.pincode}</strong> -{' '}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#007185] hover:underline font-semibold cursor-pointer"
                  >
                    Change
                  </button>
                </span>
              </div>
            </div>

            {/* Stock status */}
            <div>
              {isOutOfStock ? (
                <div className="text-red-600 font-bold text-sm">Currently Unavailable</div>
              ) : (
                <div>
                  <div className="text-green-700 font-bold text-base">In Stock</div>
                  {product.stock <= 5 && (
                    <div className="text-red-600 font-bold text-xs mt-0.5">
                      Only {product.stock} left in stock - order soon!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-2">
                <label className="font-semibold text-gray-700">Quantity:</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1 font-bold text-gray-900 focus:border-amber-500 focus:outline-hidden cursor-pointer"
                >
                  {[...Array(maxQty)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] py-2.5 px-4 rounded-full font-bold text-gray-900 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07b00] py-2.5 px-4 rounded-full font-bold text-gray-900 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Wishlist Add */}
            <button
              onClick={() => toggleWishlist(product)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-md font-semibold text-gray-700 cursor-pointer transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{inWish ? 'Added to Wishlist' : 'Add to Wishlist'}</span>
            </button>

            {/* Seller & Dispatch Details */}
            <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="text-gray-800 font-medium">Secure transaction</span>
              </div>
              <div className="flex justify-between">
                <span>Ships from:</span>
                <span className="text-gray-800 font-medium">BharatBazaar Hub</span>
              </div>
              <div className="flex justify-between">
                <span>Sold by:</span>
                <span className="text-[#007185] font-medium hover:underline cursor-pointer">
                  {product.brand} Official Store
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="mt-8 bg-white p-4 md:p-6 rounded-md shadow-2xs border border-gray-200">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
            Customers who viewed this item also viewed
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {relatedProducts.slice(0, 6).map((rp) => (
              <div
                key={rp.id}
                onClick={() => onSelectProduct(rp)}
                className="p-2.5 rounded-md border border-gray-100 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full bg-gray-50 rounded-xs overflow-hidden mb-2 flex items-center justify-center p-2">
                    <img
                      src={rp.images[0]}
                      alt={rp.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h4 className="text-xs text-gray-800 line-clamp-2 font-medium hover:text-amber-800">
                    {rp.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-gray-700">{rp.rating}</span>
                  </div>
                </div>
                <div className="mt-1 font-black text-sm text-gray-900">
                  ₹{rp.price.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <CustomerReviews
        productId={product.id}
        productTitle={product.title}
        initialRating={product.rating}
        initialReviewCount={product.reviewCount}
      />
    </div>
  );
};
