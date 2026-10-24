import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Package,
  ShoppingBag,
  Users,
  IndianRupee,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  RotateCcw,
  Search,
  Tag,
  Star,
  RefreshCw,
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_CATEGORIES, INITIAL_COUPONS } from '../../data/mockProducts';
import { db } from '../../firebase';
import { Coupon, Order, Product } from '../../types/ecommerce';

interface AdminDashboardProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  onUpdateProducts,
  onExitAdmin,
}) => {
  const { user, profile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState('');

  // Product Add / Edit modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('Mobiles & Accessories');
  const [formPrice, setFormPrice] = useState(1999);
  const [formMrp, setFormMrp] = useState(2999);
  const [formStock, setFormStock] = useState(20);
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80');
  const [formDesc, setFormDesc] = useState('');
  const [formIsDeal, setFormIsDeal] = useState(false);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);

  // Load orders for admin metrics
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        const list: Order[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Order));
        if (list.length > 0) {
          setAllOrders(list);
        } else {
          const local = JSON.parse(localStorage.getItem('bb_order_history') || '[]');
          setAllOrders(local);
        }
      } catch (e) {
        const local = JSON.parse(localStorage.getItem('bb_order_history') || '[]');
        setAllOrders(local);
      }
    };
    fetchAllOrders();
  }, []);

  // Metrics
  const totalRevenue = allOrders
    .filter((o) => o.paymentStatus === 'paid' || o.orderStatus === 'delivered')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrdersCount = allOrders.filter(
    (o) => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled'
  ).length;

  const lowStockProducts = products.filter((p) => p.stock < 15);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormBrand('');
    setFormCategory('Mobiles & Accessories');
    setFormPrice(1499);
    setFormMrp(2499);
    setFormStock(25);
    setFormImage('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80');
    setFormDesc('Authentic quality product with full brand warranty.');
    setFormIsDeal(false);
    setFormIsBestSeller(false);
    setIsAddProductOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormBrand(p.brand);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormMrp(p.mrp);
    setFormStock(p.stock);
    setFormImage(p.images[0]);
    setFormDesc(p.description);
    setFormIsDeal(Boolean(p.isDealOfDay));
    setFormIsBestSeller(Boolean(p.isBestSeller));
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const discountPercent = Math.max(0, Math.round(((formMrp - formPrice) / formMrp) * 100));

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        title: formTitle.trim(),
        brand: formBrand.trim(),
        category: formCategory,
        price: Number(formPrice),
        mrp: Number(formMrp),
        discountPercent,
        stock: Number(formStock),
        images: [formImage.trim(), ...editingProduct.images.slice(1)],
        description: formDesc.trim(),
        isDealOfDay: formIsDeal,
        isBestSeller: formIsBestSeller,
      };

      const updatedList = products.map((p) => (p.id === editingProduct.id ? updated : p));
      onUpdateProducts(updatedList);

      try {
        await updateDoc(doc(db, 'products', editingProduct.id), updated as any);
      } catch (err) {
        console.warn('Product update Firestore fallback:', err);
      }
    } else {
      const newProd: Product = {
        id: `prod-admin-${Date.now()}`,
        title: formTitle.trim(),
        brand: formBrand.trim() || 'Bharat Essentials',
        category: formCategory,
        price: Number(formPrice),
        mrp: Number(formMrp),
        discountPercent,
        rating: 4.5,
        reviewCount: 1,
        stock: Number(formStock),
        images: [formImage.trim()],
        description: formDesc.trim(),
        specifications: {
          Brand: formBrand.trim() || 'Bharat Essentials',
          Warranty: '1 Year Brand Warranty',
          Origin: 'Made in India',
        },
        isDealOfDay: formIsDeal,
        isBestSeller: formIsBestSeller,
        isBharatAssured: true,
        freeDelivery: true,
        deliveryDays: 1,
      };

      const updatedList = [newProd, ...products];
      onUpdateProducts(updatedList);

      try {
        await setDoc(doc(db, 'products', newProd.id), newProd as any);
      } catch (err) {
        console.warn('Product create Firestore fallback:', err);
      }
    }

    setIsAddProductOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (e) {
        console.warn('Delete product fallback', e);
      }
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order['orderStatus']
  ) => {
    const updated = allOrders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: newStatus,
          paymentStatus: newStatus === 'delivered' ? ('paid' as const) : o.paymentStatus,
          statusHistory: [
            ...o.statusHistory,
            {
              status: newStatus,
              label: `Status Updated to ${newStatus}`,
              timestamp: new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'short',
              }),
              description: `Admin updated order status to ${newStatus}.`,
              completed: true,
            },
          ],
        };
      }
      return o;
    });

    setAllOrders(updated);
    localStorage.setItem('bb_order_history', JSON.stringify(updated));

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        orderStatus: newStatus,
      });
    } catch (e) {
      console.warn('Order status update fallback', e);
    }
  };

  const handleRestockProduct = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, stock: p.stock + 50 } : p));
    onUpdateProducts(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Admin Top Header */}
      <div className="bg-slate-900 text-white p-5 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span>BharatBazaar Seller & Admin Central</span>
              <span className="text-[10px] bg-green-950 text-green-400 border border-green-800 px-2 py-0.5 rounded font-mono">
                ONLINE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage inventory, live customer orders, fulfillment tracking & pricing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExitAdmin}
            className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-4 py-2 rounded-md border border-slate-700 transition-colors cursor-pointer"
          >
            ← Back to Store
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-6 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'border-amber-500 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics & Overview
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'products'
              ? 'border-amber-500 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Product Catalog & Stock ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Orders Fulfillment ({allOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'coupons'
              ? 'border-amber-500 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Coupons & Discounts
        </button>
      </div>

      {/* Overview Analytics Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-1">
              <span className="text-xs text-gray-500 font-medium">Verified Revenue</span>
              <div className="text-2xl font-black text-gray-900">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-green-700 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> From verified customer orders
              </span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-1">
              <span className="text-xs text-gray-500 font-medium">Total Orders Placed</span>
              <div className="text-2xl font-black text-gray-900">{allOrders.length}</div>
              <span className="text-[11px] text-amber-700 font-semibold">
                {pendingOrdersCount} orders requiring dispatch
              </span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-1">
              <span className="text-xs text-gray-500 font-medium">Catalog Items</span>
              <div className="text-2xl font-black text-gray-900">{products.length}</div>
              <span className="text-[11px] text-gray-500 font-medium">Across 8 departments</span>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-1">
              <span className="text-xs text-gray-500 font-medium">Inventory Alerts</span>
              <div className="text-2xl font-black text-amber-600">
                {lowStockProducts.length}
              </div>
              <span className="text-[11px] text-red-600 font-semibold">
                Items with stock under 15 units
              </span>
            </div>
          </div>

          {/* Low Stock Warning Shelf */}
          {lowStockProducts.length > 0 && (
            <div className="bg-white p-5 rounded-lg border border-amber-300 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Low Stock Warnings (Fulfillment Centers)</span>
                </h3>
                <span className="text-xs text-gray-500">Restock recommended</span>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-10 h-10 object-contain rounded bg-gray-50 p-1 border border-gray-100"
                      />
                      <div>
                        <span className="font-semibold text-gray-900 line-clamp-1">{p.title}</span>
                        <span className="text-[11px] text-gray-500">
                          Category: {p.category} | Current Stock:{' '}
                          <strong className="text-red-600">{p.stock}</strong>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestockProduct(p.id)}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      Restock +50
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Management Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title or brand..."
                className="w-full border border-gray-300 rounded-md py-1.5 pl-8 pr-3 text-xs focus:border-amber-500 focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
            </div>

            <button
              onClick={handleOpenAdd}
              className="w-full sm:w-auto bg-[#febd69] hover:bg-[#f3a847] text-gray-900 font-bold py-2 px-4 rounded-md text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-2xs overflow-x-auto text-xs">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 font-bold text-gray-600">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-right">Price (₹)</th>
                  <th className="p-3 text-right">M.R.P. (₹)</th>
                  <th className="p-3 text-center">Stock</th>
                  <th className="p-3 text-center">Badges</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products
                  .filter(
                    (p) =>
                      !searchQuery ||
                      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3 max-w-xs sm:max-w-md">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 object-contain rounded bg-gray-50 p-1 border border-gray-100 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-gray-900 line-clamp-1">
                              {p.title}
                            </span>
                            <span className="text-[11px] text-gray-500">Brand: {p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">{p.category}</td>
                      <td className="p-3 text-right font-black text-gray-900">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right text-gray-400 line-through">
                        ₹{p.mrp.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            p.stock < 10
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {p.isBestSeller && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                              Best Seller
                            </span>
                          )}
                          {p.isDealOfDay && (
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                              Deal
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 text-red-600 hover:text-red-800 cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Fulfillment Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-2xs overflow-x-auto text-xs">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 font-bold text-gray-600">
                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">City & PIN</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-center">Payment</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-gray-900">{ord.id}</td>
                    <td className="p-3">
                      <span className="font-semibold text-gray-800 block">
                        {ord.customerName}
                      </span>
                      <span className="text-[11px] text-gray-500">{ord.customerPhone}</span>
                    </td>
                    <td className="p-3 text-gray-700">
                      {ord.shippingAddress.city} - {ord.shippingAddress.pincode}
                    </td>
                    <td className="p-3 text-right font-black text-gray-900">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentMethod} ({ord.paymentStatus})
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-bold capitalize text-gray-800">
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, e.target.value as any)
                        }
                        className="border border-gray-300 rounded p-1 text-xs font-semibold bg-white cursor-pointer"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-2xs text-xs space-y-4">
          <h3 className="font-bold text-base text-gray-900">Active Promotional Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 rounded-lg border border-amber-300 bg-amber-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-gray-900 font-mono">{c.code}</span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    ACTIVE
                  </span>
                </div>
                <p className="text-gray-600 text-[11px]">{c.description}</p>
                <div className="text-[11px] font-semibold text-gray-800">
                  Min order: ₹{c.minOrderValue.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto text-xs space-y-4">
            <h3 className="font-bold text-base text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product to Catalog'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden bg-white"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">M.R.P. (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsDeal}
                    onChange={(e) => setFormIsDeal(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Mark as Deal of the Day</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsBestSeller}
                    onChange={(e) => setFormIsBestSeller(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold rounded shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
