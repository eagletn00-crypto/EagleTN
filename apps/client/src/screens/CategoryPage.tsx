import React from 'react';
import { ArrowLeft, Utensils, Cake, Store } from 'lucide-react';

interface CategoryPageProps {
  onBack: () => void;
}

export default function CategoryPage({ onBack }: CategoryPageProps) {
  const categories = [
    { id: 'RESTO', label: 'Restaurants', icon: Utensils },
    { id: 'PATISSERIE', label: 'Pâtisserie', icon: Cake },
    { id: 'SHOP', label: 'Shopping', icon: Store }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 font-sans" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-gray-50 rounded-full border border-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h2 className="text-sm font-black text-gray-950 uppercase tracking-widest">Écosystème</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col items-center gap-3 shadow-3xs cursor-pointer hover:border-gray-200 transition-all">
            <cat.icon className="w-6 h-6 text-gray-950" />
            <span className="text-[10px] font-black">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
