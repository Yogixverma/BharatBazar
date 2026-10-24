import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  Heart,
  Package,
  ShieldAlert,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import { INITIAL_CATEGORIES } from '../../data/mockProducts';

interface NavbarProps {
  onNavigate: (view: string, params?: any) => void;
  onOpenDrawer: () => void;
  onOpenAiAssistant: () => void;
  currentSearchQuery: string;
  onSearch: (query: string, category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  onOpenDrawer,
  onOpenAiAssistant,
  currentSearchQuery,
  onSearch,
}) => {
  const { user, profile, isAdmin, demoAdminOverride, toggleDemoAdmin, openAuthModal, logout } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { location, setIsModalOpen } = useLocation();

  const [searchCategory, setSearchCategory] = useState('All');
  const [searchInput, setSearchInput] = useState(currentSearchQuery);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchSuggestionsOpen, setIsSearchSuggestionsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'HI'>('EN');

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize external search updates
  useEffect(() => {
    setSearchInput(currentSearchQuery);
  }, [currentSearchQuery]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchSuggestionsOpen(false);
    onSearch(searchInput, searchCategory);
  };

  const trendingSearches = [
    'iPhone 15 128GB',
    'Kanjivaram Silk Saree',
    'boAt Airdopes',
    'Philips Air Fryer',
    'MacBook Air M3',
    'Prestige Pressure Cooker',
    'India Gate Basmati Rice',
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#131921] text-white">
      {/* Top Banner Notice for Indian Festival Deals */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-[12px] font-medium py-1 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <span className="bg-black/30 text-amber-200 px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
            Festive Savings
          </span>
          <span>Up to 70% Off on Electronics & Indian Ethnic Wear | Instant 10% Bank Discount on HDFC & SBI Cards!</span>
        </div>
        <button
          onClick={onOpenAiAssistant}
          className="hidden md:flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors"
        >
          <Sparkles className="w-3 h-3 text-amber-300" /> Ask AI Mitra
        </button>
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 md:px-4">
        {/* Mobile Hamburger + Brand Logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDrawer}
            className="p-1.5 rounded-md hover:outline-1 hover:outline-white lg:hidden text-gray-200"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex flex-col items-start px-2 py-1 rounded-xs hover:outline-1 hover:outline-white text-left cursor-pointer"
          >
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                Bharat<span className="text-[#febd69]">Bazaar</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold ml-0.5">.in</span>
            </div>
            <span className="text-[9px] text-gray-300 -mt-1 tracking-wider uppercase font-semibold">
              India's Marketplace
            </span>
          </button>
        </div>

        {/* Location Selector (Desktop) */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-xs hover:outline-1 hover:outline-white text-left cursor-pointer shrink-0"
        >
          <MapPin className="w-4 h-4 text-gray-300 self-end mb-0.5" />
          <div className="flex flex-col text-xs leading-tight">
            <span className="text-[11px] text-gray-400">Delivering to</span>
            <span className="font-bold text-white max-w-[110px] truncate">
              {location.city} {location.pincode}
            </span>
          </div>
        </button>

        {/* Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-3xl mx-1 md:mx-3">
          <form onSubmit={handleSearchSubmit} className="flex h-10 w-full rounded-md shadow-xs focus-within:ring-2 focus-within:ring-amber-500">
            {/* Category Select */}
            <div className="relative hidden md:block">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="h-full rounded-l-md bg-gray-100 px-3 text-xs text-gray-800 border-r border-gray-300 hover:bg-gray-200 focus:outline-hidden cursor-pointer"
              >
                <option value="All">All Categories</option>
                {INITIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setIsSearchSuggestionsOpen(true);
              }}
              onFocus={() => setIsSearchSuggestionsOpen(true)}
              placeholder="Search BharatBazaar.in (e.g. iPhone, Saree, Air Fryer, Rice)"
              className="w-full bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-hidden rounded-l-md md:rounded-l-none"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              className="flex items-center justify-center w-11 md:w-12 bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e49b38] text-gray-900 rounded-r-md cursor-pointer transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {isSearchSuggestionsOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white text-gray-900 rounded-md shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in duration-100">
              <div className="p-2 border-b border-gray-100 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>Trending Searches</span>
                <span className="text-[10px] text-amber-700">Top in India</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {trendingSearches
                  .filter((item) => !searchInput || item.toLowerCase().includes(searchInput.toLowerCase()))
                  .map((term, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSearchInput(term);
                        setIsSearchSuggestionsOpen(false);
                        onSearch(term, searchCategory);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50/70 flex items-center gap-2 cursor-pointer text-gray-700 font-medium"
                    >
                      <Search className="w-3.5 h-3.5 text-gray-400" />
                      <span>{term}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Language Flag Selector */}
          <button
            onClick={() => setCurrentLang((prev) => (prev === 'EN' ? 'HI' : 'EN'))}
            className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-xs hover:outline-1 hover:outline-white cursor-pointer"
            title="Toggle Language"
          >
            <span className="text-sm">🇮🇳</span>
            <span className="text-xs font-bold">{currentLang}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {/* Account & Lists */}
          <div ref={accountMenuRef} className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex flex-col text-left px-2 py-1.5 rounded-xs hover:outline-1 hover:outline-white cursor-pointer"
            >
              <span className="text-[11px] text-gray-300">
                Hello, {user ? profile?.displayName?.split(' ')[0] || 'User' : 'Sign in'}
              </span>
              <div className="flex items-center gap-0.5 text-xs font-bold text-white">
                <span>Accounts & Lists</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
            </button>

            {/* Account Menu Dropdown */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 rounded-md bg-white text-gray-900 shadow-2xl border border-gray-200 p-4 z-50 text-xs">
                {!user ? (
                  <div className="text-center pb-3 border-b border-gray-200">
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold py-2 px-4 rounded-md shadow-xs cursor-pointer"
                    >
                      Sign In
                    </button>
                    <p className="mt-2 text-[11px] text-gray-600">
                      New customer?{' '}
                      <button
                        onClick={() => {
                          openAuthModal('register');
                          setIsAccountMenuOpen(false);
                        }}
                        className="text-amber-700 hover:underline font-semibold"
                      >
                        Start here.
                      </button>
                    </p>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-gray-200">
                    <div className="font-bold text-sm text-gray-900">
                      {profile?.displayName || 'Valued Customer'}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{user.email}</div>
                  </div>
                )}

                <div className="pt-2 space-y-1">
                  <div className="font-bold text-gray-900 mb-1">Your Account</div>
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 hover:text-amber-700 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-gray-500" /> Your Account & Addresses
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('orders');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 hover:text-amber-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5 text-gray-500" /> Your Orders & Tracking
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('wishlist');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left py-1.5 hover:text-amber-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-gray-500" /> Your Wish List
                  </button>

                  {/* Admin Dashboard Entry */}
                  {isAdmin && (
                    <div className="pt-2 mt-2 border-t border-purple-100 bg-purple-50 -mx-4 px-4 py-2">
                      <div className="font-bold text-purple-900 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-purple-600" /> Admin Controls
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full text-left py-1 text-purple-700 hover:underline font-semibold cursor-pointer"
                      >
                        Open Admin Dashboard →
                      </button>
                    </div>
                  )}

                  {/* Quick Demo Admin Mode Switch */}
                  <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
                    <span>Demo Admin Mode</span>
                    <button
                      onClick={toggleDemoAdmin}
                      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors cursor-pointer ${
                        demoAdminOverride ? 'bg-amber-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          demoAdminOverride ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {user && (
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left pt-2 mt-1 border-t border-gray-100 text-red-600 hover:text-red-700 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <button
            onClick={() => onNavigate('orders')}
            className="hidden sm:flex flex-col text-left px-2 py-1.5 rounded-xs hover:outline-1 hover:outline-white cursor-pointer"
          >
            <span className="text-[11px] text-gray-300">Returns</span>
            <span className="text-xs font-bold text-white">& Orders</span>
          </button>

          {/* Shopping Cart */}
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xs hover:outline-1 hover:outline-white cursor-pointer relative"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-7 h-7 text-white" />
              <span className="absolute -top-1 left-3.5 bg-[#f3a847] text-gray-900 font-extrabold text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-gray-300 font-medium">Cart</span>
              <span className="text-xs font-bold text-amber-400">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
