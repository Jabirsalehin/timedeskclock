import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useStore } from './useStore';
import { useWidgetStore } from './widgetStore';

export type ProfileId = 'minimal' | 'student' | 'developer' | 'trader' | 'prayer';
export type WidgetVisibilityMode = 'always' | 'auto-hide' | 'hidden';
export type FullscreenToolVisibility = 'show' | 'hide' | 'auto-hide';

export interface ProfileConfig {
  id: ProfileId;
  name: string;
  description: string;
  emoji: string;
  accentColor: string;
  accentColorRgb: string;
  accentColorLight: string;
  widgets: string[];
  quickActions: string[];
}

export const profileConfigs: Record<ProfileId, ProfileConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Distraction-free, clock-focused experience',
    emoji: '✨',
    accentColor: '#ffffff',
    accentColorRgb: '255, 255, 255',
    accentColorLight: 'rgba(255, 255, 255, 0.1)',
    widgets: ['day-progress', 'week-progress'],
    quickActions: ['fullscreen', 'timer'],
  },
  student: {
    id: 'student',
    name: 'Student',
    description: 'Study-focused workspace with academic tools',
    emoji: '📚',
    accentColor: '#a855f7',
    accentColorRgb: '168, 85, 247',
    accentColorLight: 'rgba(168, 85, 247, 0.1)',
    widgets: ['study-tasks', 'pomodoro', 'study-stopwatch', 'exam-countdown', 'focus-hours', 'study-reminders'],
    quickActions: ['pomodoro', 'stopwatch', 'focus'],
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    description: 'Code-focused productivity workspace',
    emoji: '💻',
    accentColor: '#3b82f6',
    accentColorRgb: '59, 130, 246',
    accentColorLight: 'rgba(59, 130, 246, 0.1)',
    widgets: ['utc-time', 'unix-timestamp', 'world-clocks', 'coding-stopwatch', 'sprint-countdown', 'current-task', 'focus-tracker'],
    quickActions: ['stopwatch', 'timer', 'worldclock'],
  },
  trader: {
    id: 'trader',
    name: 'Trader',
    description: 'Market-focused trading workspace',
    emoji: '📈',
    accentColor: '#10b981',
    accentColorRgb: '16, 185, 129',
    accentColorLight: 'rgba(16, 185, 129, 0.1)',
    widgets: ['market-sessions', 'market-countdown', 'trading-tasks', 'trading-timer'],
    quickActions: ['worldclock', 'alarm', 'timer'],
  },
  prayer: {
    id: 'prayer',
    name: 'Prayer',
    description: 'Spiritual workspace with prayer times',
    emoji: '🕌',
    accentColor: '#d4a574',
    accentColorRgb: '212, 165, 116',
    accentColorLight: 'rgba(212, 165, 116, 0.1)',
    widgets: ['next-prayer', 'prayer-countdown', 'hijri-date', 'ramadan-countdown', 'prayer-reminders'],
    quickActions: ['alarm', 'reminder', 'focus'],
  },
};

export interface ProfileDisplaySettings {
  /** Profile widgets ON/OFF — independent from active profile identity */
  widgetsEnabled: boolean;
  /** Whether tools may appear in fullscreen mode */
  fullscreenToolsEnabled: boolean;
  /** Widget panel visibility in normal clock view */
  widgetVisibility: WidgetVisibilityMode;
  /** Tool visibility when in Clock + Tools fullscreen */
  fullscreenToolVisibility: FullscreenToolVisibility;
}

interface ProfileState {
  activeProfile: ProfileId;
  setActiveProfile: (profile: ProfileId) => void;
  widgetsPanelExpanded: boolean;
  toggleWidgetsPanel: () => void;

  displaySettings: ProfileDisplaySettings;
  setWidgetsEnabled: (enabled: boolean) => void;
  setFullscreenToolsEnabled: (enabled: boolean) => void;
  setWidgetVisibility: (mode: WidgetVisibilityMode) => void;
  setFullscreenToolVisibility: (mode: FullscreenToolVisibility) => void;
  
  // Profile-specific data
  examDate: string | null;
  setExamDate: (date: string | null) => void;
  sprintEndDate: string | null;
  setSprintEndDate: (date: string | null) => void;
  currentTask: string;
  setCurrentTask: (task: string) => void;
  
  // Prayer times (simplified - would integrate with API in production)
  prayerTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  setPrayerTimes: (times: ProfileState['prayerTimes']) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: 'minimal',
      setActiveProfile: (profile) => {
        set({ activeProfile: profile });
        useStore.getState().setWorkspaceProfile(profile);
        useWidgetStore.getState().loadProfileLayout(profile);
      },
      widgetsPanelExpanded: true,
      toggleWidgetsPanel: () => set((s) => ({ widgetsPanelExpanded: !s.widgetsPanelExpanded })),

      displaySettings: {
        widgetsEnabled: true,
        fullscreenToolsEnabled: true,
        widgetVisibility: 'always',
        fullscreenToolVisibility: 'show',
      },
      setWidgetsEnabled: (enabled) =>
        set((s) => ({ displaySettings: { ...s.displaySettings, widgetsEnabled: enabled } })),
      setFullscreenToolsEnabled: (enabled) =>
        set((s) => ({ displaySettings: { ...s.displaySettings, fullscreenToolsEnabled: enabled } })),
      setWidgetVisibility: (mode) =>
        set((s) => ({ displaySettings: { ...s.displaySettings, widgetVisibility: mode } })),
      setFullscreenToolVisibility: (mode) =>
        set((s) => ({ displaySettings: { ...s.displaySettings, fullscreenToolVisibility: mode } })),
      
      examDate: null,
      setExamDate: (date) => set({ examDate: date }),
      sprintEndDate: null,
      setSprintEndDate: (date) => set({ sprintEndDate: date }),
      currentTask: '',
      setCurrentTask: (task) => set({ currentTask: task }),
      
      prayerTimes: {
        fajr: '05:30',
        dhuhr: '12:30',
        asr: '15:45',
        maghrib: '18:30',
        isha: '20:00',
      },
      setPrayerTimes: (times) => set({ prayerTimes: times }),
    }),
    {
      name: 'timedesk-profiles',
    }
  )
);

// Helper to get current profile config
export function getProfileConfig(id: ProfileId): ProfileConfig {
  return profileConfigs[id];
}

// Helper to get accent color CSS variable
export function getProfileAccent(id: ProfileId): string {
  return profileConfigs[id].accentColor;
}
