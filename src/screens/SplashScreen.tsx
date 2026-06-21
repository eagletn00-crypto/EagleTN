import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSecurityStore } from '../context/useSecurityStore';

// واجهة تعريف هيكل البيانات الأولية المطلوبة للحماية القانونية
interface SecurityContext {
  networkStatus: 'online' | 'offline';
  gpsPermission: PermissionState | 'unknown';
  tenantId: string | null;
  timestamp: string;
}

const INVALID_TENANTS = new Set(['undefined', 'null', 'default', '']);

const getTenantFromHostname = (hostname: string): string | null => {
  if (!hostname || hostname.trim().length === 0) return null;

  const normalized = hostname.trim().toLowerCase();
  if (normalized === 'localhost' || normalized === '127.0.0.1') {
    return 'main';
  }

  const parts = normalized.split('.');
  if (parts.length > 2 && parts[0] !== 'www' && !INVALID_TENANTS.has(parts[0])) {
    return parts[0];
  }

  if (parts.length === 1 && !INVALID_TENANTS.has(parts[0])) {
    return parts[0];
  }

  return 'main';
};

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const store = useSecurityStore();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [securityLog, setSecurityLog] = useState<SecurityContext | null>(null);
  const [tenantError, setTenantError] = useState<string | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    const extractedTenant = getTenantFromHostname(hostname);
    const hasInvalidTenant = !extractedTenant || INVALID_TENANTS.has(extractedTenant);

    const runSecurityAndLegalChecks = async () => {
      let gpsState: PermissionState | 'unknown' = 'unknown';

      if (navigator.permissions && navigator.permissions.query) {
        try {
          const status = await navigator.permissions.query({ name: 'geolocation' });
          gpsState = status.state;
        } catch (e) {
          console.warn('Geolocation permission check failed', e);
        }
      }

      const isOnline = navigator.onLine;
      const initialTimestamp = new Date().toISOString();

      setSecurityLog({
        networkStatus: isOnline ? 'online' : 'offline',
        gpsPermission: gpsState,
        tenantId: extractedTenant,
        timestamp: initialTimestamp,
      });

      if (hasInvalidTenant) {
        setTenantError('Tenant information is missing or invalid. The app will continue to the landing page.');
      }

      if (store && typeof store.initializeTenant === 'function') {
        store.initializeTenant(window.location.href);
      }
    };

    runSecurityAndLegalChecks();

    const playAudio = () => {
      const audio = new Audio('/eagle_screech.mp3');
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.log('Autoplay policy prevented audio, proceeding silently.', error);
      });
    };

    playAudio();

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 3000);

    const redirectTimer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, hasInvalidTenant ? 6000 : 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, store]);

  const hostname = window.location.hostname;
  const extractedTenant = getTenantFromHostname(hostname);
  const isTenantInvalid = !extractedTenant || INVALID_TENANTS.has(extractedTenant);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-500 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMDAsIDEwMCwgMTAwLCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>

      <div className="relative flex items-center justify-center w-48 h-48">
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-75"></div>
        <div className="absolute inset-[-10px] rounded-full border-t-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute inset-[-20px] rounded-full border-b-2 border-zinc-700 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>

        <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden bg-black/50 backdrop-blur-md border border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.15)] flex items-center justify-center">
          <img 
            src="/eagle.png" 
            alt="Eagle.TN Core System" 
            className="w-24 h-24 object-contain filter drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
          />
        </div>
      </div>

      <div className="absolute bottom-16 flex flex-col items-center gap-3">
        <div className="text-amber-500/80 text-xs font-mono tracking-[0.2em] uppercase">
          Initializing Secure Protocol
        </div>
        <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-full animate-[progress_3.5s_ease-in-out_1]"></div>
        </div>
      </div>

      {tenantError ? (
        <div className="absolute top-24 max-w-xl rounded-2xl border border-rose-500/30 bg-rose-950/80 p-5 text-left text-sm text-rose-100 shadow-xl shadow-rose-950/20 backdrop-blur-md">
          <h2 className="text-base font-semibold text-rose-300">Tenant validation failed</h2>
          <p className="mt-2 leading-relaxed text-rose-100/90">
            {tenantError}
          </p>
          <p className="mt-3 text-xs text-rose-200/80">
            Hostname: <span className="font-mono text-rose-100">{hostname}</span>
          </p>
          <p className="mt-2 text-xs text-rose-200/80">
            Tenant detected: <span className="font-mono text-rose-100">{extractedTenant ?? 'none'}</span>
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-amber-400"
            onClick={() => navigate('/home', { replace: true })}
          >
            Continue to landing page
          </button>
        </div>
      ) : null}

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
