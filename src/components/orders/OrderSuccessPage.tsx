import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, Package, ArrowRight, ShieldCheck, Printer } from 'lucide-react';
import { Order } from '../../types/ecommerce';

interface OrderSuccessPageProps {
  order: Order;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onViewOrders,
  onContinueShopping,
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#febd69', '#f3a847', '#22c55e', '#3b82f6', '#ec4899'],
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-200 space-y-6">
        {/* Success Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left pb-6 border-b border-gray-200">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Order Placed, Thank You!
              </h1>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full border border-green-200">
                Verified
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Confirmation and order tracking updates have been recorded for{' '}
              <strong className="text-gray-800">{order.customerEmail}</strong>.
            </p>
          </div>
        </div>

        {/* Order Key Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="text-gray-500 block">Order Number</span>
            <span className="font-mono font-bold text-sm text-gray-900 select-all block">
              {order.id}
            </span>
            <span className="text-[11px] text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
          </div>

          <div className="p-4 bg-green-50/60 rounded-lg border border-green-200 space-y-1">
            <span className="text-green-800 font-bold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Guaranteed Delivery
            </span>
            <span className="font-bold text-sm text-green-950 block">
              {order.estimatedDeliveryDate}
            </span>
            <span className="text-[11px] text-green-800">BharatAssured Fast Hub</span>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <span className="text-gray-500 block">Payment Method</span>
            <span className="font-bold text-sm text-gray-900 uppercase block">
              {order.paymentMethod === 'cod' ? 'Pay on Delivery' : `${order.paymentMethod} (Verified)`}
            </span>
            <span className="text-[11px] font-semibold text-gray-700">
              Total: ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Delivery Address and Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Address */}
          <div className="border border-gray-200 rounded-lg p-4 text-xs space-y-1 text-gray-700">
            <h3 className="font-bold text-sm text-gray-900 mb-2">Delivery Address</h3>
            <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
              <strong>{order.shippingAddress.pincode}</strong>
            </p>
            <p className="text-gray-500 pt-1">Phone: {order.shippingAddress.mobileNumber}</p>
          </div>

          {/* Items Summary */}
          <div className="border border-gray-200 rounded-lg p-4 text-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900">
              Items Ordered ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={it.image}
                      alt={it.title}
                      className="w-10 h-10 object-contain bg-gray-50 rounded border border-gray-100 p-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-800 line-clamp-1">{it.title}</span>
                      <span className="text-[10px] text-gray-500">Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Order Receipt</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onContinueShopping}
              className="px-5 py-2.5 border border-gray-300 rounded-md text-xs font-bold text-gray-800 hover:bg-gray-50 cursor-pointer"
            >
              Continue Shopping
            </button>
            <button
              onClick={onViewOrders}
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold px-6 py-2.5 rounded-md text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Track Your Package</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
