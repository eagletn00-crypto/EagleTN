import React, { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Search, Plus, Star, ShoppingCart, X, Minus, Trash2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const fallbackProducts = [
  { id: 1, name: 'Poulet Complet', description: 'Poulet rôti au feu de bois avec frites et salade', price: 24000, image_url: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=400' },
  { id: 2, name: 'Kaftaji', description: 'Mélange de légumes frits, œufs, foie', price: 8500, image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?q=80&w=400' },
  { id: 3, name: 'Couscous Agneau', description: 'Couscous traditionnel à la viande d\'agneau', price: 28000, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400' },
  { id: 4, name: 'Brik', description: 'Feuille de brick, œuf, thon, persil', price: 3500, image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400' },
];

const formatTunisianPrice = (millimes: number) => {
  return (millimes / 1000).toFixed(3) + ' DT';
};

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [restaurant, setRestaurant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cart State
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const { data: restData } = await supabase.from('restaurants').select('*').eq('id', 1).single();
        if (restData) setRestaurant(restData);

        const { data: prodData } = await supabase.from('products').select('*').eq('restaurant_id', 1);
        if (prodData && prodData.length > 0) {
          const formattedProducts = prodData.map(p => ({
            ...p,
            price: Math.round(Number(p.price) * 1000)
          }));
          setProducts(formattedProducts);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.error(error);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantData();
  }, []);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const sousTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const fraisLivraison = 4500;
  const timbreFiscal = 1000;
  const totalAPayer = sousTotal > 0 ? sousTotal + fraisLivraison + timbreFiscal : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 relative overflow-hidden">
      
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-between items-center p-4">
        <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md text-gray-800 hover:bg-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-3">
          <button className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md text-gray-800 hover:bg-white transition-colors">
            <Heart size={20} />
          </button>
          <button onClick={() => setIsCartOpen(true)} className="bg-white/80 backdrop-blur-md p-2 rounded-full shadow-md text-gray-800 hover:bg-white transition-colors relative">
            <ShoppingCart size={20} />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Cover & Chef Avatar */}
      <div className="relative mb-10">
        <div className="w-full h-52 relative overflow-hidden">
          <img 
            src={restaurant?.cover_url || "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800"} 
            alt="Restaurant Cover" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 z-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">{restaurant?.name || 'Chez Am Ali'}</h1>
            <p className="text-white font-bold text-sm mt-1">★ Top 7 Eagle</p>
          </div>
        </div>

        <img 
          src={restaurant?.logo_url || "https://images.unsplash.com/photo-1581382575275-97901c2635b7?q=80&w=200"} 
          alt="Chef Avatar" 
          className="rounded-full h-16 w-16 border-4 border-white absolute shadow-lg -bottom-8 right-6 object-cover z-20 bg-white"
        />
      </div>

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Tout', 'Spécialités', 'Plats', 'Sandwichs', 'Boissons'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un plat..." 
            className="w-full bg-white border border-gray-200 rounded-full py-3 pl-12 pr-4 text-sm outline-none text-gray-700 shadow-sm placeholder-gray-400 focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {products.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden">
            
            <div className="relative h-28 w-full">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-1 rounded-lg">
                {formatTunisianPrice(item.price)}
              </div>
            </div>

            <div className="p-3 flex flex-col flex-1 justify-between bg-white">
              <div>
                <h3 className="line-clamp-1 font-bold text-gray-800 text-xs">{item.name}</h3>
                <p className="line-clamp-2 text-[10px] text-gray-400 mt-1">{item.description}</p>
              </div>
              
              <button onClick={() => addToCart(item)} className="w-full mt-3 text-white text-[10px] font-black py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 bg-red-600 hover:bg-red-700">
                <Plus size={14} strokeWidth={3} /> Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Drawer Cart (Panier) */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
        
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          {/* Cart Header */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ShoppingCart size={24} className="text-red-600" />
              Votre Panier
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <ShoppingCart size={64} className="opacity-20" />
                <p className="font-bold text-sm">Votre panier est vide</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm relative group">
                  <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <h4 className="font-bold text-sm text-gray-800 line-clamp-1 pr-6">{item.name}</h4>
                    <span className="font-black text-red-600 text-xs">{formatTunisianPrice(item.price)}</span>
                    
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1.5 text-gray-600 hover:text-black transition-colors"><Minus size={14} strokeWidth={3} /></button>
                        <span className="text-xs font-black w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1.5 text-gray-600 hover:text-black transition-colors"><Plus size={14} strokeWidth={3} /></button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Invoice Breakdown */}
          {cart.length > 0 && (
            <div className="bg-gray-50 p-6 border-t border-gray-100 rounded-t-3xl">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Sous-total</span>
                  <span>{formatTunisianPrice(sousTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Frais de livraison</span>
                  <span>{formatTunisianPrice(fraisLivraison)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                  <span>Timbre Fiscal</span>
                  <span>{formatTunisianPrice(timbreFiscal)}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                  <span className="text-lg font-black text-gray-900">Total à payer</span>
                  <div className="bg-red-600 px-4 py-2 rounded-xl text-white font-black text-lg shadow-md">
                    {formatTunisianPrice(totalAPayer)}
                  </div>
                </div>
              </div>

              <button onClick={() => navigate('/checkout')} className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl shadow-[0_10px_25px_rgba(220,38,38,0.4)] active:scale-95 transition-all flex justify-center items-center gap-2">
                Passer la commande
              </button>
            </div>
          )}
          
        </div>
      </div>

    </div>
  );
};

export default RestaurantMenu;
