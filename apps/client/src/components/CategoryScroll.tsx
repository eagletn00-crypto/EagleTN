import React from 'react';
import { useRestaurantStore } from '../store/useRestaurantStore';

interface CategoryItem {
  id: string;
  name: string;
  img: string;
  emojiFallback: string;
}

const categories: CategoryItem[] = [
  { id: 'traditionnel', name: 'Traditionnel', img: '/categories/restaurants.png', emojiFallback: '🍲' },
  { id: 'pizzas', name: 'Pizza', img: '/categories/patisserie.png', emojiFallback: '🍕' },
  { id: 'burgers', name: 'Burgers', img: '/categories/restaurants.png', emojiFallback: '🍔' },
  { id: 'sucre', name: 'Sucré', img: '/categories/patisserie.png', emojiFallback: '🍰' },
  { id: 'boisson', name: 'Boisson', img: '/categories/cosmetique.png', emojiFallback: '🍹' },
];

export const CategoryScroll: React.FC = () => {
  const { activeCategoryFilter, setActiveCategory } = useRestaurantStore();

  return (
    <section className="space-y-2 pt-1 relative">
      <h2 className="text-[10px] font-black tracking-widest text-slate-400 uppercase px-4 font-['Plus_Jakarta_Sans']">
        EXPLORER L'ÉCOSYSTÈME
      </h2>
      
      {/* Container with Mask Gradients for Seamless Scrolling visual cue */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#f8f3ec] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#f8f3ec] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-2.5 overflow-x-auto px-4 pb-1 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat) => {
            const isSelected = activeCategoryFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isSelected ? null : cat.id)}
                className={`snap-start shrink-0 w-[72px] h-[82px] p-2 rounded-2xl flex flex-col items-center justify-between transition-all duration-200 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-95'
                    : 'bg-white/70 text-slate-700 border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white/90'
                }`}
              >
                {/* 40% Icon Padding Scale Protection */}
                <div className="w-8 h-8 flex items-center justify-center relative mt-1">
                  <img 
                    src={cat.img} 
                    alt={cat.name}
                    className="w-full h-full object-contain drop-shadow-xs"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                      }
                    }}
                  />
                  <span className="text-xl hidden">{cat.emojiFallback}</span>
                </div>
                
                <span className={`text-[9.5px] font-extrabold uppercase tracking-tight text-center font-['Plus_Jakarta_Sans'] line-clamp-1 mb-0.5 ${
                  isSelected ? 'text-white' : 'text-slate-600'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryScroll;
