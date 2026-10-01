import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioAlertProps {
  hasNewOrder: boolean;
  onMuteToggle?: (muted: boolean) => void;
}

export const AudioAlertManager: React.FC<AudioAlertProps> = ({ hasNewOrder }) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = () => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn('[AudioAlert] Web Audio API Error:', e);
    }
  };

  useEffect(() => {
    if (hasNewOrder) {
      playChime();
      const interval = setInterval(playChime, 3000);
      return () => clearInterval(interval);
    }
  }, [hasNewOrder, isMuted]);

  return (
    <button
      type="button"
      onClick={() => setIsMuted(!isMuted)}
      className={`p-2 rounded-2xl border transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
        isMuted
          ? 'bg-slate-100 text-slate-400 border-slate-200/80'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-2xs'
      }`}
      title={isMuted ? 'Activer le son' : 'Désactiver le son'}
    >
      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />}
      <span className="hidden sm:inline">{isMuted ? 'Muet' : 'Son Actif'}</span>
    </button>
  );
};

export default AudioAlertManager;
