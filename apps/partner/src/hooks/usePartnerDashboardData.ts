import { useState, useEffect, useCallback } from 'react';
import { supabase } from "../lib/supabase/client";

const MASTER_PARTNER_ID = 'c468b8f6-46ec-4653-8f43-7b387c719e80';

// Typage strict pour éliminer le useState<any>
export interface Partner {
  id: string;
  name: string;
  matricule_fiscal: string;
  is_active: boolean;
}

export interface DashboardState {
  partner: Partner | null;
  orders: unknown[]; // À typer ultérieurement avec l'interface Order
  products: unknown[]; // À typer ultérieurement avec l'interface MenuItem
}

export const usePartnerDashboardData = () => {
  const [data, setData] = useState<DashboardState>({
    partner: null,
    orders: [],
    products: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!supabase) throw new Error('Client Supabase non initialisé');
      
      console.log('[EAGLE TN] Tentative de connexion à Supabase avec ID:', MASTER_PARTNER_ID);

      const partnerRes = await supabase
        .from('partners')
        .select('*')
        .eq('id', MASTER_PARTNER_ID)
        .single();
        
      if (partnerRes.error) {
        console.error('[EAGLE TN] Erreur Partners:', partnerRes.error);
        throw partnerRes.error;
      }

      const ordersRes = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('partner_id', MASTER_PARTNER_ID)
        .order('created_at', { ascending: false });

      if (ordersRes.error) {
        console.warn('[EAGLE TN] Erreur Orders (non bloquante):', ordersRes.error);
      }

      const menuRes = await supabase
        .from('menu_items')
        .select('*')
        .eq('partner_id', MASTER_PARTNER_ID);

      if (menuRes.error) {
        console.warn('[EAGLE TN] Erreur Menu Items (non bloquante):', menuRes.error);
      }

      setData({
        partner: partnerRes.data as Partner,
        orders: ordersRes.data || [],
        products: menuRes.data || []
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion réseau avec Supabase';
      console.error('[EAGLE TN] Échec critique de fetch:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Retourne les propriétés exactes attendues par PartnerDashboard.tsx
  return { 
    partner: data.partner,
    orders: data.orders,
    products: data.products,
    isLoading, 
    error, 
    refreshDashboard: fetchDashboard 
  };
};
