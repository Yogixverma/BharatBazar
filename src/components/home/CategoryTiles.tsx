import React from 'react';

interface SubItem {
  name: string;
  image: string;
  query: string;
}

interface TileCard {
  title: string;
  linkText: string;
  category: string;
  items: SubItem[];
}

const TILE_CARDS: TileCard[] = [
  {
    title: 'Up to 70% off | Indian Ethnic Styles',
    linkText: 'See all ethnic wear',
    category: 'Indian Ethnic & Fashion',
    items: [
      {
        name: 'Kanjivaram Sarees',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
        query: 'Saree',
      },
      {
        name: 'Kurta Pajama Sets',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&auto=format&fit=crop&q=80',
        query: 'Kurta',
      },
      {
        name: 'Anarkali Suits',
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&auto=format&fit=crop&q=80',
        query: 'Anarkali',
      },
      {
        name: 'Traditional Dupattas',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&auto=format&fit=crop&q=80',
        query: 'Ethnic',
      },
    ],
  },
  {
    title: 'Revamp your kitchen & dining',
    linkText: 'Explore home & kitchen',
    category: 'Home & Kitchen',
    items: [
      {
        name: 'Pressure Cookers',
        image: 'https://images.unsplash.com/photo-1584990347449-3995874c935b?w=400&auto=format&fit=crop&q=80',
        query: 'Cooker',
      },
      {
        name: 'Air Fryers',
        image: 'https://images.unsplash.com/photo-1626444026277-27b9a527c02b?w=400&auto=format&fit=crop&q=80',
        query: 'Air Fryer',
      },
      {
        name: 'Insulated Flasks',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80',
        query: 'Flask',
      },
      {
        name: 'Dining & Kitchenware',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
        query: 'Kitchen',
      },
    ],
  },
  {
    title: 'Smartphones & Audio Essentials',
    linkText: 'See more electronics',
    category: 'Mobiles & Accessories',
    items: [
      {
        name: 'Apple iPhone 15',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80',
        query: 'iPhone',
      },
      {
        name: 'OnePlus 12R',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80',
        query: 'OnePlus',
      },
      {
        name: 'boAt Wireless ANC',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80',
        query: 'Airdopes',
      },
      {
        name: 'Sony Headphones',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&auto=format&fit=crop&q=80',
        query: 'Sony',
      },
    ],
  },
  {
    title: 'Daily Essentials & Groceries',
    linkText: 'Shop all groceries',
    category: 'Daily Essentials & Grocery',
    items: [
      {
        name: 'Aged Basmati Rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
        query: 'Basmati',
      },
      {
        name: 'Organic Toor Dal',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
        query: 'Dal',
      },
      {
        name: 'Refined Cooking Oil',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
        query: 'Oil',
      },
      {
        name: 'Pantry Essentials',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
        query: 'Grocery',
      },
    ],
  },
];

interface CategoryTilesProps {
  onSelectCategory: (category: string) => void;
  onSearchProduct: (query: string) => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  onSelectCategory,
  onSearchProduct,
}) => {
  return (
    <div className="relative -mt-10 sm:-mt-20 md:-mt-28 z-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TILE_CARDS.map((card, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg mb-3 line-clamp-1">
                {card.title}
              </h3>

              {/* 2x2 Image Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {card.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => onSearchProduct(item.query)}
                    className="group text-left cursor-pointer"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-xs bg-gray-100 border border-gray-100 mb-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] text-gray-700 font-medium group-hover:text-amber-800 line-clamp-1">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectCategory(card.category)}
              className="text-xs font-semibold text-[#007185] hover:text-[#c7511f] hover:underline text-left cursor-pointer mt-2"
            >
              {card.linkText} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
