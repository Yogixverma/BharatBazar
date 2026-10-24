import React from 'react';
import {
  X,
  User,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  LogIn,
  LogOut,
  Smartphone,
  Laptop,
  Shirt,
  Utensils,
  Package,
  BookOpen,
  Heart,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_CATEGORIES } from '../../data/mockProducts';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryName: string) => void;
  onNavigate: (view: string) => void;
  onOpenAiAssistant: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  mobiles: <Smartphone className="w-4 h-4 text-gray-500" />,
  electronics: <Laptop className="w-4 h-4 text-gray-500" />,
  fashion: <Shirt className="w-4 h-4 text-gray-500" />,
  'home-kitchen': <Utensils className="w-4 h-4 text-gray-500" />,
  grocery: <Package className="w-4 h-4 text-gray-500" />,
  books: <BookOpen className="w-4 h-4 text-gray-500" />,
  beauty: <Heart className="w-4 h-4 text-gray-500" />,
  sports: <Activity className="w-4 h-4 text-gray-500" />,
};

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onNavigate,
  onOpenAiAssistant,
}) => {
  const { user, profile, isAdmin, openAuthModal, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Header */}
        <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
          <div
            onClick={() => {
              if (!user) openAuthModal('login');
              else onNavigate('profile');
              onClose();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-300">Hello,</div>
              <div className="font-bold text-base leading-tight group-hover:text-amber-400 transition-colors">
                {user ? profile?.displayName || user.email?.split('@')[0] : 'Sign In'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 rounded-md"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-200 text-sm text-gray-800">
          {/* Trending & Quick Links */}
          <div className="py-3">
            <div className="px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
              Trending & Highlights
            </div>
            <button
              onClick={() => {
                onNavigate('deals');
                onClose();
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer text-left"
            >
              <span className="font-medium text-amber-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Great Indian Deals
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                onNavigate('bestsellers');
                onClose();
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer text-left"
            >
              <span>Best Sellers</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                onOpenAiAssistant();
                onClose();
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-amber-50 transition-colors cursor-pointer text-left bg-amber-50/50"
            >
              <span className="font-medium text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" /> Ask Bharat Mitra (AI)
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                NEW
              </span>
            </button>
          </div>

          {/* Shop by Department */}
          <div className="py-3">
            <div className="px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
              Shop by Department
            </div>
            {INITIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.name);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <span className="flex items-center gap-2.5">
                  {CATEGORY_ICONS[cat.id] || <ShoppingBag className="w-4 h-4 text-gray-400" />}
                  {cat.name}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          {/* Features & Programs */}
          <div className="py-3">
            <div className="px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
              Programs & Features
            </div>
            <button
              onClick={() => {
                onNavigate('wishlist');
                onClose();
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer text-left"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-400" /> Your Wishlist
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                onNavigate('orders');
                onClose();
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer text-left"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-gray-400" /> Your Orders
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-purple-50 transition-colors cursor-pointer text-left text-purple-800 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Dashboard
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </button>
            )}
          </div>

          {/* Help & Settings */}
          <div className="py-3">
            <div className="px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">
              Help & Settings
            </div>
            <button
              onClick={() => {
                onNavigate('profile');
                onClose();
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer text-left"
            >
              <span>Your Account</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => {
                onNavigate('help');
                onClose();
              }}
              className="w-full flex items-center justify-between px-5 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer text-left"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-gray-400" /> Customer Service
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-5 py-2.5 hover:bg-red-50 text-red-600 transition-colors cursor-pointer text-left font-medium"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  openAuthModal('login');
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-5 py-2.5 hover:bg-amber-50 text-amber-700 transition-colors cursor-pointer text-left font-semibold"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
