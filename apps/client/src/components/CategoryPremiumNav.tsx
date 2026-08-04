import React, { useState } from 'react';
import { Utensils, Pill, Gift, ShoppingBag } from 'lucide-react';

export interface CategoryPremiumNavProps {
  onSelectCategory: (slug: string) => void;
}

export const CategoryPremiumNav: React.FC<CategoryPremiumNavProps> = ({
  onSelectCategory = () => {},
}) => {
  const [active, setActive] = useState('all');

  const categories = [
    { slug: 'all', label: 'Tous', icon: ShoppingBag },
    { slug: 'gastronomie', label: 'Gastronomie', icon: Utensils },
    { slug: 'pâtisserie', label: 'Pâtisserie', icon: Gift },
    { slug: 'fleurs', label: 'Fleurs & Cadeaux', icon: Pill },
  ];

  const handleSelect = (slug: string) => {
    setActive(slug);
    onSelectCategory(slug);
  };

  return (
    <div className="bg-[#000F2E] py-4 px-4 border-b border-white/5 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = active === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => handleSelect(cat.slug)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPremiumNav;
