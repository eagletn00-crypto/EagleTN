import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

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

export const usePartnerCatalog = () => {
  const [products, setProducts] = useState<PartnerProduct[]>([]);
  const [settings, setSettings] = useState<PartnerSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  const fetchCatalogAndSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // جلب بيانات الشريك الإدارية والضريبية
      const { data: partner } = await supabase
        .from('partners')
        .select('id, name, matricule_fiscal, tva_rate, opening_time, closing_time, is_active')
        .eq('user_id', user.id)
        .maybeSingle();

      if (partner) {
        setPartnerId(partner.id);
        setSettings({
          id: partner.id,
          name: partner.name || 'Chez Om Ali',
          matricule_fiscal: partner.matricule_fiscal || '1234567/A/M/000',
          tva_rate: partner.tva_rate || 7.0,
          opening_time: partner.opening_time || '08:00',
          closing_time: partner.closing_time || '23:00',
          is_active: partner.is_active ?? true,
        });

        // جلب قائمة الأطباق والمنتجات الحقيقية
        const { data: prods } = await supabase
          .from('partner_products')
          .select('*')
          .eq('partner_id', partner.id)
          .order('created_at', { ascending: false });

        setProducts(prods || []);
      }
    } catch (err) {
      console.error('❌ Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogAndSettings();
  }, [fetchCatalogAndSettings]);

  // إضافة أو إغلاق توفر طبق في المخزون
  const toggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_available: !currentStatus } : p))
    );

    await supabase
      .from('partner_products')
      .update({ is_available: !currentStatus })
      .eq('id', productId);
  };

  // حفظ أو تحديث منتج
  const saveProduct = async (productData: Partial<PartnerProduct>) => {
    if (!partnerId) return;

    if (productData.id) {
      // تحديث
      const { error } = await supabase
        .from('partner_products')
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq('id', productData.id);

      if (!error) fetchCatalogAndSettings();
    } else {
      // إنشاء جديد
      const { error } = await supabase.from('partner_products').insert([
        {
          partner_id: partnerId,
          name: productData.name,
          description_fr: productData.description_fr,
          description_ar: productData.description_ar,
          price: productData.price,
          image_url: productData.image_url,
          is_available: true,
        },
      ]);

      if (!error) fetchCatalogAndSettings();
    }
  };

  // رفع صورة المنتج إلى Supabase Storage
  const uploadProductImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${partnerId}/${Date.now()}.${fileExt}`;
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

  // تحديث إعدادات الشريك الرقمية والضريبية
  const updateSettings = async (newSettings: Partial<PartnerSettings>) => {
    if (!partnerId) return;

    setSettings((prev) => (prev ? { ...prev, ...newSettings } : null));

    await supabase
      .from('partners')
      .update({
        matricule_fiscal: newSettings.matricule_fiscal,
        tva_rate: newSettings.tva_rate,
        opening_time: newSettings.opening_time,
        closing_time: newSettings.closing_time,
        is_active: newSettings.is_active,
      })
      .eq('id', partnerId);
  };

  return {
    products,
    settings,
    loading,
    toggleProductAvailability,
    saveProduct,
    uploadProductImage,
    updateSettings,
    refreshCatalog: fetchCatalogAndSettings,
  };
};
