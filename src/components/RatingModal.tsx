import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function RatingModal({ order, onClose }: { order: any, onClose: () => void }) {
  const [stars, setStars] = useState(5);
  const [speed, setSpeed] = useState(5);
  const [review, setReview] = useState('');

  const submitRating = async () => {
    // تحديث الطلب بتقييمات متعددة الأبعاد
    await supabase.from('orders').update({ 
      rating: stars,
      speed_rating: speed,
      review: review
    }).eq('id', order.id);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#0b1221]/95 backdrop-blur-md flex items-center justify-center p-6 z-[999]">
      <div className="bg-[#1e293b] p-8 rounded-[2rem] w-full max-w-sm shadow-2xl border border-slate-700">
        <h2 className="text-white font-black text-lg mb-6 text-center">تقييم الخدمة 🦅</h2>
        
        <div className="space-y-6">
          <div>
            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block">جودة التغليف</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setStars(s)} className={`text-2xl ${stars >= s ? 'text-amber-400' : 'text-slate-600'}`}>★</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-[10px] font-black uppercase mb-2 block">سرعة التوصيل</label>
            <input type="range" min="1" max="5" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-orange-500" />
          </div>

          <textarea 
            className="w-full bg-[#0b1221] text-white p-4 rounded-xl text-sm border border-slate-700"
            placeholder="ملاحظات إضافية للمندوب أو المطعم..."
            onChange={(e) => setReview(e.target.value)}
          />

          <button onClick={submitRating} className="w-full bg-orange-500 text-[#0b1221] font-black py-4 rounded-2xl active:scale-95 transition-all">
            إرسال التقييم الاحترافي 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
