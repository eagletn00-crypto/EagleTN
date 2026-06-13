import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
// 💡 تم إصلاح وتدقيق الاستيراد الكامل لجميع الأيقونات المستخدمة لمنع الشاشة البيضاء نهائياً
import { Bike, MapPin, CheckCircle, Package, ArrowRight, Phone, ShieldCheck, XCircle, RefreshCw, Navigation, Wallet, MessageCircle, AlertTriangle, Radio, Compass, Clock, Activity, Radar, Power, Store, User } from 'lucide-react';

interface LivreurDashboardProps {
  onLogout: () => void;
}

export default function LivreurDashboard({ onLogout }: LivreurDashboardProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'missions' | 'portefeuille' | 'journal'>('missions');
  
  const [showHandoffModal, setShowHandoffModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [inputPin, setInputPin] = useState('');

  useEffect(() => {
    fetchLiveOrders();
    const channel = supabase.channel('eagle_rider_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchLiveOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchLiveOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    await supabase.from('orders').update({ status: nextStatus }).eq('id', orderId);
    fetchLiveOrders();
  };

  const handleAcceptMission = async (orderId: string) => {
    await supabase.from('orders').update({ status: 'accepted_livreur' }).eq('id', orderId);
    fetchLiveOrders();
  };

  const handleVerifyPin = async () => {
    if (inputPin === selectedOrder?.pin_code) {
      await supabase.from('orders').update({ status: 'route' }).eq('id', selectedOrder.id);
      setShowHandoffModal(false);
      setInputPin('');
      fetchLiveOrders();
    } else {
      alert("Code PIN Incorrect! Veuillez vérifier avec le client.");
    }
  };

  const extractNote = (addressStr: string) => {
    if (!addressStr) return "Aucune note";
    const parts = addressStr.split('| Note:');
    return parts.length > 1 ? parts[1].trim() : "Aucune note";
  };

  const extractCleanAddress = (addressStr: string) => {
    if (!addressStr) return '';
    return addressStr.split('| Note:')[0].trim();
  };

  // تصفية دقيقة للمهمات بناءً على الـ Schema الحقيقي المرفق في صورك
  const availableCourses = orders.filter(o => o.status === 'prete');
  const activeMissions = orders.filter(o => ['accepted_livreur', 'route'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');

  // حساب المحفظة الفاخرة بالدينار التونسي
  const walletTotal = completedOrders.length * 4.500; 

  return (
    <div className="min-h-screen w-full bg-[#0c101b] text-white font-sans overflow-x-hidden pb-24 max-w-md mx-auto relative shadow-2xl">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes radar { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2.5); opacity: 0; } }
        .animate-radar::before, .animate-radar::after { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid #10b981; animation: radar 3s linear infinite; }
        .animate-radar::after { animation-delay: 1.5s; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      {/* HEADER - EAGLE.RIDER PRO */}
      <div className="bg-[#121826] p-4 pt-8 border-b border-white/5 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <span className="text-xl">🦅</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-white uppercase">EAGLE.RIDER PRO</h1>
              <p className="text-[11px] font-black tracking-widest text-amber-500 uppercase">AHMED BEN ALI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-3 py-1.5 flex items-center gap-1">
              <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
              <span className="text-[9px] font-black text-[#10b981] uppercase tracking-wider">DISPONIBLE</span>
            </div>
            <button onClick={onLogout} className="text-slate-400 hover:text-red-500 p-2 bg-white/5 rounded-xl border border-white/5 transition-colors">
              <Power size={16}/>
            </button>
          </div>
        </div>

        {/* TOP LEVEL THREE TABS */}
        <div className="grid grid-cols-3 gap-2 bg-black/40 p-1 rounded-xl border border-white/5 mt-4">
          <button onClick={() => setActiveTab('missions')} className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-center transition-all relative ${activeTab === 'missions' ? 'bg-amber-500 text-slate-950 shadow-lg font-black' : 'text-slate-400'}`}>
            MISSIONS
            {availableCourses.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce">{availableCourses.length}</span>}
          </button>
          <button onClick={() => setActiveTab('portefeuille')} className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-center transition-all ${activeTab === 'portefeuille' ? 'bg-amber-500 text-slate-950 shadow-lg font-black' : 'text-slate-400'}`}>PORTEFEUILLE</button>
          <button onClick={() => setActiveTab('journal')} className={`py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-center transition-all ${activeTab === 'journal' ? 'bg-amber-500 text-slate-950 shadow-lg font-black' : 'text-slate-400'}`}>JOURNAL</button>
        </div>
      </div>

      {/* TAB Content Area */}
      <div className="p-4 space-y-4">
        
        {/* MISSIONS TAB */}
        {activeTab === 'missions' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* 1. Courses Actives SECTION */}
            {activeMissions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <Compass size={14} className="animate-spin"/> 
                  <h3 className="text-[10px] font-black uppercase tracking-widest">Mission active en cours</h3>
                </div>
                {activeMissions.map(order => (
                  <div key={order.id} className="bg-amber-500 text-slate-950 p-5 rounded-[2rem] shadow-xl space-y-4 border border-amber-400">
                    <div className="flex justify-between items-center border-b border-slate-950/10 pb-2">
                      <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1">📍 Am Ali Kitchen</span>
                      <span className="font-mono font-black text-sm">{Number(order.total_price || 0).toFixed(3)} DT</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider block">DESTINATION CLIENT</span>
                      <h4 className="text-base font-black leading-tight flex items-center gap-1">📊 {extractCleanAddress(order.delivery_address)}</h4>
                    </div>

                    <div className="bg-black/10 border border-black/5 p-3 rounded-xl">
                      <span className="text-[9px] font-black text-slate-800 uppercase tracking-wider block">📝 NOTE DU CLIENT:</span>
                      <p className="text-xs font-black mt-0.5">{extractNote(order.delivery_address)}</p>
                    </div>

                    {/* OpenStreetMap Overlay */}
                    <div className="w-full h-32 bg-slate-900 rounded-xl overflow-hidden border border-black/10 shadow-inner relative">
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(order.delivery_lng || 10.1815)-0.003},${Number(order.delivery_lat || 36.8065)-0.003},${Number(order.delivery_lng || 10.1815)+0.003},${Number(order.delivery_lat || 36.8065)+0.003}&layer=mapnik`}
                        width="100%" height="100%" style={{ border: 0, pointerEvents: 'none' }}
                      ></iframe>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-white">
                      <a href={`tel:${order.customer_phone}`} className="bg-slate-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-1"><Phone size={12}/> Call Client</a>
                      <a href={`https://wa.me/216${order.customer_phone}`} target="_blank" rel="noreferrer" className="bg-emerald-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-center flex items-center justify-center gap-1">WhatsApp</a>
                    </div>

                    {order.status === 'accepted_livreur' ? (
                      <button onClick={() => updateOrderStatus(order.id, 'route')} className="w-full bg-slate-950 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform">
                        Confirmer l'arrivée au restaurant 🧑‍🍳
                      </button>
                    ) : (
                      <button onClick={() => { setSelectedOrder(order); setShowHandoffModal(true); }} className="w-full bg-slate-950 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform flex items-center justify-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-400"/> Confirmer (PIN CLIENT)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 2. Courses Disponibles SECTION */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Radio size={14} className="text-emerald-400 animate-pulse"/> 
                <h3 className="text-[10px] font-black uppercase tracking-widest">Course Disponible Proche</h3>
              </div>
              
              {availableCourses.length === 0 ? (
                <div className="bg-[#121826] p-8 rounded-[2rem] text-center border border-white/5 opacity-60 flex flex-col items-center justify-center">
                  <Package size={32} className="text-slate-500 mb-2" />
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Aucune course aux alentours</p>
                </div>
              ) : (
                availableCourses.map(order => (
                  <div key={order.id} className="bg-[#121826] p-5 rounded-[2rem] border border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono font-black text-slate-500 block">CODE: #DEL-{String(order.id).slice(0,4).toUpperCase()}</span>
                        <span className="text-xs font-black text-slate-300 block mt-1">Dist. Delivery: 2.4 KM</span>
                      </div>
                      <span className="bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 px-3 py-1 rounded-full font-mono text-xs font-black">+ 4.500 DT</span>
                    </div>

                    <div className="space-y-2 border-t border-b border-white/5 py-3 text-xs">
                      <div>
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-wider block">Enlèvement (Restaurant)</span>
                        <p className="font-bold text-slate-300">Am Ali Kitchen • Cité Tunis</p>
                      </div>
                      <div className="pt-1">
                        <span className="text-[9px] font-black text-sky-400 uppercase tracking-wider block">Destination (Client)</span>
                        <p className="font-bold text-slate-300">{order.customer_name} • {extractCleanAddress(order.delivery_address)}</p>
                      </div>
                    </div>

                    <button onClick={() => handleAcceptMission(order.id)} className="w-full bg-[#10b981] text-slate-950 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#059669] transition-colors">
                      Accepter la Course 🚀
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* PORTEFEUILLE TAB */}
        {activeTab === 'portefeuille' && (
          <div className="bg-[#121826] p-6 rounded-[2.5rem] border border-white/5 space-y-4 animate-fade-in">
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">SOLDE PORTEFEUILLE</span>
            <h2 className="text-4xl font-black text-amber-500 font-mono">{walletTotal.toFixed(3)} <span className="text-sm text-slate-400">DT</span></h2>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-2 text-xs font-bold text-slate-400">
              <div className="flex justify-between"><span>Courses Livrées</span><span className="text-white font-mono">{completedOrders.length}</span></div>
              <div className="flex justify-between"><span>Bonus Fixe / Course</span><span className="text-emerald-400 font-mono">4.500 DT</span></div>
            </div>
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Historique des courses validées</h3>
            {completedOrders.length === 0 ? (
              <p className="text-xs font-bold text-slate-500 text-center py-6">Aucune course livrée enregistrée dans le journal.</p>
            ) : (
              completedOrders.map(o => (
                <div key={o.id} className="bg-[#121826] p-4 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-black text-white">CMD #{String(o.id).slice(0,6).toUpperCase()}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="font-mono font-black text-[#10b981]">+ 4.500 DT</span>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* HANDOFF SECURITY MODAL */}
      {showHandoffModal && (
        <div className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121826] border border-white/10 w-full max-w-sm rounded-[2.5rem] p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full mx-auto flex items-center justify-center border border-amber-500/30">
              <ShieldCheck size={28} className="text-amber-500"/>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Validation de Livraison</h3>
            <p className="text-xs text-slate-400 font-medium">Veuillez insérer le code PIN secret fourni par le client pour clôturer la commande.</p>
            
            <input 
              type="text" 
              maxLength={4}
              placeholder="----"
              value={inputPin}
              onChange={e => setInputPin(e.target.value)}
              className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-amber-500 text-center text-2xl font-mono font-black tracking-widest focus:outline-none focus:border-amber-500" 
            />

            <div className="flex gap-2 pt-2">
              <button onClick={() => { setShowHandoffModal(false); setInputPin(''); }} className="flex-1 bg-white/5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-400">Annuler</button>
              <button onClick={handleVerifyPin} className="flex-1 bg-amber-500 text-slate-950 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider">Clôturer la Course</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
