/**
 * إدارة وتفعيل التنبيه الصوتي الميداني للطلبات الجديدة
 */
const AUDIO_PREF_KEY = 'eagle_partner_audio_enabled';

export const isAudioEnabled = (): boolean => {
  const pref = localStorage.getItem(AUDIO_PREF_KEY);
  return pref === null ? true : pref === 'true';
};

export const setAudioEnabled = (enabled: boolean): void => {
  localStorage.setItem(AUDIO_PREF_KEY, String(enabled));
};

export const playNewOrderAlert = async () => {
  if (!isAudioEnabled()) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();

    // حل مشكلة Autoplay Restriction في متصفحات الموبايل
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // النغمة الأولى (880Hz - A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.5, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // النغمة الثانية (1174.66Hz - D6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.35);
    gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.35);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.85);
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
};
