import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderState {
  cart: CartItem[];
  partnerId: string;
  isSubmitting: boolean;
  error: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  submitOrder: (deliveryPhone: string, cookingInstructions: string) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  cart: [],
  partnerId: '7ee8b022-f38b-4b21-8848-bfb81f185da1', // UUID Am Ali
  isSubmitting: false,
  error: null,

  addToCart: (item) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((i) => i.id === item.id);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      set({ cart: updatedCart });
    } else {
      set({ cart: [...cart, { ...item, quantity: 1 }] });
    }
  },

  removeFromCart: (itemId) => {
    const { cart } = get();
    const existingItem = cart.find((i) => i.id === itemId);
    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      const updatedCart = cart.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
      set({ cart: updatedCart });
    } else {
      set({ cart: cart.filter((i) => i.id !== itemId) });
    }
  },

  clearCart: () => set({ cart: [] }),

  submitOrder: async (deliveryPhone, cookingInstructions) => {
    const { cart, partnerId } = get();

    if (cart.length === 0) {
      set({ error: "Votre panier est vide." });
      return false;
    }

    if (!deliveryPhone || deliveryPhone.trim() === '') {
      set({ error: "Le numéro de téléphone est obligatoire." });
      return false;
    }

    set({ isSubmitting: true, error: null });

    try {
      const totalHT = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryFee = 3500; // 3.500 DT
      const totalTTC = totalHT + deliveryFee;

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("🔴 Session error:", sessionError.message);
      }

      const clientId = sessionData?.session?.user?.id || '00000000-0000-0000-0000-000000000000';

      const payload = {
        client_id: clientId,
        partner_id: partnerId,
        status: 'SUBMITTED',
        total_ht: totalHT,
        delivery_fee: deliveryFee,
        total_ttc: totalTTC,
        cooking_instructions: cookingInstructions || null,
        delivery_phone: deliveryPhone.trim()
      };

      console.log("✈️ Sending payload to Supabase:", payload);

      const { data, error } = await supabase
        .from('orders')
        .insert([payload])
        .select(`
          id,
          status,
          total_ttc,
          partners (
            name
          )
        `);

      if (error) {
        console.error("🔴 PostgREST Insertion Error:", error);
        set({ error: `Erreur base de données (${error.code}): ${error.message}` });
        return false;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("🔴 Empty response. Ensure RLS policies are set for INSERT on orders.");
        set({ error: "La commande a été bloquée par les politiques de sécurité (RLS)." });
        return false;
      }

      console.log("🍏 Successfully placed order:", data[0]);
      set({ cart: [], error: null });
      return true;

    } catch (err: any) {
      console.error("🔴 Critical crash during checkout transaction:", err);
      set({ error: "Une erreur réseau inattendue est survenue." });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  }
}));
