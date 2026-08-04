import React, { useState } from 'react';

export const CategorySelector: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tout les plats' },
    { id: 'tunisian', label: 'Spécialités Tunisiennes' },
    { id: 'desserts', label: 'Desserts & Citronnades' }
  ];

  return (
    <div className="w-full py-4 overflow-x-auto no-scrollbar flex items-center space-x-2">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-5 h-9 rounded-full text-xs font-bold tracking-wide transition-all duration-300 whitespace-nowrap ${
              isActive 
                ? 'bg-[#09090b] dark:bg-white text-white dark:text-[#09090b] shadow-sm' 
                : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'
            }`}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
};
