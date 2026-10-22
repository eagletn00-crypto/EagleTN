import { supabase } from '../lib/supabase';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface OrderPayload {
  partnerId: string;
  clientId?: string;      // من المفترض أنك تستخدم Supabase Auth للعميل
  customerName?: string;
  deliveryAddress?: string;
  deliveryFee: number;
  subtotal: number;       // المجموع قبل الأداءات
  tvaAmount: number;      // قيمة الـ TVA
  timbreFiscal: number;   // الطابع الجبائي (مثلاً 1.000 د.ت)
  grandTotal: number;     // المجموع النهائي المطلوب دفعه
  paymentMethod: 'COD' | 'Card';
  items: CartItem[];
  changeNeededFor?: number | null;
}

export const submitOrder = async (payload: OrderPayload) => {
  try {
    // 1. إنشاء الطلب الأساسي بناءً على الأعمدة الدقيقة التي اكتشفناها في التشخيص
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          partner_id: payload.partnerId,
          client_id: payload.clientId || null,
          customer_name: payload.customerName || 'Client EAGLE',
          delivery_address: payload.deliveryAddress || 'Adresse non spécifiée',
          status: 'pending',
          
          // التفصيل المالي الدقيق
          subtotal_ht: payload.subtotal,
          tva_amount: payload.tvaAmount,
          timbre_fiscal: payload.timbreFiscal,
          delivery_fee: payload.deliveryFee,
          total_amount: payload.subtotal, // كقيمة احتياطية للـ Edge Function
          grand_total: payload.grandTotal,
          
          payment_method: payload.paymentMethod,
          change_needed_for: payload.changeNeededFor || null,
        }
      ])
      .select('id')
      .single();

    if (orderError || !orderData) {
      console.error("[EAGLE TN - Client] Erreur création commande:", orderError);
      throw new Error("Impossible de créer la commande.");
    }

    const orderId = orderData.id;

    // 2. إدخال محتويات السلة في order_items كما برمجنا سابقاً
    const orderItemsToInsert = payload.items.map((item) => ({
      order_id: orderId,
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      options: item.notes || null 
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error("[EAGLE TN - Client] Erreur insertion items:", itemsError);
      await supabase.from('orders').delete().eq('id', orderId); // Rollback
      throw new Error("Erreur lors de l'enregistrement des articles.");
    }

    return { success: true, orderId };

  } catch (error) {
    console.error("[EAGLE TN - Client] Échec critique du Checkout:", error);
    return { success: false, error };
  }
};
