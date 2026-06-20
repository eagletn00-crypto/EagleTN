import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SecurityState {
  isOnline: boolean;
  gpsCoords: { latitude: number; longitude: number; accuracy: number } | null;
  tenantId: string | null;
  setNetworkStatus: (status: boolean) => void;
  initializeTenant: (url: string) => void;
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      gpsCoords: null,
      tenantId: 'main', // القيمة الابتدائية الافتراضية لضمان فتح صفحة الهبوط

      setNetworkStatus: (status) => set({ isOnline: status }),

      initializeTenant: (url) => {
        try {
          const hostname = new URL(url).hostname;
          
          // حماية بيئة التطوير المحلية في تونس (Termux Localhost)
          if (hostname === 'localhost' || hostname === '127.0.0.1') {
            set({ tenantId: 'main' }); // إجبار المنصة على عرض الـ Landing Page أثناء التست
            return;
          }

          const parts = hostname.split('.');
          if (parts.length > 2 && parts[0] !== 'www') {
            set({ tenantId: parts[0] });
          } else {
            set({ tenantId: 'main' });
          }
        } catch (e) {
          set({ tenantId: 'main' });
        }
      }
    }),
    {
      name: 'eagle-security-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tenantId: state.tenantId }),
    }
  )
);
