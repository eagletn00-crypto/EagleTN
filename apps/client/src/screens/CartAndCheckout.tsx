import React, { useState } from 'react';
import { createOrder } from '../services/orderService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options?: Record<string, any>;
}

interface CartAndCheckoutProps {
  partnerId?: string;
  items?: CartItem[];
  deliveryAddress?: string;
  onOrderSuccess?: (orderId: string) => void;
  onClose?: () => void;
}

export const CartAndCheckout: React.FC<CartAndCheckoutProps> = ({
  partnerId = 'partner-demo-id',
  items = [],
  deliveryAddress = 'سوسة، تونس',
  onOrderSuccess,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [changeFor, setChangeFor] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  // الحسابات المالية (بالدينار التونسي - DT)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 2.500; // قيمة التوصيل
  const platformFee = 0.500; // رسوم المنصة
  const totalAmount = subtotal + deliveryFee + platformFee;

  const handleConfirmOrder = async () => {
    if (items.length === 0) {
      setErrorMsg('السلة فارغة، يرجى إضافة وجبات أولاً.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // إعداد الحمولة لـ Supabase Schema
      const payload = {
        partner_id: partnerId,
        subtotal_ht: parseFloat((subtotal * 0.81).toFixed(3)), // اقتطاع الأداء
        tva_amount: parseFloat((subtotal * 0.19).toFixed(3)),
        timbre_fiscal: 1.000,
        delivery_fee: deliveryFee,
        platform_fee: platformFee,
        driver_earning: 2.000,
        partner_payout: subtotal,
        total_amount: parseFloat(totalAmount.toFixed(3)),
        delivery_address: deliveryAddress,
        change_needed_for: changeFor,
        notes: notes,
        cgu_accepted: true,
        inpdp_accepted: true,
        items: items.map(item => ({
          item_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          options: item.options || {}
        }))
      };

      const createdOrder = await createOrder(payload);

      if (onOrderSuccess) {
        onOrderSuccess(createdOrder.id);
      } else {
        alert(`تم إرسال طلبك بنجاح! رقم الطلب: ${createdOrder.id}`);
      }
    } catch (err: any) {
      console.error('Error submitting order:', err);
      setErrorMsg(err.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg max-w-md mx-auto dir-rtl text-right">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">تفاصيل الطلب والدفع</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 text-sm hover:text-black">
            إغلاق ✖
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {errorMsg}
        </div>
      )}

      {/* عناصر السلة */}
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">السلة فارغة حالياً</p>
        ) : (
          items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center border-b pb-2 text-sm">
              <div>
                <span className="font-semibold text-gray-800">{item.name}</span>
                <span className="text-gray-500 text-xs block">الكمية: {item.quantity}</span>
              </div>
              <span className="font-bold text-gray-700">{(item.price * item.quantity).toFixed(3)} DT</span>
            </div>
          ))
        )}
      </div>

      {/* الملاحظات وإعدادات الصرف */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs text-gray-600 mb-1">ملاحظات للمطعم / الموصل</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="مثال: بدون بصل / الباب الأيمن..."
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">تحتاج صرف لـ (اختياري)</label>
          <select
            onChange={(e) => setChangeFor(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:border-amber-500"
          >
            <option value="">دفع مالي دقيق</option>
            <option value="20">ورقة 20 د.ت</option>
            <option value="50">ورقة 50 د.ت</option>
          </select>
        </div>
      </div>

      {/* الملخص المالي */}
      <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm mb-4">
        <div className="flex justify-between text-gray-600">
          <span>مجموع الوجبات</span>
          <span>{subtotal.toFixed(3)} DT</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>رسوم التوصيل</span>
          <span>{deliveryFee.toFixed(3)} DT</span>
        </div>
        <div className="flex justify-between font-bold text-base text-gray-900 border-t pt-2 mt-1">
          <span>المجموع الكلي</span>
          <span className="text-amber-600">{totalAmount.toFixed(3)} DT</span>
        </div>
      </div>

      {/* زر التأكيد */}
      <button
        onClick={handleConfirmOrder}
        disabled={loading || items.length === 0}
        className={`w-full py-3 rounded-xl text-white font-bold transition-all ${
          loading || items.length === 0 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-amber-500 hover:bg-amber-600 shadow-md'
        }`}
      >
        {loading ? 'جاري إرسال الطلب لـ Supabase...' : 'تأكيد الطلب الآن 🦅'}
      </button>
    </div>
  );
};

export default CartAndCheckout;
