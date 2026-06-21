import React, { useState } from 'react';

interface Order {
  id: string;
  client: string;
  adresse: string;
  prix: string;
  status: 'En attente' | 'En cours' | 'Livré';
}

const LivreurScreen: React.FC = () => {
  // بيانات افتراضية حية لمحاكاة الطلبات المتاحة لرجال التوصيل في تونس
  const [orders, setOrders] = useState<Order[]>([
    { id: '#EG-9021', client: 'Ahmed Ben Ali', adresse: 'Ennasr 2, Tunis', prix: '12.500 DT', status: 'En attente' },
    { id: '#EG-4412', client: 'Sara Mansour', adresse: 'Lac 1, Tunis', prix: '8.000 DT', status: 'En cours' }
  ]);

  const handleAcceptOrder = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: 'En cours' } : order
    ));
    alert(`Commande ${id} acceptée. En route vers le client!`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans pb-20">
      
      {/* البار العلوي الخاص بالسائقين */}
      <header className="p-5 border-b border-zinc-800 bg-[#18181b] sticky top-0 z-50 flex justify-between items-center">
        <div>
          <span className="text-xs text-amber-500 font-bold tracking-widest uppercase">ESPACE LIVREUR</span>
          <h1 className="text-lg font-black tracking-wide text-white">Eagle.TN 🦅</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-zinc-400">En Ligne</span>
        </div>
      </header>

      {/* لوحة التحكم والطلبات الحالية */}
      <main className="p-5 max-w-md mx-auto w-full flex-1">
        
        {/* إحصائيات سريعة للسائق */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-[#18181b] border border-zinc-800 rounded-xl">
            <span className="text-zinc-500 text-[11px] block uppercase font-bold">Aujourd'hui</span>
            <span className="text-xl font-black text-amber-500">45.000 DT</span>
          </div>
          <div className="p-4 bg-[#18181b] border border-zinc-800 rounded-xl">
            <span className="text-zinc-500 text-[11px] block uppercase font-bold">Courses</span>
            <span className="text-xl font-black text-white">6 Livrées</span>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Commandes Disponibles</h3>

        {/* قائمة الطلبات المستجيبة للويب والتيلويند */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-5 bg-[#18181b] border border-zinc-800 rounded-xl shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-xs font-mono text-zinc-500">{order.id}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{order.client}</h4>
                </div>
                <span className="text-sm font-black text-amber-500">{order.prix}</span>
              </div>

              <div className="text-xs text-zinc-400 mb-4 flex items-center gap-1.5">
                <span>📍</span> {order.adresse}
              </div>

              <div className="flex justify-between items-center">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  order.status === 'En attente' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {order.status}
                </span>
                
                {order.status === 'En attente' && (
                  <button 
                    onClick={() => handleAcceptOrder(order.id)}
                    className="px-4 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-600 active:scale-95 transition-all focus:outline-none"
                  >
                    Accepter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default LivreurScreen;
