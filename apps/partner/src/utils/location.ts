import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const updatePartnerCoordinates = async (partnerId: string, lat: number, lng: number) => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .update({
        latitude: lat,
        longitude: lng,
        updated_at: new Date().toISOString()
      })
      .eq('id', partnerId);

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error('Erreur lors de la mise à jour de la position:', err.message);
    return { success: false, error: err.message };
  }
};

export const getCurrentGPSPosition = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Géolocalisation non supportée'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};
