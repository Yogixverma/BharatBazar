import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  RotateCcw,
  CheckCircle,
  FileText,
  Clock,
  AlertCircle,
  X,
  Search,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebase';
import { Order, Product } from '../../types/ecommerce';

interface OrdersPageProps {
  onSelectProductById: (productId: string) => void;
  onExploreProducts: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onSelectProductById,
  onExploreProducts,
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'in_transit' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Found cheaper alternative');
  const [loading, setLoading] = useState(true);

  // Load orders from Firestore or localStorage
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const localOrders: Order[] = JSON.parse(
        localStorage.getItem('bb_order_history') || '[]'
      );

      if (user) {
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
          );
          const snap = await getDocs(q);
          const remoteList: Order[] = [];
          snap.forEach((d) => {
            remoteList.push({ id: d.id, ...d.data() } as Order);
          });

          // Merge unique orders
          const combined = [...remoteList];
          for (const lo of localOrders) {
            if (!combined.some((c) => c.id === lo.id)) {
              combined.push(lo);
            }
          }
          setOrders(combined);
        } catch (err) {
          console.warn('Error fetching orders from Firestore:', err);
          setOrders(localOrders);
        }
      } else {
        setOrders(localOrders);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async () => {
    if (!cancellingOrder) return;

    const updated = orders.map((o) =>
      o.id === cancellingOrder.id
        ? {
            ...o,
            orderStatus: 'cancelled' as const,
            cancelReason,
            statusHistory: [
              ...o.statusHistory,
              {
                status: 'cancelled' as const,
                label: 'Order Cancelled',
                timestamp: new Date().toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short',
                }),
                description: `Cancelled by customer: ${cancelReason}`,
                completed: true,
              },
            ],
          }
        : o
    );

    setOrders(updated);
    try {
      localStorage.setItem('bb_order_history', JSON.stringify(updated));
      if (user) {
        await updateDoc(doc(db, 'orders', cancellingOrder.id), {
          orderStatus: 'cancelled',
          cancelReason,
        });
      }
    } catch (e) {
      console.warn('Order cancellation persistence fallback', e);
    }

    setCancellingOrder(null);
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'in_transit') {
      if (o.orderStatus === 'delivered' || o.orderStatus === 'cancelled') return false;
    } else if (activeTab === 'delivered') {
      if (o.orderStatus !== 'delivered') return false;
    } else if (activeTab === 'cancelled') {
      if (o.orderStatus !== 'cancelled') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchItem = o.items.some((it) => it.title.toLowerCase().includes(q));
      return matchId || matchItem;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Your Orders
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Track packages, view tax invoices, or request returns
          </p>
        </div>

        {/* Search orders */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all orders or items..."
            className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-xs focus:border-amber-500 focus:outline-hidden"
          />
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'all'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('in_transit')}
          className={`px-4 py-2 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'in_transit'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Not Yet Shipped / In Transit
        </button>

        <button
          onClick={() => setActiveTab('delivered')}
          className={`px-4 py-2 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'delivered'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Delivered
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'cancelled'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Cancelled Orders
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 text-center max-w-md mx-auto space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-900 text-base">No orders found</h3>
          <p className="text-xs text-gray-500">
            Looks like you haven't placed an order matching this filter yet.
          </p>
          <div className="pt-2">
            <button
              onClick={onExploreProducts}
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold px-5 py-2 rounded-md text-xs cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const canCancel =
              order.orderStatus === 'placed' || order.orderStatus === 'confirmed';

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-gray-200 shadow-2xs overflow-hidden text-xs"
              >
                {/* Order Top Ribbon */}
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 text-gray-600">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-gray-500">
                        Order Placed
                      </span>
                      <span className="font-bold text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-gray-500">
                        Total Amount
                      </span>
                      <span className="font-bold text-gray-900">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] uppercase tracking-wider text-gray-500">
                        Ship To
                      </span>
                      <span className="font-semibold text-gray-800">
                        {order.shippingAddress.fullName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[11px] uppercase tracking-wider text-gray-500">
                      Order # {order.id}
                    </span>
                    <div className="flex items-center gap-3 pt-0.5">
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="text-[#007185] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Tax Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 md:p-6 space-y-4">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      {order.orderStatus === 'delivered' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : order.orderStatus === 'cancelled' ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Truck className="w-5 h-5 text-amber-600" />
                      )}
                      <div>
                        <span className="font-bold text-sm text-gray-900 capitalize">
                          {order.orderStatus.replace(/_/g, ' ')}
                        </span>
                        {order.orderStatus !== 'cancelled' && (
                          <span className="text-gray-500 ml-2">
                            • Guaranteed by {order.estimatedDeliveryDate}
                          </span>
                        )}
                        {order.orderStatus === 'cancelled' && order.cancelReason && (
                          <span className="text-red-600 ml-2">
                            ({order.cancelReason})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrderForTracking(order)}
                        className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-4 py-1.5 rounded-md text-xs shadow-2xs cursor-pointer"
                      >
                        Track Package
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => setCancellingOrder(order)}
                          className="border border-red-300 hover:bg-red-50 text-red-700 font-medium px-3 py-1.5 rounded-md text-xs cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items in this Order */}
                  <div className="space-y-4 divide-y divide-gray-100">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={it.image}
                            alt={it.title}
                            className="w-16 h-16 object-contain bg-gray-50 rounded border border-gray-200 p-1"
                          />
                          <div>
                            <h4
                              onClick={() => onSelectProductById(it.productId)}
                              className="font-semibold text-gray-900 hover:text-amber-800 cursor-pointer line-clamp-2 max-w-lg leading-snug"
                            >
                              {it.title}
                            </h4>
                            <span className="text-gray-500 text-[11px] block mt-0.5">
                              Brand: {it.brand} | Qty: {it.quantity}
                            </span>
                            <span className="font-black text-gray-900 text-sm mt-1 block">
                              ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectProductById(it.productId)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-1.5 rounded-md text-xs cursor-pointer shrink-0"
                        >
                          Buy it again
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Delivery Tracking Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl p-6 max-w-xl w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Tracking Details - {selectedOrderForTracking.id}
                </h3>
                <span className="text-xs text-gray-500">
                  Courier AWN: <strong className="font-mono text-gray-800">{selectedOrderForTracking.trackingNumber}</strong>
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Progress */}
            <div className="space-y-4 py-2">
              {selectedOrderForTracking.statusHistory.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start text-xs relative">
                  {/* Vertical bar */}
                  {idx < selectedOrderForTracking.statusHistory.length - 1 && (
                    <div
                      className={`absolute left-3 top-6 bottom-0 w-0.5 -ml-px ${
                        step.completed ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    />
                  )}

                  {/* Dot */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.completed
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-[11px] text-gray-500">{step.timestamp}</span>
                    </div>
                    {step.location && (
                      <span className="text-gray-600 block text-[11px] font-medium">
                        {step.location}
                      </span>
                    )}
                    {step.description && (
                      <p className="text-gray-500 text-[11px] mt-0.5">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-2 rounded-md text-xs cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto text-xs space-y-6">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <div className="font-black text-2xl text-gray-900">
                  Bharat<span className="text-[#febd69]">Bazaar</span>
                </div>
                <div className="text-[11px] text-gray-500">
                  Tax Invoice / Bill of Supply / Cash Receipt
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-gray-900 block">
                  Invoice No: BB/26-27/{selectedOrderForInvoice.id.slice(-6)}
                </span>
                <span className="text-gray-500 block">
                  Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString('en-IN')}
                </span>
                <span className="text-[10px] text-gray-500">GSTIN: 27AABCB1234F1ZQ</span>
              </div>
            </div>

            {/* Seller & Buyer details */}
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="font-bold text-gray-900 block mb-1">Sold By:</span>
                <p>BharatBazaar Logistics India Pvt Ltd</p>
                <p>Building 4, Warehousing Zone, Kalamboli</p>
                <p>Navi Mumbai, Maharashtra - 410218</p>
                <p>CIN: U72900MH2026PTC394102</p>
              </div>

              <div>
                <span className="font-bold text-gray-900 block mb-1">Billing & Shipping Address:</span>
                <p className="font-semibold text-gray-800">{selectedOrderForInvoice.shippingAddress.fullName}</p>
                <p>{selectedOrderForInvoice.shippingAddress.addressLine1}</p>
                <p>
                  {selectedOrderForInvoice.shippingAddress.city}, {selectedOrderForInvoice.shippingAddress.state} -{' '}
                  {selectedOrderForInvoice.shippingAddress.pincode}
                </p>
                <p>State/UT Code: 27</p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full divide-y divide-gray-200 border border-gray-200 rounded">
              <thead className="bg-gray-100 font-bold text-gray-700">
                <tr>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Gross Price</th>
                  <th className="p-2 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedOrderForInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium">{it.title}</td>
                    <td className="p-2 text-center">{it.quantity}</td>
                    <td className="p-2 text-right">₹{it.price.toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right font-bold">
                      ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary Breakup */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5 border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrderForInvoice.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges:</span>
                  <span>{selectedOrderForInvoice.deliveryFee === 0 ? 'FREE' : `₹${selectedOrderForInvoice.deliveryFee}`}</span>
                </div>
                {selectedOrderForInvoice.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount:</span>
                    <span>-₹{selectedOrderForInvoice.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm text-gray-900 border-t border-gray-300 pt-1">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrderForInvoice.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Print and Close buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-50 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="bg-amber-400 hover:bg-amber-500 font-bold px-5 py-2 rounded-md text-gray-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 text-xs">
            <h3 className="font-bold text-base text-gray-900">
              Cancel Order #{cancellingOrder.id}
            </h3>
            <p className="text-gray-500">
              Are you sure you want to cancel this order? If you paid online, the refund will be credited back to your original source within 2-4 business days.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Reason for cancellation:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:border-amber-500 focus:outline-hidden"
              >
                <option value="Found cheaper alternative">Found cheaper alternative</option>
                <option value="Order created by mistake">Order created by mistake</option>
                <option value="Delivery time too long">Delivery time too long</option>
                <option value="Need to change delivery address">Need to change delivery address</option>
                <option value="Payment method issue">Payment method issue</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded cursor-pointer shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
