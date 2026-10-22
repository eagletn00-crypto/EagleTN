import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase/client';
import { usePartnerDashboardData } from '../../hooks/usePartnerDashboardData';

interface MenuItem {
  id: string;
  partner_id: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
  price: number;
  is_available: boolean;
  is_chef_special: boolean;
  image_url?: string;
}

export default function StockageTab() {
  const { partner } = usePartnerDashboardData();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // حالات النافذة المنبثقة (Modal) للتعديل والإضافة
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMenu = useCallback(async () => {
    if (!partner?.id) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, partner_id, name, name_fr, name_ar, price, is_available, is_chef_special, image_url')
        .eq('partner_id', partner.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data as MenuItem[]) || []);
    } catch (err) {
      console.error("[EAGLE TN] Erreur de lecture menu_items:", err);
    } finally {
      setIsLoading(false);
    }
  }, [partner?.id]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // تحديث حالة التوفر السريع (Toggle)
  const toggleStatus = async (item: MenuItem) => {
    setItems(prev => prev.map(p => p.id === item.id ? { ...p, is_available: !p.is_available } : p));
    try {
      const { error } = await supabase
        .from('menu_items') 
        .update({ is_available: !item.is_available })
        .eq('id', item.id);
      if (error) throw error;
    } catch (err) {
      console.error("[EAGLE TN] Échec mutation stock:", err);
      fetchMenu();
    }
  };

  // فتح نافذة الإضافة
  const handleAddNew = () => {
    setEditingItem({
      name_fr: '',
      name_ar: '',
      price: 0,
      is_available: true,
      is_chef_special: false,
      image_url: ''
    });
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل
  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  // رفع الصورة الحقيقي إلى Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !partner?.id) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${partner.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products') // تأكد أن لديك حاوية (Bucket) باسم products
        .upload(fileName, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      
      setEditingItem(prev => prev ? { ...prev, image_url: data.publicUrl } : null);
    } catch (err) {
      console.error("Erreur d'upload image:", err);
      alert("Échec de l'upload de l'image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // حفظ أو تحديث الطبق
  const saveItem = async () => {
    if (!editingItem || !partner?.id) return;
    if (!editingItem.name_fr || !editingItem.price) {
      alert("Veuillez remplir le nom et le prix.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        partner_id: partner.id,
        name_fr: editingItem.name_fr,
        name_ar: editingItem.name_ar || '',
        price: editingItem.price,
        is_available: editingItem.is_available ?? true,
        is_chef_special: editingItem.is_chef_special ?? false,
        image_url: editingItem.image_url || null,
        updated_at: new Date().toISOString()
      };

      if (editingItem.id) {
        // تحديث طبق موجود
        const { error } = await supabase.from('menu_items').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // إضافة طبق جديد
        const { error } = await supabase.from('menu_items').insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchMenu();
    } catch (err) {
      console.error("Erreur de sauvegarde:", err);
      alert("Échec de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] bg-[#E9EBEF] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] border-t-stone-800 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#E9EBEF] p-4 text-[#2D3142] pb-28 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black tracking-tight text-stone-800">Gestion d'Inventaire</h2>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 rounded-xl bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-emerald-600 font-bold text-xs flex items-center gap-2 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          NOUVEAU PLAT
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        {items.length === 0 ? (
           <div className="w-full h-32 rounded-[2rem] bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] flex flex-col items-center justify-center border border-white/30">
             <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Aucun produit trouvé</span>
           </div>
        ) : (
          items.map((product) => (
            <div 
              key={product.id}
              className={`relative flex items-center gap-4 p-4 rounded-3xl bg-[#E9EBEF] shadow-[8px_8px_16px_#c8cad0,-8px_-8px_16px_#ffffff] transition-all duration-300 ${
                !product.is_available ? 'grayscale contrast-75 opacity-60' : ''
              }`}
            >
              {/* شارة طبق خاص (Plat Spécial) */}
              {product.is_chef_special && (
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-amber-400 shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] flex items-center justify-center text-white z-10 border-2 border-[#E9EBEF]">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
              )}

              {/* الصورة */}
              <div 
                onClick={() => handleEdit(product)}
                className="relative w-20 h-20 flex-shrink-0 rounded-2xl bg-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] overflow-hidden cursor-pointer flex items-center justify-center"
              >
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name_fr} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )}
              </div>

              {/* التفاصيل (تفتح نافذة التعديل عند النقر) */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleEdit(product)}>
                <h3 className="text-base font-bold text-stone-800 truncate">{product.name_fr || product.name || 'Sans nom'}</h3>
                <p className="text-xs text-stone-500 font-medium mb-1">{product.name_ar || 'بدون اسم عربي'}</p>
                <div className="text-sm font-black text-emerald-600">{(product.price || 0).toFixed(3)} DT</div>
              </div>

              {/* زر التوفر (Toggle) */}
              <button 
                onClick={(e) => { e.stopPropagation(); toggleStatus(product); }}
                className={`relative w-14 h-8 rounded-full p-1 transition-all duration-300 flex items-center flex-shrink-0 ${
                  product.is_available 
                    ? 'shadow-[inset_4px_4px_8px_#b3b5b9,inset_-4px_-4px_8px_#ffffff] bg-emerald-500/20' 
                    : 'shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] bg-[#E9EBEF]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-[#E9EBEF] shadow-[2px_2px_5px_#c8cad0,-2px_-2px_5px_#ffffff] transition-transform duration-300 ${
                  product.is_available ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* النافذة المنبثقة (Modal) للتعديل أو الإضافة */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/20 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-[2rem] bg-[#E9EBEF] shadow-[12px_12px_24px_#c8cad0,-12px_-12px_24px_#ffffff] border border-white/50 relative overflow-hidden flex flex-col gap-4">
            <h3 className="text-lg font-black text-stone-800 mb-2">
              {editingItem.id ? 'Modifier le plat' : 'Nouveau Plat'}
            </h3>

            {/* رفع الصورة الحقيقي */}
            <div className="flex flex-col items-center gap-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl bg-[#E9EBEF] shadow-[inset_6px_6px_12px_#c8cad0,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center cursor-pointer overflow-hidden relative border border-white/30"
              >
                {uploadingImage ? (
                  <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                ) : editingItem.image_url ? (
                  <img src={editingItem.image_url} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <svg className="w-6 h-6 text-stone-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[9px] font-bold text-stone-500 uppercase mt-1 block">Photo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </div>

            {/* الحقول (Inputs) */}
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase ml-2">Nom du Plat (Français)</label>
                <input 
                  type="text" 
                  value={editingItem.name_fr || ''} 
                  onChange={(e) => setEditingItem({...editingItem, name_fr: e.target.value})}
                  className="w-full p-3 mt-1 rounded-xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-sm font-bold text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Ex: Couscous au Poisson"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase ml-2">Nom Arabe (Optionnel)</label>
                <input 
                  type="text" 
                  value={editingItem.name_ar || ''} 
                  onChange={(e) => setEditingItem({...editingItem, name_ar: e.target.value})}
                  className="w-full p-3 mt-1 rounded-xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-sm font-bold text-stone-800 outline-none text-right font-arabic focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="مثال: كسكسي بالحوت"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase ml-2">Prix (DT)</label>
                <input 
                  type="number" 
                  step="0.100"
                  value={editingItem.price || ''} 
                  onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                  className="w-full p-3 mt-1 rounded-xl bg-[#E9EBEF] shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-sm font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="0.000"
                />
              </div>

              {/* Plat Spécial Toggle */}
              <div className="flex items-center justify-between p-3 mt-2 rounded-xl bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff]">
                <span className="text-xs font-bold text-amber-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  Plat Spécial (Chef)
                </span>
                <button 
                  onClick={() => setEditingItem({...editingItem, is_chef_special: !editingItem.is_chef_special})}
                  className={`relative w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center ${
                    editingItem.is_chef_special 
                      ? 'shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] bg-amber-400' 
                      : 'shadow-[inset_2px_2px_4px_#c8cad0,inset_-2px_-2px_4px_#ffffff] bg-[#E9EBEF]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-[#E9EBEF] shadow-[1px_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
                    editingItem.is_chef_special ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#E9EBEF] shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#c8cad0,inset_-4px_-4px_8px_#ffffff] text-stone-500 font-bold text-xs transition-all"
              >
                ANNULER
              </button>
              <button 
                onClick={saveItem}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-emerald-500 shadow-[4px_4px_8px_#c8cad0,-4px_-4px_8px_#ffffff] active:scale-95 text-white font-bold text-xs transition-all flex items-center justify-center"
              >
                {isSaving ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin"></div>
                ) : (
                  'ENREGISTRER'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
