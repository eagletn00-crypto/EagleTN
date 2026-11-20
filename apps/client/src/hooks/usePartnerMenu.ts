import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { normalizePartner, normalizeMenuItem } from '../utils/mappers';

export const usePartnerMenu = (slugOrId: string | undefined) => {
  return useQuery({
    queryKey: ['partner_menu', slugOrId],
    queryFn: async () => {
      if (!slugOrId) {
        alert("🚨 خطأ: لم يتم تمرير المعرف (slug/id) من الرابط!");
        throw new Error("Identifiant manquant");
      }

      // تجاوز قيود TypeScript الصارمة باستخدام (supabase.rpc as any)
      const { data, error } = await (supabase.rpc as any)('get_partner_catalog_v1', {
        lookup_param: String(slugOrId).trim()
      });

      if (error) {
        alert("🚨 خطأ من السيرفر: " + JSON.stringify(error));
        throw new Error('Partenaire indisponible');
      }

      // تحويل البيانات إلى any لمنع خطأ 'never' في TypeScript
      const rpcData = data as any;

      if (!rpcData || !rpcData.partner) {
        alert("🚨 المطعم غير موجود في الـ RPC للمعرف: " + slugOrId);
        throw new Error('Partenaire introuvable');
      }

      try {
        const partner = normalizePartner(rpcData.partner);
        
        let rawMenuItems: any[] = [];
        if (Array.isArray(rpcData.menuItems)) {
            rawMenuItems = rpcData.menuItems;
        } else if (rpcData.menuItems && typeof rpcData.menuItems === 'object') {
             rawMenuItems = Object.values(rpcData.menuItems);
        }

        const menuItems = rawMenuItems.map(normalizeMenuItem);

        return { partner, menuItems };
      } catch (mappingError: any) {
        alert("🚨 خطأ في Mappers: " + mappingError.message);
        throw new Error("Erreur d'affichage du menu");
      }
    },
    enabled: !!slugOrId,
    staleTime: 0,
  });
};
