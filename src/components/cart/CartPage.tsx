import React, { useState } from 'react';
import {
  Trash2,
  Bookmark,
  ShieldCheck,
  CheckCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
  Tag,
  X,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types/ecommerce';

interface CartPageProps {
  onNavigateToCheckout: () => void;
  onSelectProduct: (product: Product) => void;
  onExploreDeals: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigateToCheckout,
  onSelectProduct,
  onExploreDeals,
}) => {
  const {
    items,
    savedForLater,
    itemCount,
    subtotal,
    deliveryCharge,
    discount,
    appliedCoupon,
    finalTotal,
    amountNeededForFreeDelivery,
    freeDeliveryThreshold,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCartFromSaved,
    removeSavedItem,
    applyCoupon,
    removeCoupon,
    availableCoupons,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleSelectPredefinedCoupon = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border border-gray-200 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart is empty</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Your shopping cart is waiting for you! Explore millions of products, trending Indian
            festive wear, electronics, and daily essentials with verified fast delivery.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreDeals}
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm shadow-xs transition-colors cursor-pointer"
            >
              Shop Today's Deals →
            </button>
          </div>
        </div>

        {/* Saved for Later even if cart is empty */}
        {savedForLater.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-xs">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              Saved for Later ({savedForLater.length} item{savedForLater.length > 1 ? 's' : ''})
            </h3>
            <div className="divide-y divide-gray-100">
              {savedForLater.map((s) => (
                <div key={s.product.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={s.product.images[0]}
                      alt={s.product.title}
                      className="w-16 h-16 object-contain rounded bg-gray-50 p-1"
                    />
                    <div>
                      <h4
                        onClick={() => onSelectProduct(s.product)}
                        className="text-xs font-semibold text-gray-900 hover:text-amber-800 cursor-pointer line-clamp-1"
                      >
                        {s.product.title}
                      </h4>
                      <span className="font-bold text-sm text-gray-900">
                        ₹{s.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveToCartFromSaved(s.product.id)}
                      className="px-3 py-1 bg-amber-400 hover:bg-amber-500 rounded text-xs font-bold text-gray-900 cursor-pointer"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeSavedItem(s.product.id)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cart Items List (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-3">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                  Shopping Cart
                </h1>
                <span className="text-xs text-gray-500">
                  {itemCount} item{itemCount > 1 ? 's' : ''} in cart
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-500">Price</span>
            </div>

            {/* Free Delivery Bar */}
            <div className="my-4 p-3 bg-amber-50/70 border border-amber-200 rounded-md">
              {amountNeededForFreeDelivery === 0 ? (
                <div className="flex items-center gap-2 text-xs font-bold text-green-800">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>
                    Your order qualifies for <strong className="uppercase">FREE Delivery</strong> in
                    India! Choose this option at checkout.
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-800">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-amber-600" />
                      Add ₹{amountNeededForFreeDelivery.toLocaleString('en-IN')} of eligible items for{' '}
                      <strong>FREE Delivery</strong>
                    </span>
                    <span className="font-bold text-amber-800 text-[11px]">
                      Threshold: ₹{freeDeliveryThreshold}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-gray-200">
              {items.map((item) => {
                const maxQty = Math.min(item.product.stock, 10);

                return (
                  <div key={item.product.id} className="py-4 flex flex-col sm:flex-row gap-4">
                    {/* Item Image */}
                    <div
                      onClick={() => onSelectProduct(item.product)}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-md overflow-hidden shrink-0 p-2 flex items-center justify-center cursor-pointer border border-gray-100"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3
                            onClick={() => onSelectProduct(item.product)}
                            className="text-sm font-semibold text-gray-900 hover:text-amber-800 cursor-pointer line-clamp-2 leading-snug"
                          >
                            {item.product.title}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="font-black text-base text-gray-900 block">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{(item.product.mrp * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Stock & Delivery info */}
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          {item.product.stock > 0 ? (
                            <span className="text-green-700 font-bold">In Stock</span>
                          ) : (
                            <span className="text-red-600 font-bold">Out of Stock</span>
                          )}
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500">Eligible for FREE Shipping</span>
                        </div>
                      </div>

                      {/* Controls row */}
                      <div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
                        {/* Quantity dropdown */}
                        <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-300 rounded px-2 py-0.5">
                          <label className="text-[11px] text-gray-600 font-medium">Qty:</label>
                          <select
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.product.id, Number(e.target.value))
                            }
                            className="bg-transparent font-bold text-gray-900 focus:outline-hidden cursor-pointer"
                          >
                            {[...Array(maxQty)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        <span className="text-gray-300">|</span>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#007185] hover:text-red-600 hover:underline font-medium cursor-pointer"
                        >
                          Delete
                        </button>

                        <span className="text-gray-300">|</span>

                        <button
                          onClick={() => saveForLater(item.product.id)}
                          className="text-[#007185] hover:underline font-medium cursor-pointer"
                        >
                          Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtotal bottom line */}
            <div className="pt-4 border-t border-gray-200 text-right text-sm">
              <span>
                Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''}):{' '}
              </span>
              <span className="font-black text-lg text-gray-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Saved for Later Shelf */}
          {savedForLater.length > 0 && (
            <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-xs">
              <h3 className="font-bold text-base text-gray-900 mb-3">
                Saved for Later ({savedForLater.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {savedForLater.map((s) => (
                  <div key={s.product.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.product.images[0]}
                        alt={s.product.title}
                        className="w-14 h-14 object-contain rounded bg-gray-50 p-1 border border-gray-100"
                      />
                      <div>
                        <h4
                          onClick={() => onSelectProduct(s.product)}
                          className="text-xs font-semibold text-gray-900 hover:text-amber-800 cursor-pointer line-clamp-1"
                        >
                          {s.product.title}
                        </h4>
                        <span className="font-bold text-xs text-gray-900">
                          ₹{s.product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveToCartFromSaved(s.product.id)}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 rounded text-xs font-bold text-gray-900 cursor-pointer"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeSavedItem(s.product.id)}
                        className="text-xs text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Coupons (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4 text-xs">
            {/* Free delivery badge */}
            <div className="flex items-center gap-2 text-green-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Part of BharatBazaar Buyer Protection</span>
            </div>

            {/* Subtotal summary */}
            <div className="text-base text-gray-800">
              Subtotal ({itemCount} item{itemCount > 1 ? 's' : ''}):{' '}
              <strong className="text-xl font-black text-gray-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </strong>
            </div>

            {/* Proceed to Buy CTA */}
            <button
              onClick={onNavigateToCheckout}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] py-3 px-4 rounded-full font-bold text-sm text-gray-900 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Buy</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Price Breakdown */}
            <div className="border-t border-gray-200 pt-3 space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-medium text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span className="font-medium">
                  {deliveryCharge === 0 ? (
                    <span className="text-green-700 font-bold uppercase">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code}):</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold text-gray-900">
                <span>Order Total:</span>
                <span className="text-base font-black text-amber-700">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Coupon Code Box */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 text-sm">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Apply Discount Coupon</span>
            </div>

            {/* Current Applied Coupon */}
            {appliedCoupon ? (
              <div className="p-2.5 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                <div>
                  <span className="font-bold text-green-800 text-xs">{appliedCoupon.code}</span>
                  <p className="text-[11px] text-green-700">{appliedCoupon.description}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. BHARAT100)"
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs uppercase font-medium focus:border-amber-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 font-bold text-gray-900 px-4 py-1.5 rounded-md text-xs cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Feedback message */}
            {couponFeedback && (
              <div
                className={`p-2 rounded text-[11px] font-medium flex items-center gap-1.5 ${
                  couponFeedback.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {couponFeedback.type === 'success' ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{couponFeedback.message}</span>
              </div>
            )}

            {/* Available Coupons Suggestions */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[11px] text-gray-500 font-semibold block mb-1.5">
                Available Festive Coupons:
              </span>
              <div className="space-y-1.5">
                {availableCoupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-2 border border-dashed border-gray-300 rounded hover:border-amber-400 bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-gray-800 text-[11px]">{c.code}</span>
                      <p className="text-[10px] text-gray-500">{c.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectPredefinedCoupon(c.code)}
                      className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
