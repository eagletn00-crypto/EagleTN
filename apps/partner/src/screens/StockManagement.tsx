import React, { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StockItem {
  id: string;
  name: string;
  available: boolean;
}

const INITIAL_STOCK: StockItem[] = [
  { id: '1', name: 'Plat Ojja Royale', available: true },
  { id: '2', name: 'Couscous Poisson', available: true },
  { id: '3', name: 'Brik à l\'œuf', available: false },
  { id: '4', name: 'Sandwich Mlawi Poulet', available: true },
];

export default function StockManagement() {
  const navigate = useNavigate();
  const [items, setItems] = useState<StockItem[]>(INITIAL_STOCK);

  const toggleAvailability = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 bg-white border border-slate-200/80 text-slate-700 rounded-2xl hover:bg-slate-100 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">إدارة المخزون السريع</h1>
            <p className="text-xs text-slate-400 font-medium">تحديد توفر الأطباق بضغطة واحدة</p>
          </div>
        </header>

        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-xs space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleAvailability(item.id)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                item.available
                  ? 'bg-slate-50/60 border-slate-100 hover:bg-slate-100/80'
                  : 'bg-red-50/30 border-red-100 text-slate-400'
              }`}
            >
              <span className={`text-sm font-bold ${item.available ? 'text-slate-900' : 'line-through text-slate-400'}`}>
                {item.name}
              </span>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  item.available ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                }`}>
                  {item.available ? 'متوفر' : 'غير متوفر'}
                </span>

                <div
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${
                    item.available ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                      item.available ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  >
                    {item.available ? (
                      <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                    ) : (
                      <X className="w-3 h-3 text-slate-400 stroke-[3]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
