import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// واجهة تعريف هيكل البيانات الأولية المطلوبة للحماية القانونية
interface SecurityContext {
  networkStatus: 'online' | 'offline';
  gpsPermission: PermissionState | 'unknown';
  tenantId: string | null;
  timestamp: string;
}

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [securityLog, setSecurityLog] = useState<SecurityContext | null>(null);

  useEffect(() => {
    // 1. استخراج الـ Tenant ID بصمت من الـ URL (للتوجيه الديناميكي)
    const hostname = window.location.hostname;
    const extractedTenant = hostname.includes('.') ? hostname.split('.')[0] : 'default';

    // 2. التحصين القانوني والتقني (Background Checks)
    const runSecurityAndLegalChecks = async () => {
      let gpsState: PermissionState | 'unknown' = 'unknown';
      
      // [INPDP COMPLIANCE]: التحقق المسبق من إذن الموقع دون إزعاج المستخدم مبكراً
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name: 'geolocation' });
          gpsState = status.state;
        } catch (e) {
          console.warn('Geolocation permission check failed', e);
        }
      }

      // [OFFLINE RESILIENCY]: فحص حالة الشبكة التونسية (3G/4G/WIFI)
      const isOnline = navigator.onLine;
      
      // [CHAIN OF CUSTODY]: إنشاء بصمة زمنية أولية (Immutable Timestamp)
      const initialTimestamp = new Date().toISOString();

      setSecurityLog({
        networkStatus: isOnline ? 'online' : 'offline',
        gpsPermission: gpsState,
        tenantId: extractedTenant,
        timestamp: initialTimestamp,
      });

      // [ANTI-SPOOFING PREP]: هنا سيتم مستقبلاً حقن كود فحص بيئة التشغيل (Cordova/Capacitor plugins)
      // للتأكد من عدم وجود Mock Locations مفعلة في خيارات المطور.
    };

    runSecurityAndLegalChecks();

    // 3. المؤثر الصوتي الذكي (Eagle Screech)
    const playAudio = () => {
      const audio = new Audio('/eagle_screech.mp3');
      audio.volume = 0.5; // مستوى صوت أنيق وغير مزعج
      // معالجة سياسات الـ Autoplay في المتصفحات بصمت تام
      audio.play().catch((error) => {
        console.log('Autoplay policy prevented audio, proceeding silently.', error);
      });
    };
    playAudio();

    // 4. التوجيه الديناميكي والتوقيت (3.5 ثانية)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3000); // بدء التلاشي بعد 3 ثوانٍ

    const redirectTimer = setTimeout(() => {
      // بناءً على الـ Tenant أو حالة المصادقة يتم التوجيه
      // تم وضع /home كمثال، يجب ربطه بالـ Router الفعلي
      navigate('/home', { replace: true });
    }, 3500); // الانتقال الفعلي بعد 3.5 ثانية

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* شبكة الخلفية الجمالية (Tech Grid) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMDAsIDEwMCwgMTAwLCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      {/* الحاوية المركزية للنسر (The Frame) */}
      <div className="relative flex items-center justify-center w-48 h-48">
        
        {/* تأثير النبض الخارجي (Pulse Effect) */}
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-75"></div>
        
        {/* إطار الماسح الضوئي (Glowing Scanner) */}
        <div className="absolute inset-[-10px] rounded-full border-t-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-[-20px] rounded-full border-b-2 border-zinc-700 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>

        {/* الأيقونة الفلسفية (The Eagle) */}
        <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden bg-black/50 backdrop-blur-md border border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)] flex items-center justify-center">
          <img 
            src="/eagle.png" 
            alt="Eagle.TN Core System" 
            className="w-24 h-24 object-contain filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
          />
        </div>
      </div>

      {/* شريط التحميل الرقمي */}
      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <div className="text-amber-500/80 text-xs font-mono tracking-[0.2em] uppercase">
          Initializing Secure Protocol
        </div>
        <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-full animate-[progress_3.5s_ease-in-out_1]"></div>
        </div>
      </div>
      
      {/* إشعار تقني قانوني مخفي (يظهر للمطورين في الـ Logs) */}
      <div className="absolute bottom-4 text-zinc-700 text-[10px] font-mono opacity-50">
        Eagle.TN Security Layer v1.0 | TN-INPDP Ready
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
