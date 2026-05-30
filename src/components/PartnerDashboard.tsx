import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function PartnerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حالات التعديل اللحظي للوجبة
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newBonus, setNewBonus] = useState(''); // حقل الـ Bonus الجديد لعم علي
  const [isUpdating, setIsUpdating] = useState(false);

  // جلب وجبات الشريك الحالية
  const fetchPartnerProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartnerProducts();
  }, []);

  // فتح وضع التعديل وحقن البيانات الحالية في المدخلات
  const startEditing = (product: any) => {
    setEditingProductId(product.id);
    setNewPrice(product.price?.toString() || '');
    setNewImageUrl(product.image_url || '');
    setNewBonus(product.bonus || ''); // جلب الـ Bonus القديم إن وجد
  };

  // حفظ التعديلات الحية مباشرة في الـ Supabase
  const handleUpdateProduct = async (productId: string) => {
    if (!newPrice) {
      alert('الرجاء تحديد السعر الجديد للوجبة ⚠️');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          price: parseFloat(newPrice),
          image_url: newImageUrl,
          bonus: newBonus // تحديث حقل العروض الإضافية في قاعدة البيانات
        })
        .eq('id', productId);

      if (error) throw error;

      alert('🦅 Eagle Partner: تم تحديث السعر، الصورة، والـ Bonus بنجاح!');
      setEditingProductId(null);
      fetchPartnerProducts(); // إعادة جلب البيانات لتحديث الواجهة حياً
    } catch (err: any) {
      alert('خطأ أثناء التحديث: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans antialiased text-gray-900 p-5">
      
      {/* الترويسة الفخمة للوحة تحكم الشريك */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex justify-between items-center mb-6">
        <div>
          <span className="text-xs font-black text-red-600 uppercase tracking-widest block">EAGLE GROUPE • B2B</span>
          <h1 className="text-xl font-black text-gray-950 mt-0.5">Espace Resto - Am Ali 🍲</h1>
        </div>
        <span className="bg-green-100 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
          ● Connecté
        </span>
      </div>

      <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 px-1">Gestion du Menu & Bonus</h2>

      {loading ? (
        <p className="text-center text-xs text-gray-400 py-10 font-bold">جاري تحميل قائمة المأكولات الخاصة بك...</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
              
              {/* تفاصيل المنتج الحالية */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-gray-950">{product.name}</h4>
                  <p className="text-xs text-gray-400 font-semibold">{product.description || 'Pas de description'}</p>
                  <div className="flex gap-2 items-center pt-1">
                    <span className="text-sm font-black text-red-600">{product.price} DT</span>
                    {product.bonus && (
                      <span className="bg-amber-50 text-amber-600 border border-amber-200/50 text-[9px] font-black px-2 py-0.5 rounded-md">
                        🎁 Bonus: {product.bonus}
                      </span>
                    )}
                  </div>
                </div>
                
                {product.image_url ? (
                  <img src={product.image_url} alt="" className="w-16 h-16 rounded-2xl object-cover border" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border flex items-center justify-center text-xl text-gray-400">🍲</div>
                )}
              </div>

              {/* زر تفعيل وضع التعديل أو شاشة التحكم الفورية */}
              {editingProductId !== product.id ? (
                <button
                  onClick={() => startEditing(product)}
                  className="w-full bg-gray-950 hover:bg-gray-800 text-white font-black py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                >
                  Modifier Prix, Image & Bonus ✏️
                </button>
              ) : (
                /* فورم التعديل الحي داخل البطاقة بستايل آبل النظيف */
                <div className="pt-3 border-t border-gray-100 space-y-3 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Nouveau Prix (DT) *</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 block mb-1 uppercase">Offre / Bonus 🎁</label>
                      <input 
                        type="text" 
                        placeholder="Ex: Coca-Cola Gratuite"
                        value={newBonus}
                        onChange={(e) => setNewBonus(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 block mb-1 uppercase">URL de la photo du Plat</label>
                    <input 
                      type="text" 
                      placeholder="https://images.unsplash.com/..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingProductId(null)}
                      className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-3 rounded-xl text-xs transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateProduct(product.id)}
                      className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl text-xs transition-colors shadow-sm shadow-red-900/10"
                    >
                      {isUpdating ? 'Mise à jour...' : 'Sauvegarder 🚀'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
