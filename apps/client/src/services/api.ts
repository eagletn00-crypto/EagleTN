import { supabase } from '../lib/supabase';
import { Partner } from '../types/partner';
import { OrderItem } from '../types/order';

// 1. Récupération de tous les partenaires
export const fetchPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Erreur Supabase (fetchPartners):', error);
    return [];
  }
  return data as Partner[];
};

// 2. Récupération dynamique d'un partenaire et de son menu par UUID
export const fetchPartnerWithMenuByUuid = async (partnerUuid: string) => {
  try {
    const { data: partner, error: partnerError } = await supabase
      .from('partners')
      .select('*')
      .eq('id', partnerUuid)
      .single();

    if (partnerError) {
      console.warn(`Partenaire non trouvé pour l'UUID: ${partnerUuid}`, partnerError);
    }

    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('partner_id', partnerUuid)
      .eq('is_available', true);

    if (menuError) {
      console.error('Erreur de chargement du menu:', menuError);
    }

    return {
      partner: partner || null,
      menuItems: menuItems || []
    };
  } catch (err) {
    console.error('Exception lors de la récupération des données Supabase:', err);
    return { partner: null, menuItems: [] };
  }
};

// 3. Envoi de la commande vers Supabase (avec support optionnel du PIN)
export const createRemoteOrder = async (orderPayload: {
  partner_id: string;
  customer_id?: string;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  delivery_address: string;
  verification_pin?: string;
}) => {
  const pin = orderPayload.verification_pin || '1234';
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        partner_id: orderPayload.partner_id,
        customer_id: orderPayload.customer_id || 'cust-2026-field',
        status: 'pending',
        total_amount: orderPayload.total_amount,
        delivery_fee: orderPayload.delivery_fee,
        delivery_address: orderPayload.delivery_address,
        verification_pin: pin,
        qr_code_data: `EAGLE-TN-${pin}`,
        payment_method: 'COD',
        payment_status: 'PENDING',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de la création de commande:', error);
    throw error;
  }

  return data;
};
