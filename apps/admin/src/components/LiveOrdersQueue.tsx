import React from 'react';
import { Clock, ShoppingBag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../stores/useAdminStore';

export default function LiveOrdersQueue() {
  const { orders } = useAdminStore();

  // فلترة الطلبات الحية (المعلقة، قيد التحضير، والجاهزة)
  const liveOrders = orders.filter(o => 
    ['pending', 'in_preparation', 'ready_for_pickup'].includes(o.status)
  );

  // دالة لترجمة حالة الطلب لتناسب الواجهة
  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'En attente d\'acceptation';
      case 'in_preparation': return 'En préparation';
      case 'ready_for_pickup': return 'Prêt (Attente Livreur)';
      default: return status;
    }
  };

  return (
    <div className="bg-[#E9EBEF] p-5 rounded-[2rem] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] border border-white/40 flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center px-1">
        <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4" /> Commandes en Souffrance
        </span>
        <span className={`text-[9px] font-bold px-2 py-1 rounded-md ${liveOrders.length > 0 ? 'bg-[#E9EBEF] shadow-[2px_2px_4px_#c8cad0,-2px_-2px_4px_#ffffff] text-rose-600 animate-pulse' : 'bg-transparent text-emerald-600'}`}>
          {liveOrders.length} {liveOrders.length > 1 ? 'Alertes' : 'Alerte'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        
        {liveOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400 mt-10">
            <CheckCircle2 className="w-8 h-8 opacity-50" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Aucune commande en attente</span>
          </div>
        ) : (
          liveOrders.map((order) => (
            <div key={order.id} className="bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] p-4 rounded-xl border border-white/20 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-stone-800 uppercase tracking-widest">
                  CMD-{order.id.split('-')[0].toUpperCase()}
                </span>
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                  <Clock className="w-3 h-3"/> Live
                </span>
              </div>
              
              <p className="text-[9px] text-stone-600 font-bold uppercase tracking-wide">
                {order.partner_id ? 'ID Partenaire: ' + order.partner_id.substring(0,8) : 'Partenaire inconnu'} ➔ {getStatusText(order.status)}
              </p>
              
              <div className="flex justify-between items-center mt-1">
                <span className={`text-[9px] font-black flex items-center gap-1 ${order.status === 'ready_for_pickup' ? 'text-rose-600' : 'text-stone-500'}`}>
                  {order.status === 'ready_for_pickup' && <AlertTriangle className="w-3 h-3"/>} 
                  {order.status === 'ready_for_pickup' ? 'Alerte: Livreur Requis' : 'En cours'}
                </span>
                <button className="text-[9px] font-black bg-[#E9EBEF] shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] text-blue-700 px-3 py-1.5 rounded-lg uppercase tracking-widest transition-all hover:text-blue-800">
                  {order.status === 'ready_for_pickup' ? 'Forcer Dispatch' : 'Détails'}
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}
