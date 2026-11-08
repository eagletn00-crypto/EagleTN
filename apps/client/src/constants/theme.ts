/**
 * Eagle TN - Sovereign Brand System Tokens
 * Core UX Baseline v2026.4
 */

export const BRAND_SYSTEM = {
  canvas: {
    base: 'bg-[#FBFBFA]',
    surface: 'bg-white',
    elevated: 'bg-white/85 backdrop-blur-xl',
  },
  borders: {
    subtle: 'border-black/[0.025]',
    ring: 'ring-1 ring-black/[0.03]',
  },
  shadows: {
    ambient: 'shadow-sm shadow-black/[0.015]',
    floating: 'shadow-2xl shadow-black/[0.03]',
    card: 'shadow-[0_8px_30px_rgb(0,0,0,0.02)]',
  },
  typography: {
    sectionTitle: 'text-[13px] font-semibold tracking-tight text-slate-900',
    subText: 'text-[11px] font-normal text-slate-500',
    micro: 'text-[9.5px] font-medium tracking-wide text-slate-400',
  },
  colors: {
    nationalRed: '#E72A36',
    royalEmerald: '#059669',
  },
} as const;
