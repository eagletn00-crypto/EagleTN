import React, { useState, useEffect, useRef } from 'react';
import { VolumeX, Volume2 } from 'lucide-react';

export interface OrderWithStatus {
  id: string;
  status: string;
}

export interface AudioAlertManagerProps {
  orders: OrderWithStatus[];
}

export const AudioAlertManager: React.FC<AudioAlertManagerProps> = ({ orders }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Vérification stricte des statuts en attente (insensible à la casse par sécurité)
  const hasPendingOrders = orders.some(
    (o) => o.status === 'pending' || o.status === 'PENDING'
  );

  useEffect(() => {
    // Initialisation du contexte audio en mémoire
    if (!audioRef.current) {
      // Chemin d'accès relatif vers votre asset sonore dans le dossier public
      const audio = new Audio('/sounds/new-order-alert.mp3');
      audio.loop = true;
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    if (hasPendingOrders && isAudioEnabled) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay bloqué par le navigateur:", err);
          setIsAudioEnabled(false);
        });
      }
    } else {
      audio.pause();
      audio.currentTime = 0; // Réinitialisation de la piste
    }

    return () => {
      audio.pause();
    };
  }, [hasPendingOrders, isAudioEnabled]);

  const handleEnableAudio = () => {
    setIsAudioEnabled(true);
    // Un premier play() factice sur interaction utilisateur permet de déverrouiller l'AudioContext
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        audioRef.current?.pause();
      }).catch(console.error);
    }
  };

  // Si l'audio est autorisé ou s'il n'y a pas de commandes en attente (pour éviter de polluer l'UI initialement)
  if (isAudioEnabled || !hasPendingOrders) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
            <VolumeX className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-900 tracking-tight">Notifications en sourdine</span>
            <span className="text-[11px] font-medium text-neutral-500">Activez le son pour les nouvelles alertes</span>
          </div>
        </div>
        <button
          onClick={handleEnableAudio}
          className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          Activer
        </button>
      </div>
    </div>
  );
};
