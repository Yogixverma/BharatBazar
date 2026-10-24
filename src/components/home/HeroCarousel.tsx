import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  buttonText: string;
  category: string;
  gradient: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Great Indian Festival Savings',
    subtitle: 'Mega discounts on Smartphones, Laptops & Home Appliances with Instant Bank Offers',
    badge: 'Festive Dhamaka Deals',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80',
    buttonText: 'Shop All Deals',
    category: 'All',
    gradient: 'from-amber-900/90 via-slate-900/70 to-transparent',
  },
  {
    id: 2,
    title: 'Top Rated 5G Smartphones',
    subtitle: 'iPhone 15, OnePlus 12R & Samsung Galaxy S24 with No Cost EMI & Exchange Bonus',
    badge: 'Starting ₹6,499',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1600&auto=format&fit=crop&q=80',
    buttonText: 'Explore Mobiles',
    category: 'Mobiles & Accessories',
    gradient: 'from-slate-950/90 via-blue-950/70 to-transparent',
  },
  {
    id: 3,
    title: 'Royal Indian Ethnic Wear',
    subtitle: 'Pure Kanjivaram Silk Sarees, Embroidered Kurta Sets & Designer Bridal Wear',
    badge: 'Up to 70% Off',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=80',
    buttonText: 'Shop Ethnic Wear',
    category: 'Indian Ethnic & Fashion',
    gradient: 'from-red-950/90 via-rose-950/70 to-transparent',
  },
  {
    id: 4,
    title: 'Upgrade Your Modern Kitchen',
    subtitle: 'Philips Air Fryers, Prestige Induction Cookers & Stainless Steel Essentials',
    badge: 'Up to 50% Off',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1600&auto=format&fit=crop&q=80',
    buttonText: 'Shop Kitchenware',
    category: 'Home & Kitchen',
    gradient: 'from-emerald-950/90 via-slate-900/70 to-transparent',
  },
];

interface HeroCarouselProps {
  onSelectCategory: (category: string) => void;
  onNavigateToDeals: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onSelectCategory,
  onNavigateToDeals,
}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[480px] overflow-hidden bg-gray-900">
      {/* Background Image with smooth transition */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100 ease-out"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#eaeded] to-transparent pointer-events-none" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center text-white">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-500 text-gray-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
            {slide.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 drop-shadow-sm font-medium">
            {slide.subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={() => {
                if (slide.category === 'All') {
                  onNavigateToDeals();
                } else {
                  onSelectCategory(slide.category);
                }
              }}
              className="bg-[#febd69] hover:bg-[#f3a847] text-gray-950 font-bold px-6 py-2.5 rounded-md text-xs sm:text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {slide.buttonText} →
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-r-md bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-l-md bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === current ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
