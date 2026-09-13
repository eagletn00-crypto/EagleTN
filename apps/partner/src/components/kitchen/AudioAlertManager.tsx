import React, { useEffect, useRef } from 'react';

interface Props {
  hasNewOrder: boolean;
}

export const AudioAlertManager: React.FC<Props> = ({ hasNewOrder }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (hasNewOrder) {
      // تشغيل الصوت التنبيهي
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          console.log('Audio autoplay blocked by browser interaction policy.');
        });
      }

      // تفعيل الاهتزاز في الأجهزة اللوحية والموبايل الميداني
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    }
  }, [hasNewOrder]);

  return (
    <audio
      ref={audioRef}
      src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
      preload="auto"
    />
  );
};
