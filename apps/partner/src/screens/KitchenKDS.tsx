import React, { useState } from 'react';
import { KitchenOrderCard, KitchenOrder } from '../components/kitchen/KitchenOrderCard';
import { ChefHat, ArrowRight, RefreshCw, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_ORDERS: KitchenOrder[] = [
  {
    id: '1',
    shortId: '3FA0DB5A',
    customerName: 'Jsjdjj Ndjdjd',
    pinCode: '7628',
    elapsedMinutes: 4,
    status: 'PENDING',
    items: [
      { id: 'i1', name: 'Plat Ojja Royale', quantity: 2, notes: 'بدون حار زيادة' },
      { id: 'i2', name: 'Brik à l\'œuf', quantity: 1 },
    ],
  },
  {
    id: '2',
    shortId: 'FFBF742D',
    customerName: 'Jsjs Biskra',
    pinCode: '0561',
    elapsedMinutes: 12,
    status: 'PREPARING',
    items: [
      { id: 'i3', name: 'Couscous Poisson', quantity: 1 },
      { id: 'i4', name: 'Sandwich Mlawi Poulet', quantity: 3 },
    ],
  },
];

export default function KitchenKDS() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);

  const handleAccept = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'PREPARING' } : o))
    );
  };

  const handleMarkReady = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: 'READY' } : o))
    );
  };

  const activeOrders = orders.filter((o) => o.status !== 'READY');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 pb-24">
      {/* Top Header */}
      <header className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-xs mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-500 text-white rounded-2xl shadow-xs">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                شاشة المطبخ (KDS)
              </h1>
              <p className="text-xs text-slate-400 font-medium">الطلبات النشطة والتحضير</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 bg-slate-50 border border-slate-200/80 text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-slate-50 border border-slate-200/80 text-slate-600 rounded-2xl hover:bg-slate-100 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Orders Grid */}
      <main>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span>الطلبات القيد الإنجاز</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
              {activeOrders.length}
            </span>
          </h2>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <p className="text-slate-400 font-medium text-sm">لا توجد طلبات جديدة حالياً في المطبخ ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onMarkReady={handleMarkReady}
                onPrint={(id) => console.log('Print order:', id)}
              />
            ))}
          </div>
        )}

        {/* Ready Orders Section */}
        {readyOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold text-slate-700 mb-3 px-1">
              طلبات جاهزة للتسليم ({readyOrders.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-80">
              {readyOrders.map((order) => (
                <KitchenOrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
