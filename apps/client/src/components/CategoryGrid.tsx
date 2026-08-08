import React from 'react';
import { useRestaurantStore } from '../store/useRestaurantStore';

const categories = [
  { id: 'traditionnel', name: 'Traditionnel', icon: '🍲' },
  { id: 'pizzas', name: 'Pizzas', icon: '🍕' },
  { id: 'burgers', name: 'Burgers', icon: '🍔' },
  { id: 'sucre', name: 'Sucré', icon: '🍰' },
];

const CategoryGrid: React.FC = () => {
  const { activeCategoryFilter, setActiveCategory } = useRestaurantStore();

  return (
    <div className="space-y-2">
      <h2 className="text-[11px] font-black tracking-wider text-slate-400 uppercase px-1">
        Explorer l'écosystème
      </h2>
      <div className="grid grid-cols-4 gap-2.5">
        {categories.map((cat) => {
          const isSelected = activeCategoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(isSelected ? null : cat.id)}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-95'
                  : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-tight text-center">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
