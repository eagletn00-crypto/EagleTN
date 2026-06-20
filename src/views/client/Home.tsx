import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

export default function ClientHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  
  // Vue active de l'application client
  const [clientView, setClientView] = useState<'browse' | 'cart' | 'tracking' | 'invoice'>('browse');
  
  // Formulaire Détails de Livraison
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [conditionsAccepted, setConditionsAccepted] = useState(false);

  // États Commande & Suivi Live
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [currentOrderStatus, setCurrentOrderStatus] = useState<string>('pending');
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [orderFinalPrice, setOrderFinalPrice] = useState<number>(0);
  const [orderFinalItems, setOrderFinalItems] = useState<string>('');

  const fetchMenu = async () => {
    const { data } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Écoute en Temps Réel de l'état de la commande (Realtime Infrastructure)
  useEffect(() => {
    if (!currentOrderId) return;

    const channel = supabase
      .channel(`live-tracking-${currentOrderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${currentOrderId}` }, (payload) => {
        const updatedOrder = payload.new;
        setCurrentOrderStatus(updatedOrder.status);
        
        if (updatedOrder.driver_name) {
          setDriverInfo({
            name: updatedOrder.driver_name,
            phone: updatedOrder.driver_phone
          });
        }

        // Basculement automatique vers la facture numérique une fois livré
        if (updatedOrder.status === 'delivered' || updatedOrder.status === 'livre') {
          setClientView('invoice');
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentOrderId]);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id] -= 1;
      else delete updated[id];
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find(prod => prod.id === id);
    return sum + (p ? Number(p.price) * qty : 0);
  }, 0);

  // Soumission et enregistrement de la commande propre dans Supabase
  const handleConfirmOrder = async () => {
    if (!conditionsAccepted || !fullName || !phone || !deliveryAddress) {
      alert("Veuillez remplir tous les champs et accepter les conditions.");
      return;
    }

    const itemSummary = Object.entries(cart).map(([id, qty]) => {
      const p = products.find(prod => prod.id === id);
      return `${qty}x ${p?.name || 'Article'}`;
    }).join(', ');

    setOrderFinalPrice(totalPrice);
    setOrderFinalItems(itemSummary);

    const { data, error } = await supabase.from('orders').insert([
      {
        customer_name: fullName,
        customer_phone: phone,
        delivery_address: deliveryAddress, 
        items: itemSummary,
        total_amount: totalPrice,
        status: 'confirmed',
        pin_code: Math.floor(1000 + Math.random() * 9000).toString(),
        note: "Commande Standard"
      }
    ]).select();

    if (!error && data && data[0]) {
      setCurrentOrderId(data[0].id);
      setCurrentOrderStatus('confirmed');
      setCart({});
      setClientView('tracking');
    } else {
      alert("Erreur lors de la validation de votre commande.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-12 text-left relative">
      
      {/* HEADER FIXE PROFESSIONNEL */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <button 
          onClick={() => {
            if (clientView === 'cart') setClientView('browse');
            else if (clientView === 'tracking') setClientView('browse');
          }} 
          className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white text-slate-700 font-bold hover:bg-slate-50"
        >
          ◀
        </button>
        <span className="text-sm font-black text-slate-900 tracking-tight">EAGLE TN</span>
        <div className="relative cursor-pointer" onClick={() => setClientView('cart')}>
          <span className="text-xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </div>
      </div>

      {/* 1. VUE BROWSE: CARTE DU RESTAURANT */}
      {clientView === 'browse' && (
        <>
          <div className="relative h-44 w-full bg-gradient-to-r from-amber-500/20 to-slate-900 overflow-hidden border-b border-slate-100">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
            <div className="absolute bottom-4 left-6 flex items-center gap-4 z-10">
              <div className="w-16 h-16 bg-slate-900 border-2 border-amber-400 rounded-full flex items-center justify-center text-2xl shadow-xl">🦅</div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight">L'Aigle Royal TN 🇹🇳</h2>
                <p className="text-[11px] text-amber-400 font-bold">Cuisine Tunisienne Premium</p>
              </div>
            </div>
          </div>

          <div className="p-4 max-w-xl mx-auto space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 text-xs">🔍</span>
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Rechercher un plat, sandwich..." className="w-full bg-white border border-slate-200 p-3 pl-10 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400" />
            </div>

            <div className="space-y-3">
              {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => {
                const qty = cart[p.id] || 0;
                return (
                  <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-4 items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-xl relative">🍔</div>
                      <div className="text-left space-y-0.5">
                        <h3 className="font-black text-xs text-slate-800">{p.name}</h3>
                        <p className="text-[11px] font-black text-amber-500 font-mono">{Number(p.price).toFixed(3)} DT</p>
                      </div>
                    </div>
                    <div>
                      {qty === 0 ? (
                        <button onClick={() => addToCart(p.id)} className="bg-slate-900 text-white text-[11px] font-black px-3 py-2 rounded-xl">➕ Ajouter</button>
                      ) : (
                        <div className="flex items-center bg-slate-100 rounded-xl p-1">
                          <button onClick={() => removeFromCart(p.id)} className="w-6 h-6 flex items-center justify-center text-xs font-black text-slate-600">-</button>
                          <span className="w-5 text-center text-xs font-black text-slate-800 font-mono">{qty}</span>
                          <button onClick={() => addToCart(p.id)} className="w-6 h-6 flex items-center justify-center text-xs font-black text-slate-600">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {totalItems > 0 && (
            <div className="fixed bottom-6 left-4 right-4 max-w-md mx-auto z-40">
              <div onClick={() => setClientView('cart')} className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="bg-white text-slate-900 text-[11px] font-black px-2 py-0.5 rounded-md font-mono">{totalItems}</span>
                  <span className="text-xs font-bold font-mono">{totalPrice.toFixed(3)} DT</span>
                </div>
                <span className="text-xs font-black uppercase tracking-wide">Voir le panier 🛒</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2. VUE CART: VOTRE PANIER & FORMULAIRE DE LIVRAISON (CONFORME À LA PHOTO 1000096648) */}
      {clientView === 'cart' && (
        <div className="p-4 max-w-md mx-auto space-y-4 animate-fade-in text-left">
          
          {/* Section Panier de la Photo */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-slate-900">Votre Panier 🛒</h2>
              <button onClick={() => setClientView('browse')} className="text-xs font-bold text-slate-400">Fermer ✕</button>
            </div>

            <div className="space-y-3">
              {Object.entries(cart).map(([id, qty]) => {
                const p = products.find(prod => prod.id === id);
                if (!p) return null;
                return (
                  <div key={id} className="flex justify-between items-center py-1">
                    <div>
                      <p className="text-xs font-black text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{Number(p.price).toFixed(3)} DT <span className="text-slate-300">({qty}x)</span></p>
                    </div>
                    <div className="flex items-center bg-slate-100 rounded-xl p-1">
                      <button onClick={() => removeFromCart(id)} className="w-6 h-6 text-xs font-bold">-</button>
                      <span className="w-5 text-center text-xs font-bold font-mono">{qty}</span>
                      <button onClick={() => addToCart(id)} className="w-6 h-6 text-xs font-bold">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formulaire Détails de Livraison (Identique à la Photo 1000096649) */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
            
            {/* Localisation Confirmée Block */}
            <div className="border border-dashed border-slate-200 p-4 rounded-2xl bg-slate-50 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-200/40 opacity-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <span className="bg-white text-slate-800 text-[10px] font-black px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm inline-block relative z-10">
                📍 Localisation Confirmée
              </span>
            </div>

            <span className="text-[10px] font-black text-slate-400 uppercase block tracking-wider">Détails de livraison 📍</span>

            <div className="space-y-3">
              <input 
                type="text" 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Nom Complet" 
                className="w-full bg-slate-50/60 border border-slate-100 p-3.5 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300"
              />
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Numéro de Téléphone" 
                className="w-full bg-slate-50/60 border border-slate-100 p-3.5 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300"
              />
              <input 
                type="text" 
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Ex: Cité Ibn Khaldoun, Tunis..." 
                className="w-full bg-slate-50/60 border border-slate-100 p-3.5 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-slate-300"
              />
            </div>

            {/* Checkbox Clause de Non-responsabilité Tunisie */}
            <label className="flex gap-3 items-start p-3 bg-red-50/40 border border-red-100/40 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                checked={conditionsAccepted}
                onChange={e => setConditionsAccepted(e.target.checked)}
                className="mt-0.5 accent-slate-900" 
              />
              <span className="text-[10px] font-medium text-slate-600 leading-relaxed text-right w-full" dir="rtl">
                أوافق على شروط التطبيق وهو غير مسؤول عن أي إخلالات خارجة عن سيطرته.
              </span>
            </label>

            {/* زر تأكيد الطلب الفاخر */}
            <button 
              onClick={handleConfirmOrder}
              disabled={totalItems === 0}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-md text-center ${
                conditionsAccepted ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirmer la commande 🚀
            </button>

          </div>

        </div>
      )}

      {/* 3. VUE TRACKING: SUIVI LIVE EN TEMPS RÉEL */}
      {clientView === 'tracking' && (
        <div className="p-4 max-w-md mx-auto space-y-4 text-center">
          <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm space-y-5 text-left">
            <h2 className="text-base font-black text-slate-900">Suivi de Commande en Direct</h2>
            <div className="space-y-3 border-l-2 border-slate-100 pl-4 py-1 ml-2">
              <p className={`text-xs font-bold ${currentOrderStatus === 'confirmed' ? 'text-amber-500' : 'text-slate-400'}`}>🍳 En préparation dans la cuisine</p>
              <p className={`text-xs font-bold ${currentOrderStatus === 'prete' ? 'text-purple-500' : 'text-slate-400'}`}>📦 Prête • En attente du coursier</p>
              <p className={`text-xs font-bold ${currentOrderStatus === 'route' ? 'text-emerald-500' : 'text-slate-400'}`}>🛵 Commande en cours de route</p>
            </div>
            {driverInfo && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Coursier Eagle</p>
                  <p className="text-xs font-black text-slate-800">{driverInfo.name}</p>
                </div>
                <a href={`tel:${driverInfo.phone}`} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Appeler</a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. VUE INVOICE: FACTURE NUMÉRIQUE AU DESIGN TUNISIEN */}
      {clientView === 'invoice' && (
        <div className="p-4 max-w-md mx-auto text-center animate-fade-in">
          <div className="bg-white text-slate-900 p-6 rounded-[2rem] shadow-xl space-y-4 text-left border-2 border-slate-900">
            <div className="text-center border-b border-dashed border-slate-200 pb-3">
              <h2 className="text-sm font-black tracking-wide text-slate-950">EAGLE TN FACTURE</h2>
              <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">Ticket électronique de livraison</p>
            </div>
            <div className="space-y-1 text-xs text-slate-600 border-b border-dashed border-slate-200 pb-3">
              <p><span className="font-bold text-slate-900">Réf:</span> #{currentOrderId?.slice(0, 6).toUpperCase()}</p>
              <p><span className="font-bold text-slate-900">Articles:</span> {orderFinalItems}</p>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-950 pt-1">
              <span>TOTAL PAYÉ</span>
              <span className="font-mono text-emerald-600">{(orderFinalPrice + 2.5).toFixed(3)} DT</span>
            </div>
            <button onClick={() => setClientView('browse')} className="w-full bg-slate-900 text-white font-black py-2.5 rounded-xl text-xs uppercase mt-4">Retour au Menu</button>
          </div>
        </div>
      )}

    </div>
  );
}
