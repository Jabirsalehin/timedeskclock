/**
 * TimeDesk Theme Experience System
 * Each theme creates a unique workspace experience
 */

export type ThemeExperienceId = 
  | 'glass-executive'
  | 'amoled-ultra'
  | 'cyber-terminal'
  | 'trading-floor'
  | 'study-room'
  | 'prayer-theme'
  | 'swiss-watch'
  | 'space-observatory'
  | 'rainy-night'
  | 'focus-white'
  | 'retro-flip'
  | 'developer-dashboard'
  | 'minimal-monolith'
  | 'workspace-elite'
  | 'ambient-cinema';

export interface ThemeExperience {
  id: ThemeExperienceId;
  name: string;
  description: string;
  
  // Colors
  colors: {
    bg: string;
    bgSecondary: string;
    bgGradient?: string;
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
    success: string;
    warning: string;
    danger: string;
  };
  
  // Typography
  typography: {
    clockFont: string;
    bodyFont: string;
    clockWeight: string;
    clockLetterSpacing: string;
  };
  
  // Animation
  animation: {
    flipDuration: number; // ms
    flipEasing: string;
    transitionSpeed: 'instant' | 'fast' | 'normal' | 'slow';
    enableGlow: boolean;
    enablePulse: boolean;
  };
  
  // Layout
  layout: {
    density: 'compact' | 'normal' | 'spacious';
    borderRadius: 'sharp' | 'rounded' | 'pill';
    shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  };
  
  // Visual Effects
  effects: {
    blur: boolean;
    glassmorphism: boolean;
    noise: boolean;
    scanlines: boolean;
    vignette: boolean;
    ambientGlow: boolean;
  };
  
  // Clock specific
  clock: {
    colonStyle: 'dots' | 'solid' | 'blinking' | 'hidden';
    digitStyle: 'modern' | 'classic' | 'digital' | 'segment';
    showDate: boolean;
    datePosition: 'above' | 'below' | 'hidden';
  };
}

export const themeExperiences: Record<ThemeExperienceId, ThemeExperience> = {
  'glass-executive': {
    id: 'glass-executive',
    name: 'Glass Executive',
    description: 'Sophisticated glass morphism with executive presence',
    colors: {
      bg: '#0d1117',
      bgSecondary: 'rgba(13, 17, 23, 0.8)',
      bgGradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)',
      surface: 'rgba(255, 255, 255, 0.05)',
      surfaceHover: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.1)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.7)',
      textMuted: 'rgba(255, 255, 255, 0.4)',
      accent: '#60a5fa',
      accentHover: '#3b82f6',
      accentText: '#60a5fa',
      sidebar: 'rgba(13, 17, 23, 0.9)',
      card: 'rgba(255, 255, 255, 0.03)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      inputBg: 'rgba(255, 255, 255, 0.05)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f87171',
    },
    typography: {
      clockFont: "'SF Pro Display', 'Inter', system-ui",
      bodyFont: "'Inter', system-ui",
      clockWeight: '200',
      clockLetterSpacing: '-0.02em',
    },
    animation: {
      flipDuration: 250,
      flipEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionSpeed: 'normal',
      enableGlow: true,
      enablePulse: true,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'rounded',
      shadowIntensity: 'medium',
    },
    effects: {
      blur: true,
      glassmorphism: true,
      noise: false,
      scanlines: false,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'blinking',
      digitStyle: 'modern',
      showDate: true,
      datePosition: 'below',
    },
  },

  'amoled-ultra': {
    id: 'amoled-ultra',
    name: 'AMOLED Ultra',
    description: 'True black with vibrant accents, battery efficient',
    colors: {
      bg: '#000000',
      bgSecondary: '#000000',
      surface: '#0a0a0a',
      surfaceHover: '#111111',
      border: '#1a1a1a',
      text: '#ffffff',
      textSecondary: '#888888',
      textMuted: '#444444',
      accent: '#00d4ff',
      accentHover: '#00b8e6',
      accentText: '#00d4ff',
      sidebar: '#000000',
      card: '#050505',
      cardBorder: '#1a1a1a',
      inputBg: '#0a0a0a',
      success: '#00ff88',
      warning: '#ffaa00',
      danger: '#ff4444',
    },
    typography: {
      clockFont: "'JetBrains Mono', monospace",
      bodyFont: "'Inter', system-ui",
      clockWeight: '700',
      clockLetterSpacing: '0.05em',
    },
    animation: {
      flipDuration: 200,
      flipEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transitionSpeed: 'fast',
      enableGlow: true,
      enablePulse: false,
    },
    layout: {
      density: 'normal',
      borderRadius: 'rounded',
      shadowIntensity: 'none',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: false,
      scanlines: false,
      vignette: false,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'dots',
      digitStyle: 'digital',
      showDate: true,
      datePosition: 'below',
    },
  },

  'cyber-terminal': {
    id: 'cyber-terminal',
    name: 'Cyber Terminal',
    description: 'Hacker-style terminal with matrix vibes',
    colors: {
      bg: '#0a0f0a',
      bgSecondary: '#0d120d',
      bgGradient: 'linear-gradient(180deg, #0a0f0a 0%, #0a1a0a 100%)',
      surface: 'rgba(0, 255, 65, 0.05)',
      surfaceHover: 'rgba(0, 255, 65, 0.1)',
      border: 'rgba(0, 255, 65, 0.2)',
      text: '#00ff41',
      textSecondary: 'rgba(0, 255, 65, 0.7)',
      textMuted: 'rgba(0, 255, 65, 0.4)',
      accent: '#00ff41',
      accentHover: '#00cc33',
      accentText: '#00ff41',
      sidebar: '#080d08',
      card: 'rgba(0, 255, 65, 0.03)',
      cardBorder: 'rgba(0, 255, 65, 0.15)',
      inputBg: 'rgba(0, 255, 65, 0.05)',
      success: '#00ff41',
      warning: '#ffff00',
      danger: '#ff0040',
    },
    typography: {
      clockFont: "'JetBrains Mono', 'Fira Code', monospace",
      bodyFont: "'JetBrains Mono', monospace",
      clockWeight: '400',
      clockLetterSpacing: '0.1em',
    },
    animation: {
      flipDuration: 150,
      flipEasing: 'linear',
      transitionSpeed: 'instant',
      enableGlow: true,
      enablePulse: true,
    },
    layout: {
      density: 'compact',
      borderRadius: 'sharp',
      shadowIntensity: 'subtle',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: true,
      scanlines: true,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'blinking',
      digitStyle: 'segment',
      showDate: true,
      datePosition: 'above',
    },
  },

  'trading-floor': {
    id: 'trading-floor',
    name: 'Trading Floor',
    description: 'Professional trading dashboard aesthetic',
    colors: {
      bg: '#0c0e14',
      bgSecondary: '#10131a',
      surface: '#141820',
      surfaceHover: '#1a1f2a',
      border: '#252d3d',
      text: '#e5e7eb',
      textSecondary: '#9ca3af',
      textMuted: '#6b7280',
      accent: '#10b981',
      accentHover: '#059669',
      accentText: '#34d399',
      sidebar: '#0a0c10',
      card: '#12151d',
      cardBorder: '#1f2937',
      inputBg: '#151922',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
    typography: {
      clockFont: "'SF Mono', 'JetBrains Mono', monospace",
      bodyFont: "'Inter', system-ui",
      clockWeight: '600',
      clockLetterSpacing: '0.02em',
    },
    animation: {
      flipDuration: 180,
      flipEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionSpeed: 'fast',
      enableGlow: false,
      enablePulse: false,
    },
    layout: {
      density: 'compact',
      borderRadius: 'rounded',
      shadowIntensity: 'subtle',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: false,
      scanlines: false,
      vignette: false,
      ambientGlow: false,
    },
    clock: {
      colonStyle: 'solid',
      digitStyle: 'digital',
      showDate: true,
      datePosition: 'below',
    },
  },

  'study-room': {
    id: 'study-room',
    name: 'Study Room',
    description: 'Warm, focused environment for learning',
    colors: {
      bg: '#1a1612',
      bgSecondary: '#211d18',
      bgGradient: 'linear-gradient(180deg, #1a1612 0%, #15120f 100%)',
      surface: 'rgba(255, 200, 150, 0.05)',
      surfaceHover: 'rgba(255, 200, 150, 0.08)',
      border: 'rgba(255, 200, 150, 0.1)',
      text: '#f5e6d3',
      textSecondary: 'rgba(245, 230, 211, 0.7)',
      textMuted: 'rgba(245, 230, 211, 0.4)',
      accent: '#d4a574',
      accentHover: '#c49464',
      accentText: '#d4a574',
      sidebar: '#15120f',
      card: 'rgba(255, 200, 150, 0.03)',
      cardBorder: 'rgba(255, 200, 150, 0.08)',
      inputBg: 'rgba(255, 200, 150, 0.05)',
      success: '#86c17a',
      warning: '#e6b455',
      danger: '#d97373',
    },
    typography: {
      clockFont: "'Crimson Pro', 'Georgia', serif",
      bodyFont: "'Inter', system-ui",
      clockWeight: '300',
      clockLetterSpacing: '0.02em',
    },
    animation: {
      flipDuration: 300,
      flipEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionSpeed: 'slow',
      enableGlow: true,
      enablePulse: false,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'rounded',
      shadowIntensity: 'medium',
    },
    effects: {
      blur: true,
      glassmorphism: false,
      noise: true,
      scanlines: false,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'solid',
      digitStyle: 'classic',
      showDate: true,
      datePosition: 'below',
    },
  },

  'prayer-theme': {
    id: 'prayer-theme',
    name: 'Prayer Theme',
    description: 'Serene, spiritual atmosphere for reflection',
    colors: {
      bg: '#0f1419',
      bgSecondary: '#151c24',
      bgGradient: 'linear-gradient(180deg, #0f1419 0%, #0a1628 100%)',
      surface: 'rgba(100, 180, 200, 0.05)',
      surfaceHover: 'rgba(100, 180, 200, 0.08)',
      border: 'rgba(100, 180, 200, 0.12)',
      text: '#e0f0f5',
      textSecondary: 'rgba(224, 240, 245, 0.7)',
      textMuted: 'rgba(224, 240, 245, 0.4)',
      accent: '#4db8d3',
      accentHover: '#3aa8c3',
      accentText: '#6dcce6',
      sidebar: '#0c1117',
      card: 'rgba(77, 184, 211, 0.03)',
      cardBorder: 'rgba(77, 184, 211, 0.1)',
      inputBg: 'rgba(77, 184, 211, 0.05)',
      success: '#4db882',
      warning: '#d4a855',
      danger: '#d46b6b',
    },
    typography: {
      clockFont: "'Amiri', 'Georgia', serif",
      bodyFont: "'Inter', system-ui",
      clockWeight: '400',
      clockLetterSpacing: '0.05em',
    },
    animation: {
      flipDuration: 350,
      flipEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      transitionSpeed: 'slow',
      enableGlow: true,
      enablePulse: true,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'rounded',
      shadowIntensity: 'subtle',
    },
    effects: {
      blur: true,
      glassmorphism: true,
      noise: false,
      scanlines: false,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'dots',
      digitStyle: 'classic',
      showDate: true,
      datePosition: 'below',
    },
  },

  'swiss-watch': {
    id: 'swiss-watch',
    name: 'Swiss Watch',
    description: 'Precision engineering meets luxury design',
    colors: {
      bg: '#f8f6f3',
      bgSecondary: '#ffffff',
      surface: '#ffffff',
      surfaceHover: '#f5f3f0',
      border: '#e8e4df',
      text: '#1a1a1a',
      textSecondary: '#4a4a4a',
      textMuted: '#8a8a8a',
      accent: '#c9a961',
      accentHover: '#b8984f',
      accentText: '#8b6914',
      sidebar: '#faf8f5',
      card: '#ffffff',
      cardBorder: '#ebe7e2',
      inputBg: '#f5f3f0',
      success: '#2d6a4f',
      warning: '#b8860b',
      danger: '#9b2c2c',
    },
    typography: {
      clockFont: "'Playfair Display', 'Georgia', serif",
      bodyFont: "'Inter', system-ui",
      clockWeight: '400',
      clockLetterSpacing: '0.08em',
    },
    animation: {
      flipDuration: 280,
      flipEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transitionSpeed: 'normal',
      enableGlow: false,
      enablePulse: false,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'rounded',
      shadowIntensity: 'subtle',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: false,
      scanlines: false,
      vignette: false,
      ambientGlow: false,
    },
    clock: {
      colonStyle: 'solid',
      digitStyle: 'classic',
      showDate: true,
      datePosition: 'below',
    },
  },

  'space-observatory': {
    id: 'space-observatory',
    name: 'Space Observatory',
    description: 'Cosmic exploration with stellar aesthetics',
    colors: {
      bg: '#050510',
      bgSecondary: '#0a0a1a',
      bgGradient: 'radial-gradient(ellipse at center, #0a0a20 0%, #050510 70%)',
      surface: 'rgba(100, 100, 200, 0.08)',
      surfaceHover: 'rgba(100, 100, 200, 0.12)',
      border: 'rgba(150, 150, 255, 0.15)',
      text: '#e0e0ff',
      textSecondary: 'rgba(224, 224, 255, 0.7)',
      textMuted: 'rgba(224, 224, 255, 0.4)',
      accent: '#8b8bff',
      accentHover: '#7070ff',
      accentText: '#a0a0ff',
      sidebar: '#040410',
      card: 'rgba(100, 100, 200, 0.05)',
      cardBorder: 'rgba(150, 150, 255, 0.1)',
      inputBg: 'rgba(100, 100, 200, 0.08)',
      success: '#50fa7b',
      warning: '#ffb86c',
      danger: '#ff5555',
    },
    typography: {
      clockFont: "'Space Mono', 'JetBrains Mono', monospace",
      bodyFont: "'Inter', system-ui",
      clockWeight: '400',
      clockLetterSpacing: '0.1em',
    },
    animation: {
      flipDuration: 250,
      flipEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionSpeed: 'normal',
      enableGlow: true,
      enablePulse: true,
    },
    layout: {
      density: 'normal',
      borderRadius: 'rounded',
      shadowIntensity: 'medium',
    },
    effects: {
      blur: true,
      glassmorphism: true,
      noise: true,
      scanlines: false,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'blinking',
      digitStyle: 'digital',
      showDate: true,
      datePosition: 'below',
    },
  },

  'rainy-night': {
    id: 'rainy-night',
    name: 'Rainy Night',
    description: 'Cozy atmosphere with rain-inspired tones',
    colors: {
      bg: '#141820',
      bgSecondary: '#1a1f2a',
      bgGradient: 'linear-gradient(180deg, #141820 0%, #1a2030 100%)',
      surface: 'rgba(100, 150, 200, 0.08)',
      surfaceHover: 'rgba(100, 150, 200, 0.12)',
      border: 'rgba(100, 150, 200, 0.12)',
      text: '#d0dde8',
      textSecondary: 'rgba(208, 221, 232, 0.7)',
      textMuted: 'rgba(208, 221, 232, 0.4)',
      accent: '#5d9ecf',
      accentHover: '#4d8ebf',
      accentText: '#7db4df',
      sidebar: '#10141a',
      card: 'rgba(100, 150, 200, 0.05)',
      cardBorder: 'rgba(100, 150, 200, 0.1)',
      inputBg: 'rgba(100, 150, 200, 0.08)',
      success: '#5daf8f',
      warning: '#cfaa5d',
      danger: '#cf6d6d',
    },
    typography: {
      clockFont: "'Inter', system-ui",
      bodyFont: "'Inter', system-ui",
      clockWeight: '300',
      clockLetterSpacing: '-0.02em',
    },
    animation: {
      flipDuration: 300,
      flipEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      transitionSpeed: 'slow',
      enableGlow: true,
      enablePulse: false,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'pill',
      shadowIntensity: 'medium',
    },
    effects: {
      blur: true,
      glassmorphism: true,
      noise: true,
      scanlines: false,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'dots',
      digitStyle: 'modern',
      showDate: true,
      datePosition: 'below',
    },
  },

  'focus-white': {
    id: 'focus-white',
    name: 'Focus White',
    description: 'Clean, distraction-free white workspace',
    colors: {
      bg: '#ffffff',
      bgSecondary: '#fafafa',
      surface: '#f5f5f5',
      surfaceHover: '#efefef',
      border: '#e5e5e5',
      text: '#171717',
      textSecondary: '#525252',
      textMuted: '#a3a3a3',
      accent: '#3b82f6',
      accentHover: '#2563eb',
      accentText: '#1d4ed8',
      sidebar: '#fafafa',
      card: '#ffffff',
      cardBorder: '#e5e5e5',
      inputBg: '#f5f5f5',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
    typography: {
      clockFont: "'SF Pro Display', 'Inter', system-ui",
      bodyFont: "'Inter', system-ui",
      clockWeight: '200',
      clockLetterSpacing: '-0.03em',
    },
    animation: {
      flipDuration: 220,
      flipEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionSpeed: 'fast',
      enableGlow: false,
      enablePulse: false,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'rounded',
      shadowIntensity: 'subtle',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: false,
      scanlines: false,
      vignette: false,
      ambientGlow: false,
    },
    clock: {
      colonStyle: 'solid',
      digitStyle: 'modern',
      showDate: true,
      datePosition: 'below',
    },
  },

  'retro-flip': {
    id: 'retro-flip',
    name: 'Retro Flip',
    description: 'Classic flip clock nostalgia',
    colors: {
      bg: '#2a2520',
      bgSecondary: '#332e28',
      surface: '#3d3730',
      surfaceHover: '#474038',
      border: '#4a433b',
      text: '#f5e6c8',
      textSecondary: '#c9ba9c',
      textMuted: '#8a7d68',
      accent: '#e8a84c',
      accentHover: '#d4973d',
      accentText: '#f0b860',
      sidebar: '#252118',
      card: '#352f28',
      cardBorder: '#443d35',
      inputBg: '#3a342c',
      success: '#7fb069',
      warning: '#e8a84c',
      danger: '#c95d4f',
    },
    typography: {
      clockFont: "'Roboto Slab', 'Georgia', serif",
      bodyFont: "'Inter', system-ui",
      clockWeight: '700',
      clockLetterSpacing: '0.02em',
    },
    animation: {
      flipDuration: 320,
      flipEasing: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
      transitionSpeed: 'normal',
      enableGlow: false,
      enablePulse: false,
    },
    layout: {
      density: 'normal',
      borderRadius: 'rounded',
      shadowIntensity: 'strong',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: true,
      scanlines: false,
      vignette: true,
      ambientGlow: false,
    },
    clock: {
      colonStyle: 'solid',
      digitStyle: 'classic',
      showDate: true,
      datePosition: 'below',
    },
  },

  'developer-dashboard': {
    id: 'developer-dashboard',
    name: 'Developer Dashboard',
    description: 'IDE-inspired workspace for coders',
    colors: {
      bg: '#1e1e1e',
      bgSecondary: '#252526',
      surface: '#2d2d2d',
      surfaceHover: '#3c3c3c',
      border: '#3c3c3c',
      text: '#d4d4d4',
      textSecondary: '#9d9d9d',
      textMuted: '#6d6d6d',
      accent: '#569cd6',
      accentHover: '#4a8cc2',
      accentText: '#9cdcfe',
      sidebar: '#181818',
      card: '#252526',
      cardBorder: '#3c3c3c',
      inputBg: '#2d2d2d',
      success: '#4ec9b0',
      warning: '#dcdcaa',
      danger: '#f14c4c',
    },
    typography: {
      clockFont: "'Cascadia Code', 'Fira Code', monospace",
      bodyFont: "'Cascadia Code', 'Inter', system-ui",
      clockWeight: '400',
      clockLetterSpacing: '0.05em',
    },
    animation: {
      flipDuration: 180,
      flipEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionSpeed: 'fast',
      enableGlow: false,
      enablePulse: false,
    },
    layout: {
      density: 'compact',
      borderRadius: 'sharp',
      shadowIntensity: 'none',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: false,
      scanlines: false,
      vignette: false,
      ambientGlow: false,
    },
    clock: {
      colonStyle: 'solid',
      digitStyle: 'segment',
      showDate: true,
      datePosition: 'below',
    },
  },

  'minimal-monolith': {
    id: 'minimal-monolith',
    name: 'Minimal Monolith',
    description: 'Ultra-minimal black and white aesthetic',
    colors: {
      bg: '#111111',
      bgSecondary: '#161616',
      surface: '#1a1a1a',
      surfaceHover: '#222222',
      border: '#2a2a2a',
      text: '#e0e0e0',
      textSecondary: '#888888',
      textMuted: '#555555',
      accent: '#ffffff',
      accentHover: '#e0e0e0',
      accentText: '#ffffff',
      sidebar: '#0d0d0d',
      card: '#161616',
      cardBorder: '#252525',
      inputBg: '#1a1a1a',
      success: '#a0a0a0',
      warning: '#888888',
      danger: '#ffffff',
    },
    typography: {
      clockFont: "'Inter', system-ui",
      bodyFont: "'Inter', system-ui",
      clockWeight: '100',
      clockLetterSpacing: '-0.05em',
    },
    animation: {
      flipDuration: 200,
      flipEasing: 'linear',
      transitionSpeed: 'instant',
      enableGlow: false,
      enablePulse: false,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'sharp',
      shadowIntensity: 'none',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: false,
      scanlines: false,
      vignette: false,
      ambientGlow: false,
    },
    clock: {
      colonStyle: 'hidden',
      digitStyle: 'modern',
      showDate: false,
      datePosition: 'hidden',
    },
  },

  'workspace-elite': {
    id: 'workspace-elite',
    name: 'Workspace Elite',
    description: 'Premium dark workspace with golden accents',
    colors: {
      bg: '#0f0f12',
      bgSecondary: '#14141a',
      surface: '#1a1a22',
      surfaceHover: '#22222c',
      border: '#2a2a36',
      text: '#f0f0f5',
      textSecondary: '#a0a0aa',
      textMuted: '#606068',
      accent: '#c9a227',
      accentHover: '#b8911a',
      accentText: '#d4b33d',
      sidebar: '#0c0c10',
      card: '#16161c',
      cardBorder: '#26262e',
      inputBg: '#1c1c24',
      success: '#27c96a',
      warning: '#c9a227',
      danger: '#c94040',
    },
    typography: {
      clockFont: "'SF Pro Display', 'Inter', system-ui",
      bodyFont: "'Inter', system-ui",
      clockWeight: '300',
      clockLetterSpacing: '0.02em',
    },
    animation: {
      flipDuration: 260,
      flipEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionSpeed: 'normal',
      enableGlow: true,
      enablePulse: false,
    },
    layout: {
      density: 'normal',
      borderRadius: 'rounded',
      shadowIntensity: 'medium',
    },
    effects: {
      blur: false,
      glassmorphism: false,
      noise: false,
      scanlines: false,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'dots',
      digitStyle: 'modern',
      showDate: true,
      datePosition: 'below',
    },
  },

  'ambient-cinema': {
    id: 'ambient-cinema',
    name: 'Ambient Cinema',
    description: 'Cinematic atmosphere with dramatic lighting',
    colors: {
      bg: '#0a0a0c',
      bgSecondary: '#101014',
      bgGradient: 'radial-gradient(ellipse at 50% 0%, #1a1a25 0%, #0a0a0c 60%)',
      surface: 'rgba(255, 255, 255, 0.04)',
      surfaceHover: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.08)',
      text: '#ffffff',
      textSecondary: 'rgba(255, 255, 255, 0.65)',
      textMuted: 'rgba(255, 255, 255, 0.35)',
      accent: '#e64980',
      accentHover: '#d43b70',
      accentText: '#ff6b9d',
      sidebar: '#080809',
      card: 'rgba(255, 255, 255, 0.02)',
      cardBorder: 'rgba(255, 255, 255, 0.06)',
      inputBg: 'rgba(255, 255, 255, 0.04)',
      success: '#36d399',
      warning: '#fbbd23',
      danger: '#f87272',
    },
    typography: {
      clockFont: "'DM Sans', 'Inter', system-ui",
      bodyFont: "'Inter', system-ui",
      clockWeight: '300',
      clockLetterSpacing: '0.03em',
    },
    animation: {
      flipDuration: 280,
      flipEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      transitionSpeed: 'normal',
      enableGlow: true,
      enablePulse: true,
    },
    layout: {
      density: 'spacious',
      borderRadius: 'pill',
      shadowIntensity: 'strong',
    },
    effects: {
      blur: true,
      glassmorphism: true,
      noise: true,
      scanlines: false,
      vignette: true,
      ambientGlow: true,
    },
    clock: {
      colonStyle: 'blinking',
      digitStyle: 'modern',
      showDate: true,
      datePosition: 'below',
    },
  },
};

// Get CSS classes based on theme
export function getThemeClasses(theme: ThemeExperience) {
  const radiusMap = {
    sharp: 'rounded-none',
    rounded: 'rounded-xl',
    pill: 'rounded-2xl',
  };

  const densityMap = {
    compact: { padding: 'p-2', gap: 'gap-2' },
    normal: { padding: 'p-4', gap: 'gap-4' },
    spacious: { padding: 'p-6', gap: 'gap-6' },
  };

  return {
    radius: radiusMap[theme.layout.borderRadius],
    ...densityMap[theme.layout.density],
  };
}

// Default export of theme list for settings
export const themeList = Object.values(themeExperiences).map(t => ({
  id: t.id,
  name: t.name,
  description: t.description,
  preview: {
    bg: t.colors.bg,
    accent: t.colors.accent,
    text: t.colors.text,
  },
}));
