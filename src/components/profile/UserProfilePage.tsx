import React, { useState } from 'react';
import {
  User,
  MapPin,
  Package,
  Heart,
  Shield,
  Plus,
  Trash2,
  Check,
  Edit2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { Address } from '../../types/ecommerce';

interface UserProfilePageProps {
  onNavigateToOrders: () => void;
  onNavigateToWishlist: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  onNavigateToOrders,
  onNavigateToWishlist,
}) => {
  const { user, profile, isAdmin, logout, openAuthModal } = useAuth();
  const { location, updateLocation } = useLocation();

  const [activeTab, setActiveTab] = useState<'overview' | 'addresses' | 'security'>('overview');
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-user-1',
      userId: user?.uid || 'guest-1',
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
    },
    {
      id: 'addr-user-2',
      userId: user?.uid || 'guest-1',
      fullName: profile?.displayName || 'Yogesh Verma',
      mobileNumber: '9876543210',
      addressLine1: 'Office 8B, Tech Park, Outer Ring Road',
      addressLine2: 'Marathahalli',
      landmark: 'Next to Metro Station',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: false,
      addressType: 'work',
    },
  ]);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [formName, setFormName] = useState(profile?.displayName || 'Yogesh Verma');
  const [formPhone, setFormPhone] = useState('9876543210');
  const [formLine1, setFormLine1] = useState('');
  const [formCity, setFormCity] = useState(location.city);
  const [formState, setFormState] = useState(location.state);
  const [formPincode, setFormPincode] = useState(location.pincode);

  if (!user && !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <User className="w-12 h-12 text-gray-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Sign in to view your account</h2>
          <p className="text-xs text-gray-500">
            Access your saved addresses, track recent orders, and manage payment options.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="bg-amber-400 hover:bg-amber-500 font-bold px-6 py-2 rounded-md text-xs text-gray-900 cursor-pointer shadow-xs"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formLine1 || !formPincode) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      userId: user?.uid || 'user',
      fullName: formName,
      mobileNumber: formPhone,
      addressLine1: formLine1,
      city: formCity,
      state: formState,
      pincode: formPincode,
      isDefault: false,
      addressType: 'home',
    };

    setAddresses([newAddr, ...addresses]);
    setIsAddingAddress(false);
    setFormLine1('');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    const selected = addresses.find((a) => a.id === id);
    if (selected) {
      updateLocation(selected.pincode, selected.city, selected.state);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Navigation Card */}
        <div className="w-full md:w-64 shrink-0 space-y-4 text-xs">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold text-lg flex items-center justify-center">
                {profile?.displayName?.[0] || user?.email?.[0] || 'U'}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">{profile?.displayName || 'User'}</div>
                <div className="text-[11px] text-gray-500 truncate max-w-[130px]">{user?.email}</div>
                {isAdmin && (
                  <span className="inline-block mt-1 bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-2xs divide-y divide-gray-100 overflow-hidden font-medium text-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full p-3 text-left flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'overview' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>Account Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full p-3 text-left flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'addresses' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Your Addresses</span>
            </button>

            <button
              onClick={onNavigateToOrders}
              className="w-full p-3 text-left flex items-center gap-2.5 hover:bg-gray-50 cursor-pointer"
            >
              <Package className="w-4 h-4 text-gray-500" />
              <span>Your Orders</span>
            </button>

            <button
              onClick={onNavigateToWishlist}
              className="w-full p-3 text-left flex items-center gap-2.5 hover:bg-gray-50 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-gray-500" />
              <span>Your Wishlist</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full p-3 text-left flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'security' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-gray-50'
              }`}
            >
              <Shield className="w-4 h-4 text-gray-500" />
              <span>Login & Security</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white p-6 rounded-lg border border-gray-200 shadow-2xs text-xs space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Your Account Overview</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  onClick={onNavigateToOrders}
                  className="p-4 border border-gray-200 rounded-lg hover:border-amber-400 cursor-pointer transition-colors space-y-1"
                >
                  <Package className="w-6 h-6 text-amber-600 mb-2" />
                  <h3 className="font-bold text-sm text-gray-900">Your Orders</h3>
                  <p className="text-gray-500 text-[11px]">Track, return, or buy again</p>
                </div>

                <div
                  onClick={() => setActiveTab('addresses')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-amber-400 cursor-pointer transition-colors space-y-1"
                >
                  <MapPin className="w-6 h-6 text-amber-600 mb-2" />
                  <h3 className="font-bold text-sm text-gray-900">Your Addresses</h3>
                  <p className="text-gray-500 text-[11px]">Edit addresses for orders and gifts</p>
                </div>

                <div
                  onClick={onNavigateToWishlist}
                  className="p-4 border border-gray-200 rounded-lg hover:border-amber-400 cursor-pointer transition-colors space-y-1"
                >
                  <Heart className="w-6 h-6 text-red-500 mb-2" />
                  <h3 className="font-bold text-sm text-gray-900">Your Wishlist</h3>
                  <p className="text-gray-500 text-[11px]">View saved items and move to cart</p>
                </div>
              </div>

              {/* Profile Details Block */}
              <div className="border border-gray-200 rounded-lg p-5 space-y-3">
                <h3 className="font-bold text-sm text-gray-900">Profile Details</h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Name:</span>
                    <span className="font-bold text-gray-800">{profile?.displayName || 'User'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Email Address:</span>
                    <span className="font-bold text-gray-800">{user?.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Primary Delivery Hub:</span>
                    <span className="font-bold text-gray-800">
                      {location.city} - {location.pincode}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Account Status:</span>
                    <span className="text-green-700 font-bold">Active & Verified</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Addresses</h2>
                  <p className="text-gray-500 text-xs">Manage delivery destinations across India</p>
                </div>
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="bg-amber-400 hover:bg-amber-500 font-bold px-3 py-1.5 rounded-md text-xs text-gray-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <h3 className="font-bold text-sm text-gray-900">Add New Delivery Address</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="border border-gray-300 rounded p-2 text-xs"
                    />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Mobile Number"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="border border-gray-300 rounded p-2 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Address Line (Flat / Street / Area)"
                    value={formLine1}
                    onChange={(e) => setFormLine1(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      className="border border-gray-300 rounded p-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={formState}
                      onChange={(e) => setFormState(e.target.value)}
                      className="border border-gray-300 rounded p-2 text-xs"
                    />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="PIN Code"
                      value={formPincode}
                      onChange={(e) => setFormPincode(e.target.value)}
                      className="border border-gray-300 rounded p-2 text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-amber-400 hover:bg-amber-500 font-bold px-4 py-1.5 rounded text-xs cursor-pointer"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="border border-gray-300 px-3 py-1.5 rounded text-xs hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-lg border relative flex flex-col justify-between ${
                      addr.isDefault
                        ? 'border-amber-500 bg-amber-50/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-amber-500 text-gray-950 font-bold px-1.5 py-0.2 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-gray-700">{addr.addressLine2}</p>}
                      <p className="text-gray-700">
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      <p className="text-gray-500 mt-1">Phone: {addr.mobileNumber}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 mt-3 border-t border-gray-100 text-[11px]">
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-amber-800 font-bold hover:underline cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-red-600 hover:underline cursor-pointer ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Login & Security</h2>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800 block">Email:</span>
                    <span className="text-gray-600">{user?.email}</span>
                  </div>
                  <span className="text-gray-400 text-xs">Managed via Firebase</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800 block">Password:</span>
                    <span className="text-gray-600">••••••••••••</span>
                  </div>
                  <button
                    onClick={() => openAuthModal('forgot')}
                    className="text-amber-700 hover:underline font-semibold cursor-pointer"
                  >
                    Reset Password
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-800 block">Session Status:</span>
                    <span className="text-green-700 font-medium">Logged in securely</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
