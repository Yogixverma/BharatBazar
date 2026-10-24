import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  CheckCircle,
  Truck,
  CreditCard,
  ShieldCheck,
  Lock,
  ChevronDown,
  Edit2,
  Trash2,
} from 'lucide-react';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { db } from '../../firebase';
import { Address, Order, OrderItem, OrderStatusCheckpoint } from '../../types/ecommerce';
import { PaymentGatewayModal } from './PaymentGatewayModal';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onBackToCart,
}) => {
  const { user, profile } = useAuth();
  const { items, subtotal, deliveryCharge, discount, appliedCoupon, finalTotal, clearCart } =
    useCart();
  const { location, getEstimatedDelivery } = useLocation();

  // Saved addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address form state
  const [newFullName, setNewFullName] = useState(profile?.displayName || 'Yogesh Verma');
  const [newMobile, setNewMobile] = useState('9876543210');
  const [newLine1, setNewLine1] = useState('Flat 402, Palm Heights, Main Road');
  const [newLine2, setNewLine2] = useState('Near Metro Station');
  const [newLandmark, setNewLandmark] = useState('Opposite City Mall');
  const [newCity, setNewCity] = useState(location.city);
  const [newState, setNewState] = useState(location.state);
  const [newPincode, setNewPincode] = useState(location.pincode);
  const [newIsDefault, setNewIsDefault] = useState(true);

  // Payment method selection
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<
    'upi' | 'card' | 'netbanking' | 'cod'
  >('upi');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load existing addresses from Firestore or initialize default
  useEffect(() => {
    const defaultAddr: Address = {
      id: 'addr-default-1',
      userId: user?.uid || 'guest-user',
      fullName: profile?.displayName || 'Yogesh Verma',
      mobileNumber: '9876543210',
      addressLine1: 'Flat 402, Royal Residency, Linking Road',
      addressLine2: 'Bandra West',
      landmark: 'Near National College',
      city: location.city,
      state: location.state,
      pincode: location.pincode,
      isDefault: true,
      addressType: 'home',
    };

    setAddresses([defaultAddr]);
    setSelectedAddressId(defaultAddr.id);
  }, [user, profile, location]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || newMobile.trim().length < 10 || newPincode.trim().length !== 6) {
      setErrorMsg('Please enter a valid full name, 10-digit mobile number, and 6-digit PIN code');
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      userId: user?.uid || 'guest-user',
      fullName: newFullName.trim(),
      mobileNumber: newMobile.trim(),
      addressLine1: newLine1.trim(),
      addressLine2: newLine2.trim(),
      landmark: newLandmark.trim(),
      city: newCity.trim(),
      state: newState.trim(),
      pincode: newPincode.trim(),
      isDefault: newIsDefault,
      addressType: 'home',
    };

    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddressId(newAddr.id);
    setIsAddingNewAddress(false);
    setErrorMsg(null);
  };

  const handleStartPlaceOrder = () => {
    const chosenAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!chosenAddress) {
      setErrorMsg('Please select or add a delivery address to proceed.');
      return;
    }

    setErrorMsg(null);
    const generatedOrderId = `BB-IN-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    setPendingOrderId(generatedOrderId);

    // If Cash on delivery, we can finish directly or open gateway modal
    setIsGatewayOpen(true);
  };

  const finalizeOrderPlacement = async (paymentDetails: {
    method: 'upi' | 'card' | 'netbanking' | 'cod';
    transactionId: string;
    verifiedOnServer: boolean;
  }) => {
    setIsGatewayOpen(false);
    setIsSubmitting(true);

    const chosenAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

    const orderItems: OrderItem[] = items.map((i) => ({
      productId: i.product.id,
      title: i.product.title,
      price: i.product.price,
      mrp: i.product.mrp,
      image: i.product.images[0],
      quantity: i.quantity,
      brand: i.product.brand,
    }));

    const statusHistory: OrderStatusCheckpoint[] = [
      {
        status: 'placed',
        label: 'Order Placed',
        timestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
        }),
        location: `${chosenAddress.city} Fulfillment Centre`,
        description: 'Order confirmed and verified via payment gateway.',
        completed: true,
      },
      {
        status: 'confirmed',
        label: 'Order Confirmed',
        timestamp: 'Processing',
        location: 'Fulfillment Hub',
        description: 'Seller has packaged the items and generated shipping invoice.',
        completed: true,
      },
      {
        status: 'shipped',
        label: 'Shipped',
        timestamp: 'Expected Tomorrow',
        location: 'In Transit',
        description: 'Handed over to BharatAssured courier partner.',
        completed: false,
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery',
        timestamp: 'Pending',
        location: `Local Delivery Hub, ${chosenAddress.pincode}`,
        description: 'Courier executive assigned for doorstep delivery.',
        completed: false,
      },
      {
        status: 'delivered',
        label: 'Delivered',
        timestamp: getEstimatedDelivery(1),
        location: chosenAddress.city,
        description: 'Package delivered with OTP confirmation.',
        completed: false,
      },
    ];

    const newOrder: Order = {
      id: pendingOrderId || `BB-IN-${Date.now()}`,
      userId: user?.uid || 'guest-user',
      customerName: chosenAddress.fullName,
      customerEmail: user?.email || 'customer@example.com',
      customerPhone: chosenAddress.mobileNumber,
      items: orderItems,
      subtotal,
      deliveryFee: deliveryCharge,
      discount,
      couponCode: appliedCoupon?.code,
      total: finalTotal,
      shippingAddress: chosenAddress,
      paymentMethod: paymentDetails.method,
      paymentStatus: paymentDetails.method === 'cod' ? 'pending' : 'paid',
      orderStatus: 'confirmed',
      trackingNumber: `BBTRK${Math.floor(10000000 + Math.random() * 90000000)}IN`,
      statusHistory,
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: getEstimatedDelivery(1),
    };

    try {
      if (user) {
        await addDoc(collection(db, 'orders'), {
          ...newOrder,
          createdAtServer: serverTimestamp(),
        });
      }
    } catch (err) {
      console.warn('Firestore order persistence fallback:', err);
    }

    // Save order in localStorage so guests or local sessions always retain history
    try {
      const existing = JSON.parse(localStorage.getItem('bb_order_history') || '[]');
      localStorage.setItem('bb_order_history', JSON.stringify([newOrder, ...existing]));
    } catch (e) {
      console.warn('LocalStorage order save failed', e);
    }

    clearCart();
    setIsSubmitting(false);
    onOrderSuccess(newOrder);
  };

  const selectedAddr = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-black text-gray-900">
            Bharat<span className="text-[#febd69]">Bazaar</span>
          </span>
          <span className="text-lg text-gray-400 font-light">|</span>
          <h1 className="text-lg md:text-xl font-bold text-gray-800">Checkout</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Lock className="w-4 h-4 text-green-600" />
          <span>100% Secure Checkout</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Accordion Steps (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-gray-900 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h2 className="font-bold text-base text-gray-900">Delivery Address</h2>
              </div>
              {!isAddingNewAddress && (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add a new address</span>
                </button>
              )}
            </div>

            {/* Address Selection List */}
            {!isAddingNewAddress ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-3.5 rounded-lg border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address_choice"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <div className="flex-1 text-xs text-gray-700 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded text-[10px] uppercase font-bold">
                            {addr.addressType || 'Home'}
                          </span>
                          <span className="text-gray-500 font-medium">Ph: {addr.mobileNumber}</span>
                        </div>
                        <p>{addr.addressLine1}</p>
                        {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                        <p>
                          {addr.landmark && `${addr.landmark}, `}
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              /* Add New Address Form */
              <form onSubmit={handleSaveAddress} className="space-y-3 text-xs pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Full Name (First and Last)
                    </label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      10-digit Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9876543210"
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Flat, House no., Building, Company, Apartment
                  </label>
                  <input
                    type="text"
                    required
                    value={newLine1}
                    onChange={(e) => setNewLine1(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Area, Street, Sector, Village
                    </label>
                    <input
                      type="text"
                      value={newLine2}
                      onChange={(e) => setNewLine2(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={newLandmark}
                      onChange={(e) => setNewLandmark(e.target.value)}
                      placeholder="e.g. Near Apollo Hospital"
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Town / City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">State</label>
                    <select
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden bg-white"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-xs"
                  >
                    Use this address
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="border border-gray-300 text-gray-600 px-3 py-2 rounded text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-gray-900 font-black text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-bold text-base text-gray-900">Payment Method</h2>
            </div>

            <div className="space-y-3 text-xs">
              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                  selectedPaymentMode === 'upi'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_pref"
                  checked={selectedPaymentMode === 'upi'}
                  onChange={() => setSelectedPaymentMode('upi')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-gray-900 text-sm block">
                    UPI (Google Pay, PhonePe, Paytm, BHIM)
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    Instant payment using QR code or UPI ID. Fast refund processing.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                  selectedPaymentMode === 'card'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_pref"
                  checked={selectedPaymentMode === 'card'}
                  onChange={() => setSelectedPaymentMode('card')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-gray-900 text-sm block">
                    Credit or Debit Card (RuPay, Visa, Mastercard)
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    10% instant bank discount eligible on selected cards.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                  selectedPaymentMode === 'netbanking'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_pref"
                  checked={selectedPaymentMode === 'netbanking'}
                  onChange={() => setSelectedPaymentMode('netbanking')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-gray-900 text-sm block">
                    Net Banking (All Indian Banks)
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    HDFC, SBI, ICICI, Axis & 50+ other Indian banks.
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer ${
                  selectedPaymentMode === 'cod'
                    ? 'border-amber-500 bg-amber-50/50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment_pref"
                  checked={selectedPaymentMode === 'cod'}
                  onChange={() => setSelectedPaymentMode('cod')}
                  className="mt-1 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="font-bold text-gray-900 text-sm block">
                    Pay on Delivery (Cash / UPI at doorstep)
                  </span>
                  <span className="text-gray-500 text-[11px]">
                    Pay cash or scan QR on arrival of courier.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Items and Delivery Options */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-gray-900 font-black text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="font-bold text-base text-gray-900">Review Items and Delivery</h2>
            </div>

            <div className="space-y-4 divide-y divide-gray-100 text-xs">
              <div className="pb-2 text-green-700 font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-green-600" />
                <span>
                  Guaranteed delivery date: {getEstimatedDelivery(1)} by 8 PM
                </span>
              </div>

              {items.map((it) => (
                <div key={it.product.id} className="pt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product.images[0]}
                      alt={it.product.title}
                      className="w-12 h-12 object-contain bg-gray-50 rounded p-1 border border-gray-100"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{it.product.title}</h4>
                      <span className="text-gray-500 text-[11px]">
                        Quantity: <strong className="text-gray-800">{it.quantity}</strong>
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-sm shrink-0">
                    ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order (4 cols on lg) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm sticky top-24 space-y-4 text-xs">
            {/* CTA */}
            <button
              onClick={handleStartPlaceOrder}
              disabled={isSubmitting}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] py-3 px-4 rounded-full font-bold text-sm text-gray-900 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Place Your Order and Pay'}</span>
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              By placing your order, you agree to BharatBazaar's privacy notice and conditions of
              use.
            </p>

            {/* Order Summary Table */}
            <div className="border-t border-gray-200 pt-4 space-y-2.5">
              <h3 className="font-bold text-sm text-gray-900">Order Summary</h3>

              <div className="flex justify-between text-gray-600">
                <span>Items:</span>
                <span className="font-medium text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery:</span>
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
                  <span>Promotion Applied ({appliedCoupon?.code}):</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-black text-gray-900">
                <span>Order Total:</span>
                <span className="text-xl text-amber-700">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Selected Address Snapshot */}
            {selectedAddr && (
              <div className="border-t border-gray-200 pt-3 text-[11px] text-gray-600">
                <span className="font-bold text-gray-800 block mb-1">Delivering to:</span>
                <p className="font-medium text-gray-900">{selectedAddr.fullName}</p>
                <p className="line-clamp-2">
                  {selectedAddr.addressLine1}, {selectedAddr.city} - {selectedAddr.pincode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Gateway Dialog */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        amount={finalTotal}
        orderId={pendingOrderId}
        onPaymentSuccess={finalizeOrderPlacement}
      />
    </div>
  );
};
