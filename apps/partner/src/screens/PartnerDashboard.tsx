import React, { useState, useRef } from 'react';
import { LayoutGrid, UtensilsCrossed, Store, Settings, Camera, Loader2, Edit3, Check, X, Flame, Star, Search, Wallet, FileText, Upload, Plus, Image as ImageIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  partner_id: string;
  name_fr: string;
  name_ar: string;
  price: number;
  img: string;
  is_available: boolean;
  is_spicy: boolean;
  is_popular: boolean;
}

interface OrderFacture {
  id: string;
  order_code: string;
  date: string;
  customer: string;
  total_gross: number;
  status: 'DELIVERED' | 'PENDING' | 'CANCELLED';
}

const INITIAL_ORDERS: OrderFacture[] = [
  { id: 'ord-101', order_code: 'EAG-9821', date: '2026-08-02 19:40', customer: 'Sami K.', total_gross: 45.000, status: 'DELIVERED' },
  { id: 'ord-102', order_code: 'EAG-9825', date: '2026-08-02 20:15', customer: 'Yassine M.', total_gross: 28.500, status: 'DELIVERED' },
  { id: 'ord-103', order_code: 'EAG-9830', date: '2026-08-02 20:30', customer: 'Amel B.', total_gross: 62.000, status: 'DELIVERED' },
];

const INITIAL_31_ITEMS: MenuItem[] = [
  { id: '1', partner_id: 'p-8842', name_fr: 'Lablabi Spécial Royal', name_ar: 'لبلابي سبسيال ملكي', price: 9.500, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', is_available: true, is_spicy: true, is_popular: true },
  { id: '2', partner_id: 'p-8842', name_fr: 'Kafteji Tunisien Thon', name_ar: 'كفتاجي تونسي بالتن', price: 7.500, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', is_available: true, is_spicy: true, is_popular: true },
  { id: '3', partner_id: 'p-8842', name_fr: 'Ojja Escalope Moules', name_ar: 'عجة إسكالوب', price: 11.000, img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '4', partner_id: 'p-8842', name_fr: 'Couscous Agneau Trad', name_ar: 'كسكسي علوش تقليدي', price: 18.500, img: 'https://images.unsplash.com/photo-1541518763669-27fef04b14e8?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '5', partner_id: 'p-8842', name_fr: 'Tajine Tunisien Poulet', name_ar: 'طاجين تونسي بالدجاج', price: 4.500, img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '6', partner_id: 'p-8842', name_fr: 'Brik à l\'Œuf et Thon', name_ar: 'بريكة بالعظمة والتن', price: 3.000, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '7', partner_id: 'p-8842', name_fr: 'Mloukhia Tunisienne', name_ar: 'ملوخية تونسية بالبقر', price: 16.000, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '8', partner_id: 'p-8842', name_fr: 'Pâte Makrouna Poulet', name_ar: 'مقرونة تونسية بالدجاج', price: 10.500, img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400', is_available: true, is_spicy: true, is_popular: false },
  { id: '9', partner_id: 'p-8842', name_fr: 'Chorba Frik Poisson', name_ar: 'شوربة فريك بالحوت', price: 8.000, img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', is_available: true, is_spicy: true, is_popular: false },
  { id: '10', partner_id: 'p-8842', name_fr: 'Kamounia Viande', name_ar: 'كمونية بلحم البقر', price: 14.000, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '11', partner_id: 'p-8842', name_fr: 'Grillade Mixte Royale', name_ar: 'مشاوي مشكلة ملكية', price: 24.000, img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '12', partner_id: 'p-8842', name_fr: 'Chakchouka Foie', name_ar: 'شكشوكة بالكبذة', price: 9.000, img: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400', is_available: true, is_spicy: true, is_popular: false },
  { id: '13', partner_id: 'p-8842', name_fr: 'Salade Mechouia Frite', name_ar: 'سلاطة مشوية بالتن والعظم', price: 6.000, img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', is_available: true, is_spicy: true, is_popular: true },
  { id: '14', partner_id: 'p-8842', name_fr: 'Salade Tunisienne', name_ar: 'سلاطة تونسية خضراء', price: 5.000, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '15', partner_id: 'p-8842', name_fr: 'Poisson Daurade Grillé', name_ar: 'وراطة مشوية على الفحم', price: 22.000, img: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '16', partner_id: 'p-8842', name_fr: 'Sandwich Mlawi Escalope', name_ar: 'ملاوي إسكالوب جبن', price: 6.500, img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400', is_available: true, is_spicy: true, is_popular: true },
  { id: '17', partner_id: 'p-8842', name_fr: 'Sandwich Chapati Mahdia', name_ar: 'شباتي مهداوي كامل', price: 5.500, img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', is_available: true, is_spicy: true, is_popular: true },
  { id: '18', partner_id: 'p-8842', name_fr: 'Makloub Thon Fromage', name_ar: 'مقلوب تن وجبن', price: 7.000, img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '19', partner_id: 'p-8842', name_fr: 'Bambalouni Chaud', name_ar: 'بمبالوني سخون بالسكر', price: 1.500, img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '20', partner_id: 'p-8842', name_fr: 'Masfouf Dattes et Grenade', name_ar: 'مسفوف بدقلة ورومان', price: 6.000, img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '21', partner_id: 'p-8842', name_fr: 'Assidat Zgougou Royale', name_ar: 'عصيدة زقوقو بالمكسرات', price: 8.500, img: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=400', is_available: false, is_spicy: false, is_popular: true },
  { id: '22', partner_id: 'p-8842', name_fr: 'Citronnade Fraîche 0.5L', name_ar: 'ليموناضة تونسية منعشة', price: 3.500, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '23', partner_id: 'p-8842', name_fr: 'Thé à la Menthe Pignons', name_ar: 'تاي بالنعناع والبندق', price: 4.000, img: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '24', partner_id: 'p-8842', name_fr: 'Gazouza Boga Cidre', name_ar: 'بوظة سيدر باردة', price: 2.500, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '25', partner_id: 'p-8842', name_fr: 'Eau Minérale Sabrine 1.5L', name_ar: 'ماء معدني صابرين', price: 1.500, img: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '26', partner_id: 'p-8842', name_fr: 'Fricassé Tunisien (3 pcs)', name_ar: 'فريكاسي تونسي (3 قطعات)', price: 4.500, img: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400', is_available: true, is_spicy: true, is_popular: true },
  { id: '27', partner_id: 'p-8842', name_fr: 'Koucha Agneau au Four', name_ar: 'كوشة علوش بالبطاطا', price: 21.000, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', is_available: true, is_spicy: false, is_popular: true },
  { id: '28', partner_id: 'p-8842', name_fr: 'Markat Jelbana Veau', name_ar: 'مرقة جلبانة بلحم البقر', price: 13.500, img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '29', partner_id: 'p-8842', name_fr: 'Rouz Jerbi Traditionnel', name_ar: 'رز جربي متبل', price: 11.500, img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', is_available: true, is_spicy: true, is_popular: true },
  { id: '30', partner_id: 'p-8842', name_fr: 'Mosli Poulet au Four', name_ar: 'مصلي دجاج بالكركم', price: 12.000, img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400', is_available: true, is_spicy: false, is_popular: false },
  { id: '31', partner_id: 'p-8842', name_fr: 'Plat Shawarma Arabi', name_ar: 'صحن شاورما عربي متكامل', price: 12.500, img: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400', is_available: true, is_spicy: true, is_popular: true },
];

export default function PartnerDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wallet' | 'menu' | 'store' | 'settings'>('menu');
  const [isOpen, setIsOpen] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_31_ITEMS);
  const [orders] = useState<OrderFacture[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [storeCover, setStoreCover] = useState('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // FINANCIAL CALCULATIONS (Eagle 10% + TVA 7%)
  const totalGrossRevenue = orders.reduce((acc, curr) => acc + curr.total_gross, 0);
  const eagleCommissionTotal = totalGrossRevenue * 0.10;
  const tvaTotal = eagleCommissionTotal * 0.07;
  const totalDeductions = eagleCommissionTotal + tvaTotal;
  const netWalletBalance = totalGrossRevenue - totalDeductions;

  const handleToggleStoreStatus = () => {
    setIsUpdatingStatus(true);
    setTimeout(() => {
      setIsOpen(!isOpen);
      setIsUpdatingStatus(false);
    }, 400);
  };

  const startEditing = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditForm(item);
  };

  const saveEditing = (id: string) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...editForm } as MenuItem : item));
    setEditingItemId(null);
  };

  // Image Upload Handlers
  const handleItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditForm(prev => ({ ...prev, img: imageUrl }));
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStoreCover(URL.createObjectURL(file));
    }
  };

  const toggleItemFlag = (id: string, field: 'is_available' | 'is_spicy' | 'is_popular') => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, [field]: !item[field] } : item));
  };

  const filteredItems = menuItems.filter(item => 
    item.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.name_ar.includes(searchQuery)
  );

  return (
    <div dir="ltr" className="min-h-screen w-full flex flex-row bg-slate-50 text-slate-900 overflow-x-hidden">
      
      {/* Hidden inputs for uploading images */}
      <input type="file" ref={fileInputRef} onChange={handleItemImageUpload} accept="image/*" className="hidden" />
      <input type="file" ref={coverInputRef} onChange={handleCoverUpload} accept="image/*" className="hidden" />

      {/* 1. LEFT SIDEBAR */}
      <aside className="w-16 sm:w-20 min-h-screen bg-slate-900 flex flex-col items-center py-6 justify-between shrink-0 z-50 shadow-2xl">
        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/20">
          <span className="font-black text-slate-950 text-xl">E</span>
        </div>

        <nav className="flex flex-col gap-5">
          <button onClick={() => setActiveTab('orders')} title="Commandes" className={`p-2.5 sm:p-3 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-slate-800 text-amber-400 ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
            <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => setActiveTab('wallet')} title="Portefeuille & Factures" className={`p-2.5 sm:p-3 rounded-2xl transition-all ${activeTab === 'wallet' ? 'bg-slate-800 text-amber-400 ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => setActiveTab('menu')} title="Menu" className={`p-2.5 sm:p-3 rounded-2xl transition-all ${activeTab === 'menu' ? 'bg-slate-800 text-amber-400 ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
            <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => setActiveTab('store')} title="Boutique" className={`p-2.5 sm:p-3 rounded-2xl transition-all ${activeTab === 'store' ? 'bg-slate-800 text-amber-400 ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
            <Store className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => setActiveTab('settings')} title="Paramètres" className={`p-2.5 sm:p-3 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-amber-400 ring-1 ring-slate-700' : 'text-slate-400 hover:text-slate-200'}`}>
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </nav>

        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Connected" />
      </aside>

      {/* 2. RIGHT MAIN CONTENT */}
      <main className="flex-1 min-w-0 bg-white min-h-screen pt-6 px-4 sm:px-8 pb-12 flex flex-col overflow-y-auto">
        
        {/* HEADER AREA */}
        <header className="w-full flex items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight truncate flex items-center gap-2">
              <span>Am Ali</span>
              <span className="text-amber-600 font-bold text-sm">عم علي</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-mono mt-0.5 truncate">
              Postgres • Gestion de Menu & Photos
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-1 ${isOpen ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {isOpen ? 'OUVERT' : 'FERMÉ'}
            </span>

            <button
              onClick={handleToggleStoreStatus}
              disabled={isUpdatingStatus}
              className={`w-9 h-5 sm:w-11 sm:h-6 rounded-full p-0.5 transition-colors relative flex items-center ${isOpen ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-md transform transition-transform ${isOpen ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'}`}>
                {isUpdatingStatus && <Loader2 className="w-3 h-3 text-slate-400 animate-spin m-0.5" />}
              </div>
            </button>
          </div>
        </header>

        {/* MENU CONTENT TAB */}
        {activeTab === 'menu' && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Gestion du Menu & Photos</h2>
                <p className="text-xs text-slate-400">Total: {menuItems.length} أطباق في القائمة</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
                  
                  <div className="flex items-center gap-3">
                    
                    {/* Item Image with Upload overlay during Edit */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 group">
                      <img 
                        src={editingItemId === item.id && editForm.img ? editForm.img : item.img} 
                        alt={item.name_fr} 
                        className="w-full h-full object-cover" 
                      />

                      {editingItemId === item.id ? (
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center text-[10px] font-bold gap-1 transition-opacity"
                        >
                          <Upload className="w-4 h-4 text-amber-400" />
                          <span>Upload +</span>
                        </button>
                      ) : (
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => startEditing(item)} className="p-1 bg-white/80 rounded-lg text-slate-800">
                            <Camera className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {editingItemId === item.id ? (
                        <div className="space-y-1.5">
                          <input 
                            type="text" 
                            value={editForm.name_fr || ''} 
                            onChange={e => setEditForm({ ...editForm, name_fr: e.target.value })}
                            className="w-full text-xs font-bold p-1 border rounded-md" 
                            placeholder="Nom FR"
                          />
                          <input 
                            type="text" 
                            value={editForm.name_ar || ''} 
                            onChange={e => setEditForm({ ...editForm, name_ar: e.target.value })}
                            className="w-full text-xs font-bold p-1 border rounded-md" 
                            placeholder="اسم الطبق"
                          />
                          <input 
                            type="number" 
                            step="0.100"
                            value={editForm.price || 0} 
                            onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                            className="w-24 text-xs font-bold p-1 border rounded-md" 
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.name_fr}</h3>
                          <p className="text-xs font-semibold text-slate-500 truncate">{item.name_ar}</p>
                          <p className="text-xs font-extrabold text-amber-600 mt-0.5">{item.price.toFixed(3)} DT</p>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      {editingItemId === item.id ? (
                        <div className="flex flex-col gap-1">
                          <button onClick={() => saveEditing(item.id)} className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-sm"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingItemId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded-lg"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEditing(item)} className="p-1.5 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100"><Edit3 className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs font-bold">
                    <button 
                      onClick={() => toggleItemFlag(item.id, 'is_available')}
                      className={`px-2 py-0.5 rounded-md text-[10px] transition-colors ${item.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}
                    >
                      {item.is_available ? 'Disponible 🟢' : 'Épuisé 🔴'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => toggleItemFlag(item.id, 'is_spicy')}
                        className={`p-1 rounded-md ${item.is_spicy ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-300'}`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => toggleItemFlag(item.id, 'is_popular')}
                        className={`p-1 rounded-md ${item.is_popular ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-300'}`}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* WALLET & FACTURES TAB */}
        {activeTab === 'wallet' && (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Wallet className="w-48 h-48 text-amber-400" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Portefeuille Numérique Partner</span>
                  <span className="px-2.5 py-1 bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-extrabold rounded-full">
                    TND (Dinar Tunisien)
                  </span>
                </div>

                <div>
                  <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                    {netWalletBalance.toFixed(3)} <span className="text-lg font-bold text-slate-300">TND</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Solde Net après déduction des frais Eagle</p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Ventes Brutes</span>
                    <span className="font-bold text-emerald-400">{totalGrossRevenue.toFixed(3)} DT</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Eagle (10%)</span>
                    <span className="font-bold text-rose-400">-{eagleCommissionTotal.toFixed(3)} DT</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">TVA (7% sur Com.)</span>
                    <span className="font-bold text-rose-400">-{tvaTotal.toFixed(3)} DT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span>Détails des Factures par Commande</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">{orders.length} Commandes</span>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => {
                  const comm = ord.total_gross * 0.10;
                  const tva = comm * 0.07;
                  const net = ord.total_gross - (comm + tva);

                  return (
                    <div key={ord.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:border-amber-200 transition-all">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-slate-900">{ord.order_code}</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md">
                              Livré
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{ord.date} • {ord.customer}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-extrabold text-slate-400 block">Total Client</span>
                          <span className="text-sm font-black text-slate-900">{ord.total_gross.toFixed(3)} DT</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] font-mono">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-slate-400 text-[9px] block uppercase">Eagle Commission</span>
                          <span className="font-bold text-rose-500">10% = {comm.toFixed(3)} DT</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-slate-400 text-[9px] block uppercase">TVA Sur Com.</span>
                          <span className="font-bold text-rose-500">7% = {tva.toFixed(3)} DT</span>
                        </div>
                        <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                          <span className="text-emerald-700 font-bold text-[9px] block uppercase">Net Restaurant</span>
                          <span className="font-black text-emerald-600">{net.toFixed(3)} DT</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STORE TAB WITH COVER UPLOAD */}
        {activeTab === 'store' && (
          <div className="w-full max-w-md mx-auto space-y-4">
            <h2 className="text-lg font-black text-slate-900">Identité Visuelle & Couverture</h2>
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-lg flex flex-col items-center">
              <div className="w-full h-48 rounded-xl overflow-hidden relative bg-slate-100 group">
                <img src={storeCover} alt="Cover" className="w-full h-full object-cover" />
                <button 
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute top-2 right-2 px-3 py-1.5 bg-black/70 text-white rounded-lg flex items-center gap-1.5 text-xs font-bold hover:bg-black transition-colors"
                >
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Upload Cover +</span>
                </button>
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-bold">Chez Am Ali عند عم علي</h3>
                <p className="text-xs text-slate-400">Restaurant Traditionnel • Tunis</p>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="w-full max-w-md mx-auto text-center space-y-4 pt-8">
            <h2 className="text-lg font-black text-slate-900">Commandes Live</h2>
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
              Écoute active des طلبات Supabase...
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="w-full max-w-md mx-auto space-y-4 pt-2">
            <h2 className="text-lg font-black text-slate-900">Paramètres du Compte</h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-mono">
              ID Partner: #PAR-8842 • Table partners
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
