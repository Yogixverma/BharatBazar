import React from 'react';
import { Menu, Sparkles, Smartphone, ShieldCheck, Flame } from 'lucide-react';

interface SubNavProps {
  onOpenDrawer: () => void;
  onNavigate: (view: string, params?: any) => void;
  onSelectCategory: (categoryName: string) => void;
  onOpenAiAssistant: () => void;
}

export const SubNav: React.FC<SubNavProps> = ({
  onOpenDrawer,
  onNavigate,
  onSelectCategory,
  onOpenAiAssistant,
}) => {
  return (
    <nav className="bg-[#232f3e] text-white text-xs overflow-x-auto scrollbar-none py-1.5 px-3 md:px-4">
      <div className="flex items-center gap-1 md:gap-3 min-w-max">
        {/* Hamburger All */}
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1.5 px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-bold cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span>All</span>
        </button>

        {/* AI Shopping Assistant Button */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-2.5 py-1 rounded-full shadow-2xs cursor-pointer transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
          <span>Bharat Mitra AI</span>
        </button>

        {/* Today's Deals */}
        <button
          onClick={() => onNavigate('deals')}
          className="flex items-center gap-1 px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer text-amber-300"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Today's Deals</span>
        </button>

        {/* Best Sellers */}
        <button
          onClick={() => onNavigate('bestsellers')}
          className="px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          Best Sellers
        </button>

        {/* Categories */}
        <button
          onClick={() => onSelectCategory('Mobiles & Accessories')}
          className="flex items-center gap-1 px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-gray-400" />
          <span>Mobiles</span>
        </button>

        <button
          onClick={() => onSelectCategory('Laptops & Electronics')}
          className="px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          Electronics
        </button>

        <button
          onClick={() => onSelectCategory('Indian Ethnic & Fashion')}
          className="px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          Indian Fashion
        </button>

        <button
          onClick={() => onSelectCategory('Home & Kitchen')}
          className="px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          Home & Kitchen
        </button>

        <button
          onClick={() => onSelectCategory('Daily Essentials & Grocery')}
          className="px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          Grocery & Essentials
        </button>

        <button
          onClick={() => onSelectCategory('Books & Learning')}
          className="px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          Books
        </button>

        <button
          onClick={() => onNavigate('assured')}
          className="flex items-center gap-1 px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-semibold cursor-pointer text-cyan-300"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>BharatAssured</span>
        </button>

        <button
          onClick={() => onNavigate('help')}
          className="px-2 py-1 rounded-xs hover:outline-1 hover:outline-white font-medium cursor-pointer"
        >
          Customer Service
        </button>

        {/* Right side spacer and promo */}
        <div className="ml-auto hidden xl:flex items-center gap-2 pl-4 text-[11px] text-gray-300">
          <span className="text-amber-400 font-bold">Festive Mega Sale:</span>
          <span>Free 1-Day Delivery on orders above ₹499</span>
        </div>
      </div>
    </nav>
  );
};
