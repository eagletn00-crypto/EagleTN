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

export const playNewOrderAlert = () => {
  if (!isAudioEnabled()) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // النغمة الأولى (880Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // النغمة الثانية (1174Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.35);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.35);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (err) {
    console.warn('Audio alert error:', err);
  }
};
