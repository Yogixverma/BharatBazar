/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingCart, Check, X, ArrowRight } from 'lucide-react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AiAssistantDrawer } from './components/ai/AiAssistantDrawer';
import { CartPage } from './components/cart/CartPage';
import { FilterSidebar } from './components/catalog/FilterSidebar';
import { ProductCard } from './components/catalog/ProductCard';
import { SortAndSearchBar } from './components/catalog/SortAndSearchBar';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { BestSellersShelf } from './components/home/BestSellersShelf';
import { CategoryTiles } from './components/home/CategoryTiles';
import { DealsOfTheDay } from './components/home/DealsOfTheDay';
import { HeroCarousel } from './components/home/HeroCarousel';
import { RecentlyViewedShelf } from './components/home/RecentlyViewedShelf';
import { AuthModal } from './components/layout/AuthModal';
import { DrawerMenu } from './components/layout/DrawerMenu';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { PincodeModal } from './components/layout/PincodeModal';
import { SubNav } from './components/layout/SubNav';
import { OrdersPage } from './components/orders/OrdersPage';
import { OrderSuccessPage } from './components/orders/OrderSuccessPage';
import { ProductDetails } from './components/product/ProductDetails';
import { UserProfilePage } from './components/profile/UserProfilePage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { WishlistProvider } from './context/WishlistContext';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { FilterState, Order, Product } from './types/ecommerce';

// Notification Toast when item added to cart
const CartNotificationBanner: React.FC<{
  onViewCart: () => void;
  onProceedToCheckout: () => void;
}> = ({ onViewCart, onProceedToCheckout }) => {
  const { lastAddedProduct, itemCount, subtotal } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastAddedProduct) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedProduct]);

  if (!visible || !lastAddedProduct) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-white rounded-lg shadow-2xl border-2 border-amber-400 p-4 animate-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900">Added to Cart!</h4>
            <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
              {lastAddedProduct.title}
            </p>
            <span className="text-[11px] text-gray-700 block mt-1">
              Cart subtotal ({itemCount} item{itemCount > 1 ? 's' : ''}):{' '}
              <strong className="text-gray-900 font-bold">
                ₹{subtotal.toLocaleString('en-IN')}
              </strong>
            </span>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-700 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 text-xs">
        <button
          onClick={() => {
            setVisible(false);
            onViewCart();
          }}
          className="flex-1 py-1.5 px-3 border border-gray-300 hover:bg-gray-50 rounded font-semibold text-gray-800 text-center cursor-pointer"
        >
          View Cart
        </button>
        <button
          onClick={() => {
            setVisible(false);
            onProceedToCheckout();
          }}
          className="flex-1 py-1.5 px-3 bg-[#ffd814] hover:bg-[#f7ca00] rounded font-bold text-gray-900 text-center shadow-xs cursor-pointer"
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
};

// Inner App Content
const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    | 'home'
    | 'catalog'
    | 'product_details'
    | 'cart'
    | 'wishlist'
    | 'checkout'
    | 'order_success'
    | 'orders'
    | 'profile'
    | 'admin'
    | 'deals'
    | 'bestsellers'
    | 'about'
    | 'help'
    | 'assured'
  >('home');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [catalogViewMode, setCatalogViewMode] = useState<'grid' | 'list'>('grid');

  // Browsing history
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bb_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    brand: [],
    minPrice: 0,
    maxPrice: 150000,
    minRating: 0,
    inStockOnly: false,
    bharatAssuredOnly: false,
    sortBy: 'featured',
    searchQuery: '',
  });

  // Track recently viewed products
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product_details');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('bb_recently_viewed', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleSelectProductById = (id: string) => {
    const found = products.find((p) => p.id === id);
    if (found) {
      handleSelectProduct(found);
    }
  };

  const handleSearch = (queryText: string, categoryName: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: queryText,
      category: categoryName,
    }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catName: string) => {
    setFilters((prev) => ({
      ...prev,
      category: catName,
      searchQuery: '',
    }));
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    if (view === 'deals') {
      setFilters((prev) => ({
        ...prev,
        category: 'All',
        searchQuery: '',
        sortBy: 'featured',
      }));
      setCurrentView('deals');
    } else if (view === 'bestsellers') {
      setCurrentView('bestsellers');
    } else {
      setCurrentView(view as any);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((p) => {
    if (filters.category !== 'All' && p.category !== filters.category) return false;
    if (filters.brand.length > 0 && !filters.brand.includes(p.brand)) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.minRating > 0 && p.rating < filters.minRating) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    if (filters.bharatAssuredOnly && !p.isBharatAssured) return false;
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price_low_high') return a.price - b.price;
    if (filters.sortBy === 'price_high_low') return b.price - a.price;
    if (filters.sortBy === 'avg_rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isDealOfDay ? 1 : 0) - (a.isDealOfDay ? 1 : 0);
    // 'featured'
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  const availableBrands = Array.from(new Set(products.map((p) => p.brand)));

  return (
    <div className="min-h-screen bg-[#eaeded] flex flex-col text-gray-900 font-sans selection:bg-amber-200">
      {/* Primary Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        currentSearchQuery={filters.searchQuery}
        onSearch={handleSearch}
      />

      {/* Secondary Navigation */}
      <SubNav
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* App Body Router */}
      <main className="flex-1 pb-12">
        {currentView === 'home' && (
          <div>
            <HeroCarousel
              onSelectCategory={handleSelectCategory}
              onNavigateToDeals={() => handleNavigate('deals')}
            />

            <CategoryTiles
              onSelectCategory={handleSelectCategory}
              onSearchProduct={(q) => handleSearch(q, 'All')}
            />

            <DealsOfTheDay
              products={products}
              onSelectProduct={handleSelectProduct}
              onViewAllDeals={() => handleNavigate('deals')}
            />

            <BestSellersShelf
              products={products}
              onSelectProduct={handleSelectProduct}
              title="Best Sellers in India"
              categoryTag="Electronics & Ethnic Styles"
            />

            {/* Middle Promotion Banner */}
            <section className="max-w-7xl mx-auto px-4 mt-8">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-lg p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-2 text-center md:text-left">
                  <span className="bg-white/20 text-yellow-100 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Exclusive App Offer
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black">
                    Download BharatBazaar App & Get ₹100 Flat Off
                  </h3>
                  <p className="text-xs md:text-sm text-yellow-100 max-w-xl">
                    Scan with any UPI app for lightning quick checkout, live courier GPS
                    tracking, and early access to Great Indian Diwali deals.
                  </p>
                </div>
                <button
                  onClick={() => setIsAiAssistantOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-6 py-3 rounded-full text-xs md:text-sm shadow-lg flex items-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Chat with Bharat Mitra AI</span>
                </button>
              </div>
            </section>

            <RecentlyViewedShelf
              products={recentlyViewed}
              onSelectProduct={handleSelectProduct}
              onClearHistory={() => {
                setRecentlyViewed([]);
                localStorage.removeItem('bb_recently_viewed');
              }}
            />
          </div>
        )}

        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filters Sidebar */}
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                availableBrands={availableBrands}
              />

              {/* Products Grid / List */}
              <div className="flex-1">
                <SortAndSearchBar
                  totalCount={sortedProducts.length}
                  filters={filters}
                  onFilterChange={setFilters}
                  viewMode={catalogViewMode}
                  onViewModeChange={setCatalogViewMode}
                />

                {sortedProducts.length === 0 ? (
                  <div className="bg-white p-12 rounded-lg border border-gray-200 text-center space-y-3">
                    <p className="text-base font-bold text-gray-800">
                      No products matched your selected filters.
                    </p>
                    <p className="text-xs text-gray-500">
                      Try clearing some filters or searching with different keywords.
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          category: 'All',
                          brand: [],
                          minPrice: 0,
                          maxPrice: 150000,
                          minRating: 0,
                          inStockOnly: false,
                          bharatAssuredOnly: false,
                          sortBy: 'featured',
                          searchQuery: '',
                        })
                      }
                      className="bg-amber-400 hover:bg-amber-500 font-bold px-4 py-2 rounded text-xs cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div
                    className={
                      catalogViewMode === 'grid'
                        ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5'
                        : 'space-y-3.5'
                    }
                  >
                    {sortedProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onSelect={handleSelectProduct}
                        viewMode={catalogViewMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'deals' && (
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Great Indian Festival Deals & Savings
              </h1>
              <p className="text-xs text-amber-100 mt-1">
                Handpicked blockbuster deals with up to 70% off across electronics, ethnic fashion,
                and home essentials.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products
                .filter((p) => p.isDealOfDay || p.discountPercent >= 25)
                .map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={handleSelectProduct}
                    viewMode="grid"
                  />
                ))}
            </div>
          </div>
        )}

        {currentView === 'bestsellers' && (
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                <span>BharatBazaar Best Sellers</span>
                <span className="text-xs bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  Ranked #1
                </span>
              </h1>
              <p className="text-xs text-gray-300 mt-1">
                Our most popular products based on customer sales and verified reviews.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products
                .filter((p) => p.isBestSeller)
                .map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={handleSelectProduct}
                    viewMode="grid"
                  />
                ))}
            </div>
          </div>
        )}

        {currentView === 'product_details' && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            relatedProducts={products.filter(
              (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
            )}
            onSelectProduct={handleSelectProduct}
            onNavigateToCategory={handleSelectCategory}
            onProceedToCheckout={() => setCurrentView('checkout')}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onNavigateToCheckout={() => setCurrentView('checkout')}
            onSelectProduct={handleSelectProduct}
            onExploreDeals={() => handleNavigate('deals')}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            onExploreProducts={() => handleNavigate('catalog')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={(order) => {
              setLatestOrder(order);
              setCurrentView('order_success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToCart={() => setCurrentView('cart')}
          />
        )}

        {currentView === 'order_success' && latestOrder && (
          <OrderSuccessPage
            order={latestOrder}
            onViewOrders={() => setCurrentView('orders')}
            onContinueShopping={() => setCurrentView('home')}
          />
        )}

        {currentView === 'orders' && (
          <OrdersPage
            onSelectProductById={handleSelectProductById}
            onExploreProducts={() => handleNavigate('home')}
          />
        )}

        {currentView === 'profile' && (
          <UserProfilePage
            onNavigateToOrders={() => setCurrentView('orders')}
            onNavigateToWishlist={() => setCurrentView('wishlist')}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            products={products}
            onUpdateProducts={setProducts}
            onExitAdmin={() => setCurrentView('home')}
          />
        )}

        {/* Informational Pages */}
        {(currentView === 'about' || currentView === 'help' || currentView === 'assured') && (
          <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
              <h2 className="text-2xl font-black text-gray-900">
                {currentView === 'about' && 'About BharatBazaar India'}
                {currentView === 'help' && 'BharatBazaar Customer Care & Support'}
                {currentView === 'assured' && 'BharatAssured Guarantee & Quality Promise'}
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                BharatBazaar is India's premier multi-category online shopping destination,
                delivering millions of genuine products to pin codes across all 28 states and 8 union
                territories.
              </p>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <span className="font-bold text-amber-900 text-sm">Customer Helpline:</span>
                <p className="text-amber-800">
                  Call: 1800-BHARAT-CARE (24x7 Toll Free) • Email: support@bharatbazaar.in
                </p>
              </div>
              <button
                onClick={() => setCurrentView('home')}
                className="bg-amber-400 hover:bg-amber-500 font-bold px-5 py-2 rounded text-xs text-gray-900 cursor-pointer"
              >
                ← Return to Homepage
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Shopping Assistant Bubble */}
      <button
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold p-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer border-2 border-white/80"
        aria-label="Open AI Shopping Assistant"
      >
        <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
        <span className="text-xs hidden sm:inline font-bold pr-1">Ask Bharat Mitra (AI)</span>
      </button>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />

      {/* Modals & Drawers */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectCategory={handleSelectCategory}
        onNavigate={handleNavigate}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      <AuthModal />
      <PincodeModal />

      <AiAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onSelectProduct={handleSelectProduct}
        products={products}
      />

      {/* Cart Toast */}
      <CartNotificationBanner
        onViewCart={() => setCurrentView('cart')}
        onProceedToCheckout={() => setCurrentView('checkout')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <WishlistProvider>
            <MainAppContent />
          </WishlistProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
