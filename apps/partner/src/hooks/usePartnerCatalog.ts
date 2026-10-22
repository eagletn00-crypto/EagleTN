import { useState, useEffect, useCallback } from 'react';
import { supabase } from "../lib/supabase/client";

export interface PartnerProduct {
  id: string;
  partner_id: string;
  name: string;
  description_fr: string;
  description_ar: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

export interface PartnerSettings {
  id: string;
  name: string;
  matricule_fiscal: string;
  tva_rate: number;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
}

const PARTNER_ID = 'c468b8f6-46ec-4653-8f43-7b387c719e80';

// Typage des réponses de la base de données
interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export const usePartnerCatalog = () => {
  const [products, setProducts] = useState<PartnerProduct[]>([]);
  const [settings, setSettings] = useState<PartnerSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogAndSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) {
        throw new Error('Supabase client non disponible');
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Délai de connexion dépassé (Timeout)')), 4000)
      );

      const partnerPromise = supabase
        .from('partners')
        .select('id, name, matricule_fiscal, tva_rate, opening_time, closing_time, is_active')
        .eq('id', PARTNER_ID)
        .maybeSingle();

      const partnerRes = await Promise.race([partnerPromise, timeoutPromise]) as SupabaseResponse<Partial<PartnerSettings>>;

      if (partnerRes.error) {
        throw partnerRes.error;
      }

      const partner = partnerRes.data;

      if (partner) {
        setSettings({
          id: partner.id || PARTNER_ID,
          name: partner.name || 'Restaurant Am Ali',
          matricule_fiscal: partner.matricule_fiscal || '1234567/A/M/000',
          tva_rate: partner.tva_rate || 7.0,
          opening_time: partner.opening_time || '08:00',
          closing_time: partner.closing_time || '23:00',
          is_active: partner.is_active ?? true,
        });

        const prodsPromise = supabase
          .from('partner_products')
          .select('*')
          .eq('partner_id', PARTNER_ID)
          .order('created_at', { ascending: false });

        const prodsRes = await Promise.race([prodsPromise, timeoutPromise]) as SupabaseResponse<PartnerProduct[]>;

        if (!prodsRes.error) {
          setProducts(prodsRes.data || []);
        }
      } else {
        setSettings({
          id: PARTNER_ID,
          name: 'Restaurant Am Ali',
          matricule_fiscal: '1234567/A/M/000',
          tva_rate: 7.0,
          opening_time: '08:00',
          closing_time: '23:00',
          is_active: true,
        });
      }
    } catch (err) {
      console.error('❌ Error fetching catalog:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogAndSettings();
  }, [fetchCatalogAndSettings]);

  const toggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_available: !currentStatus } : p))
    );
    try {
      if (!supabase) return;
      await supabase
        .from('partner_products')
        .update({ is_available: !currentStatus })
        .eq('id', productId);
    } catch (err) {
      console.error('Toggle availability error:', err);
      fetchCatalogAndSettings();
    }
  };

  const saveProduct = async (productData: Partial<PartnerProduct>) => {
    try {
      if (!supabase) return;

      if (productData.id) {
        const { error } = await supabase
          .from('partner_products')
          .update({ ...productData, updated_at: new Date().toISOString() })
          .eq('id', productData.id);
        if (!error) fetchCatalogAndSettings();
      } else {
        const { error } = await supabase.from('partner_products').insert([{
          partner_id: PARTNER_ID,
          name: productData.name,
          description_fr: productData.description_fr,
          description_ar: productData.description_ar,
          price: productData.price,
          image_url: productData.image_url,
          is_available: true,
        }]);
        if (!error) fetchCatalogAndSettings();
      }
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  const uploadProductImage = async (file: File): Promise<string | null> => {
    try {
      if (!supabase) return null;
      const fileExt = file.name.split('.').pop();
      const fileName = `${PARTNER_ID}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('products').getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err) {
      console.error('❌ Upload Image Error:', err);
      return null;
    }
  };

  const updateSettings = async (newSettings: Partial<PartnerSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...newSettings } : null));
    try {
      if (!supabase) return;
      await supabase
        .from('partners')
        .update({
          matricule_fiscal: newSettings.matricule_fiscal,
          tva_rate: newSettings.tva_rate,
          opening_time: newSettings.opening_time,
          closing_time: newSettings.closing_time,
          is_active: newSettings.is_active,
        })
        .eq('id', PARTNER_ID);
    } catch (err) {
      console.error('Update settings error:', err);
      fetchCatalogAndSettings();
    }
  };

  return {
    products,
    settings,
    loading,
    error,
    toggleProductAvailability,
    saveProduct,
    uploadProductImage,
    updateSettings,
    refreshCatalog: fetchCatalogAndSettings,
  };
};
