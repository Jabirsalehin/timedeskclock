import type { ThemeType } from '../store/useStore';

export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  surface: string;
  surfaceHover: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  sidebar: string;
  card: string;
  cardBorder: string;
  inputBg: string;
  danger: string;
  success: string;
  warning: string;
}

export const themes: Record<ThemeType, ThemeColors> = {
  dark: {
    bg: 'bg-[#0a0a0a]',
    bgSecondary: 'bg-[#111111]',
    bgTertiary: 'bg-[#1a1a1a]',
    surface: 'bg-[#141414]',
    surfaceHover: 'hover:bg-[#1e1e1e]',
    border: 'border-[#222222]',
    text: 'text-[#e5e5e5]',
    textSecondary: 'text-[#a0a0a0]',
    textMuted: 'text-[#666666]',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    accentText: 'text-blue-400',
    sidebar: 'bg-[#0d0d0d]',
    card: 'bg-[#141414]',
    cardBorder: 'border-[#1e1e1e]',
    inputBg: 'bg-[#1a1a1a]',
    danger: 'text-red-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
  },
  amoled: {
    bg: 'bg-black',
    bgSecondary: 'bg-[#050505]',
    bgTertiary: 'bg-[#0a0a0a]',
    surface: 'bg-[#0a0a0a]',
    surfaceHover: 'hover:bg-[#111111]',
    border: 'border-[#1a1a1a]',
    text: 'text-white',
    textSecondary: 'text-[#888888]',
    textMuted: 'text-[#555555]',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    accentText: 'text-blue-400',
    sidebar: 'bg-black',
    card: 'bg-[#080808]',
    cardBorder: 'border-[#151515]',
    inputBg: 'bg-[#0d0d0d]',
    danger: 'text-red-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
  },
  light: {
    bg: 'bg-[#fafafa]',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-[#f5f5f5]',
    surface: 'bg-white',
    surfaceHover: 'hover:bg-[#f5f5f5]',
    border: 'border-[#e5e5e5]',
    text: 'text-[#1a1a1a]',
    textSecondary: 'text-[#666666]',
    textMuted: 'text-[#999999]',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    accentText: 'text-blue-600',
    sidebar: 'bg-[#f8f8f8]',
    card: 'bg-white',
    cardBorder: 'border-[#eaeaea]',
    inputBg: 'bg-[#f5f5f5]',
    danger: 'text-red-600',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
  },
  glass: {
    bg: 'bg-[#0d1117]',
    bgSecondary: 'bg-[#0d1117]/80',
    bgTertiary: 'bg-[#161b22]',
    surface: 'bg-white/5',
    surfaceHover: 'hover:bg-white/10',
    border: 'border-white/10',
    text: 'text-white',
    textSecondary: 'text-white/60',
    textMuted: 'text-white/30',
    accent: 'bg-blue-500/80',
    accentHover: 'hover:bg-blue-500',
    accentText: 'text-blue-400',
    sidebar: 'bg-[#0d1117]/90',
    card: 'bg-white/5',
    cardBorder: 'border-white/10',
    inputBg: 'bg-white/5',
    danger: 'text-red-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
  },
  minimal: {
    bg: 'bg-[#111111]',
    bgSecondary: 'bg-[#161616]',
    bgTertiary: 'bg-[#1c1c1c]',
    surface: 'bg-[#161616]',
    surfaceHover: 'hover:bg-[#1c1c1c]',
    border: 'border-[#262626]',
    text: 'text-[#d4d4d4]',
    textSecondary: 'text-[#737373]',
    textMuted: 'text-[#525252]',
    accent: 'bg-neutral-600',
    accentHover: 'hover:bg-neutral-500',
    accentText: 'text-neutral-300',
    sidebar: 'bg-[#111111]',
    card: 'bg-[#161616]',
    cardBorder: 'border-[#222222]',
    inputBg: 'bg-[#1a1a1a]',
    danger: 'text-red-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
  },
};

export function getTheme(theme: ThemeType): ThemeColors {
  return themes[theme];
}
