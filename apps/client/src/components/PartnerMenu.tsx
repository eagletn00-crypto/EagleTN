import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  category: {
    id: string;
    name_fr: string;
    name_ar: string;
  };
}

export const PartnerMenu = ({ partnerId }: { partnerId: string }) => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select(`
          id,
          name,
          price,
          is_available,
          category:categories (
            id,
            name_fr,
            name_ar
          )
        `)
        .eq('partner_id', partnerId)
        .eq('is_available', true);

      if (!error && data) {
        setItems(data as any);
      }
    };

    if (partnerId) {
      fetchMenu();
    }
  }, [partnerId]);

  // تجميع الأقسام الفريدة
  const categories = Array.from(
    new Map(items.map((item) => [item.category?.id, item.category])).values()
  ).filter(Boolean);

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category?.id === activeCategory);

  return (
    <div className="w-full bg-white p-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* شريط الأقسام (Category Tabs) */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeCategory === 'all'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Tous (الكل)
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name_fr} ({cat.name_ar})
          </button>
        ))}
      </div>

      {/* قائمة الوجبات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3.5 border border-gray-100 rounded-2xl shadow-sm bg-white hover:border-gray-200 transition-all">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
              <p className="text-sm font-extrabold text-red-600 mt-1">
                {Number(item.price).toFixed(3)} DT
              </p>
            </div>
            <button className="bg-red-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-red-700 active:scale-95 transition-all shadow-sm">
              + Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
